
import { RawAnalysisResult } from "@/app/instagram/types";
import genAI from "@/lib/gemini";
import { BRUTAL_ANALYST_SYSTEM_PROMPT } from "@/lib/prompts/brutal-analyst";
import { INSTAGRAM_ANALYSIS_SCHEMA } from "@/lib/schemas/analysis";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { buildBrutalUserPrompt } from "@/services/instagram/prompt-builder";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rawData, promptType = 'INSTA' } = body; // rawData is array of RawAnalysisResult

    if (!rawData || !Array.isArray(rawData)) {
      return NextResponse.json({ error: "Invalid raw data" }, { status: 400 });
    }

    // Fetch analysis limit and system prompt from DB
    let analysisLimit = 10;
    let systemPrompt = BRUTAL_ANALYST_SYSTEM_PROMPT; // Default fallback
    
    // Validate promptType
    const validPromptType = (promptType === 'INSTA' || promptType === 'INSTA_TARGET') ? promptType : 'INSTA';

    try {
      // Parallel fetch for Settings and Prompt
      const [settingRes, promptRes] = await Promise.all([
        supabase.from('settings').select('value').eq('key', 'insta_analysis_limit').single(),
        supabase.from('prompts').select('content').eq('prompt_type', validPromptType).eq('is_default', true).single()
      ]);
      
      if (settingRes.data?.value) {
        analysisLimit = parseInt(settingRes.data.value, 10) || 10;
      }
      
      if (promptRes.data?.content) {
        systemPrompt = promptRes.data.content;
      }
    } catch (e) {
      console.warn("Failed to fetch settings/prompt from DB, using defaults", e);
    }

    const analysisSchema = INSTAGRAM_ANALYSIS_SCHEMA;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        responseSchema: analysisSchema as any,
        temperature: 0.3
      }
    });

    const analyzedResults = await Promise.all(
      rawData.map(async (raw: RawAnalysisResult) => {
        if (!raw.success || !raw.verifiedProfile || !raw.metrics) {
            return {
                username: raw.username,
                success: false,
                error: "Missing required raw data for verification"
            };
        }

        const user = raw.verifiedProfile;
        const posts = raw.recent_posts || [];

        // Prepare posts data (slice for AI context)
        const postsData = posts
          .slice(0, analysisLimit)
          .map((post: any) => {
             // Adapt field names if necessary. Assuming fetch-raw normalized them.
             // fetch-raw puts: likes, comments (number), timestamp.
             // But prompt needs comments text.
             // Oh, fetch-raw might have stripped comments text if I wasn't careful.
             // Checking fetch-raw code: I passed fetchedPosts = postItems directly.
             // Apify postItems often contain `latestComments` or similar.
             // I need to ensure fetch-raw preserves comment text access.
             
             // Re-checking fetch-raw... I mapped `fetchedPosts = postItems.map...`
             // and returned `recent_posts: fetchedPosts`.
             // I verified `latest_comments` is crucial. 
             // In fetch-raw, I did `...p`. So raw Apify fields should be there.
             // Apify fields: `latestComments` usually.
             
            const fanComments = (post.latestComments || post.latest_comments || [])
              .filter((c: any) => c.ownerUsername !== user.username)
              .slice(0, 20);

            return {
              caption: post.caption || '',
              hashtags: post.hashtags || [],
              comments: fanComments.map((c: any) => ({
                username: c.ownerUsername || 'unknown',
                text: c.text || '',
                likes: c.likesCount || c.likes || 0
              }))
            };
          });

        const userPrompt = buildBrutalUserPrompt({
          username: user.username,
          fullName: user.fullName || '',
          biography: user.biography || '',
          followers: user.followers,
          metrics: { 
              ...raw.metrics, 
              erGrade: raw.metrics.erGrade || '미산정',
              // Fix potential type mismatch for avgUploadCycle (number | null -> number w/ fallback handled in string)
           } as any, 
          trendMetrics: raw.trendMetrics || undefined,
          postsData: postsData
        });

        // Prepare images
        // We need to fetch images again here? Or did we pass base64? Passing base64 is heavy.
        // Better to fetch here by URL.
        const imageParts = [];
        for (const post of posts.slice(0, analysisLimit)) {
             // Use displayUrl or imageUrl
             const imgUrl = post.displayUrl || post.imageUrl || post.display_url;
             if (imgUrl) {
                try {
                  const imageResp = await fetch(imgUrl, {
                    headers: {
                      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                      "Referer": "https://www.instagram.com/"
                    }
                  });

                  if (imageResp.ok) {
                    const imageBuffer = await imageResp.arrayBuffer();
                    imageParts.push({
                      inlineData: {
                        data: Buffer.from(imageBuffer).toString("base64"),
                        mimeType: "image/jpeg"
                      }
                    });
                  }
                } catch (e) {
                  console.error(`Failed to fetch image for ${user.username} in AI stage`, e);
                }
             }
        }

        try {
          const fullPrompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;
          const result = await model.generateContent([fullPrompt, ...imageParts]);
          const response = await result.response;
          const text = response.text();

          let cleanedText = text
            .replace(/^```json\s*/, '')
            .replace(/^```\s*/, '')
            .replace(/\s*```$/, '');
          
          let analysis = JSON.parse(cleanedText);
          
          // Re-enforce Source of Truth logic just in case AI overwrites basicStats
          if (!analysis.basicStats) analysis.basicStats = {};
          analysis.basicStats.username = user.username;
          analysis.basicStats.followers = user.followers;
          analysis.basicStats.profilePicUrl = user.profilePicUrl || null;

          // [NEW] Persist to Database for Knowledge Base (RAG)
          // We use supabaseAdmin to bypass RLS and ensure the data is saved as systematic knowledge.
          if (supabaseAdmin) {
            try {
              // 1. Check for existing record to handle lack of unique constraint on username
              const { data: existing } = await supabaseAdmin
                .from('analysis_history')
                .select('id')
                .eq('username', user.username.toLowerCase().trim())
                .order('analyzed_at', { ascending: false })
                .limit(1)
                .maybeSingle();

              const analysisData = {
                username: user.username.toLowerCase().trim(),
                followers: user.followers || 0,
                er: raw.metrics?.engagementRate || 0,
                bot_ratio: analysis.metrics?.botRatio || 0,
                purchase_keyword_ratio: analysis.metrics?.purchaseKeywordRatio || 0,
                tier: analysis.investmentAnalyst?.tier || 'D',
                grade: analysis.influencerExpert?.grade || 'Potential', // Must match CHECK constraint
                profile_pic_url: user.profilePicUrl || null,
                full_analysis: analysis,
                analyzed_at: new Date().toISOString()
              };

              if (existing) {
                // Update existing
                await supabaseAdmin
                  .from('analysis_history')
                  .update(analysisData)
                  .eq('id', existing.id);
                console.log(`[DB Update Success] ${user.username} updated in Knowledge Base.`);
              } else {
                // Insert new
                await supabaseAdmin
                  .from('analysis_history')
                  .insert([analysisData]);
                console.log(`[DB Insert Success] ${user.username} added to Knowledge Base.`);
              }
            } catch (dbEx) {
              console.error(`[DB Exception] ${user.username}:`, dbEx);
            }
          }

          return {
            username: user.username,
            analysis, // The qualitative analysis
            verifiedProfile: user, // Pass it back for consistency context
            trendMetrics: raw.trendMetrics,
            success: true
          };

        } catch (error: any) {
          console.error(`AI Analysis failed for ${user.username}`, error);
          return {
            username: user.username,
            success: false,
            error: error.message
          };
        }
      })
    );

    return NextResponse.json({ results: analyzedResults });

  } catch (error: any) {
    console.error("AI Analysis Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
