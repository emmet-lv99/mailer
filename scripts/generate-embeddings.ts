import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables locally for the script
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.ANMOK_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !geminiApiKey) {
  console.error('❌ Missing credentials (SUPABASE or GEMINI_API_KEY). Check .env.local');
  process.exit(1);
}

// Init Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Init Gemini (Standalone init for script execution to avoid module resolution issues with @ alias if running via ts-node directly without mapping)
// Actually, since we run via 'tsx', alias might work if configured in tsconfig, 
// but to be safe and standalone, I'll re-init Gemini here or use a helper that doesn't rely on '@/' alias if possible.
// Or just rely on 'tsx' handling tsconfig paths.
// For robustness in this script, I'll re-implement the simple embedding call here to ensure it works zero-config.
const genAI = new GoogleGenerativeAI(geminiApiKey);

async function generateEmbedding(text: string): Promise<number[]> {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

async function processPendingEmbeddings() {
  console.log('💎 Starting Embedding Generation...');

  // 1. Fetch records without embeddings
  const { data: pending, error } = await supabase
    .from('analysis_history')
    .select('*')
    .is('embedding', null)
    .limit(50); // Process batch of 50

  if (error) {
    console.error('Failed to fetch pending records:', error);
    return;
  }

  if (!pending || pending.length === 0) {
    console.log('✅ No pending records found. All up to date.');
    return;
  }

  console.log(`Found ${pending.length} records to process.`);

  for (const record of pending) {
    try {
        // Construct text representation
        // Safe access to full_analysis props
        const fullAnalysis = record.full_analysis || {};
        const profile = fullAnalysis.profile || {};
        
        // Extract meaningful text
        const textToEmbed = `
Username: ${record.username}
Followers: ${record.followers}
ER: ${record.er}%
Purchase Keyword Ratio: ${record.purchase_keyword_ratio}%
Tier: ${record.tier}
Grade: ${record.grade || 'N/A'}
Bio: ${profile.biography || ''}
Category: ${fullAnalysis.category || 'general'}
`.trim();

        console.log(`Processing ${record.username}...`);

        const embedding = await generateEmbedding(textToEmbed);

        // Update DB
        const { error: updateError } = await supabase
            .from('analysis_history')
            .update({ embedding })
            .eq('id', record.id);

        if (updateError) {
            console.error(`❌ Failed to update ${record.username}:`, updateError);
        } else {
            console.log(`✅ Embedded: ${record.username}`);
        }

        // Rate limit kindness (Gemini has limits)
        await new Promise(r => setTimeout(r, 500)); 

    } catch (e) {
        console.error(`❌ Error processing ${record.username}:`, e);
    }
  }
}

processPendingEmbeddings();
