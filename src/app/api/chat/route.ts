import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { runHunterAgent } from "@/lib/agent/core";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Allow up to 60s for agent analysis

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationId } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 2. Load Chat History from DB (if conversationId exists)
    let chatHistory: any[] = [];
    let activeConversationId = conversationId;
    
    if (supabaseAdmin && activeConversationId) {
        // Fetch last N messages
        const { data: messages } = await supabaseAdmin
            .from('messages')
            .select('role, content')
            .eq('conversation_id', activeConversationId)
            .order('created_at', { ascending: true })
            .limit(20); // Increased limit for better context
            
        if (messages) {
            chatHistory = messages.map(m => ({
                role: m.role,
                content: m.content
            }));
        }
    }

    // 2a. Check Analysis History (Cache)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const usernameMatch = message.match(/@?([a-zA-Z0-9._]+)/);
    
    if (usernameMatch && supabaseAdmin) {
        const potentialUsername = usernameMatch[1].toLowerCase();
        try {
            const { data: recentAnalysis } = await supabaseAdmin
                .from("analysis_history")
                .select("*")
                .eq("username", potentialUsername)
                .neq("profile_pic_url", null) 
                .gt("created_at", twentyFourHoursAgo.toISOString())
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (recentAnalysis) {
                console.log(`[Cache Hit] Returning recent analysis for ${potentialUsername}`);
                return NextResponse.json({
                    response: JSON.stringify(recentAnalysis.full_analysis),
                    steps: [],
                    conversationId: activeConversationId
                });
            }
        } catch (cacheError) {
            console.warn("[Cache] Lookup failed:", cacheError);
        }
    }

    // 3. Run Agent
    const agentResult = await runHunterAgent(message, chatHistory);
    console.log("[API] Agent Output:", agentResult.output);

    // 4. Save to DB
    if (supabaseAdmin && session.user.email) {
        try {
            // A. Resolve User ID (from allowed_users)
            // Note: Since we use NextAuth, we link to 'allowed_users' table, NOT 'auth.users'.
            // Requires schema adjustment if FK was set to auth.users.
            const { data: user } = await supabaseAdmin
                .from('allowed_users')
                .select('id')
                .eq('email', session.user.email)
                .single();

            if (user) {
                // B. Create Conversation if Needed
                if (!activeConversationId) {
                    const title = message.length > 30 ? message.substring(0, 30) + "..." : message;
                    
                    const { data: newConv, error: convError } = await supabaseAdmin
                        .from('conversations')
                        .insert({
                            user_id: user.id,
                            title: title
                        })
                        .select()
                        .single();
                    
                    if (!convError && newConv) {
                        activeConversationId = newConv.id;
                    } else {
                        console.error("[API] Failed to create conversation:", convError);
                    }
                }

                // C. Insert Messages & Analysis History
                if (activeConversationId) {
                    await supabaseAdmin.from('messages').insert([
                        { 
                            conversation_id: activeConversationId, 
                            role: 'user', 
                            content: message 
                        },
                        { 
                            conversation_id: activeConversationId, 
                            role: 'assistant', 
                            content: agentResult.output 
                        }
                    ]);

                    // D. Save to Analysis History if valid JSON found
                    try {
                        const firstBrace = agentResult.output.indexOf("{");
                        const lastBrace = agentResult.output.lastIndexOf("}");
                        if (firstBrace !== -1 && lastBrace !== -1) {
                            const jsonString = agentResult.output.substring(firstBrace, lastBrace + 1);
                            const parsed = JSON.parse(jsonString);
                            
                            if (parsed.investmentAnalyst && parsed.influencerExpert && parsed.basicStats) {
                                await supabaseAdmin.from('analysis_history').insert([{
                                    username: (parsed.basicStats.username || '').replace('@', '').toLowerCase().trim(),
                                    followers: parsed.basicStats.followers || 0,
                                    er: parsed.basicStats.er || 0,
                                    bot_ratio: parsed.basicStats.botRatio || 0,
                                    purchase_keyword_ratio: parsed.basicStats.purchaseKeywordRatio || 0,
                                    profile_pic_url: parsed.basicStats.profilePicUrl || null,
                                    tier: parsed.investmentAnalyst.tier,
                                    grade: parsed.influencerExpert.grade,
                                    full_analysis: parsed,
                                    created_by: user.id
                                }]);
                                console.log("[API] Analysis saved to history for:", parsed.basicStats.username);
                            }
                        }
                    } catch (pError) {
                        console.warn("[API] Failed to parse/save analysis history:", pError);
                    }
                }
            }
        } catch (dbError) {
            console.error("[API] DB Save Error:", dbError);
            // Non-blocking: don't fail the request if DB fails, just log it
        }
    }

    return NextResponse.json({
      response: agentResult.output,
      steps: agentResult.steps,
      conversationId: activeConversationId // Return ID for frontend to update URL
    });

  } catch (error: any) {
    console.error("[API] Chat Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}
