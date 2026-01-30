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

    // 2. Load Chat History
    let chatHistory: any[] = [];
    let activeConversationId = conversationId;
    
    console.log(`[API] Msg: "${message.substring(0, 20)}...", ID: ${conversationId}, User: ${session.user.email}`);

    if (supabaseAdmin && activeConversationId) {
        const { data: messages } = await supabaseAdmin
            .from('messages')
            .select('role, content')
            .eq('conversation_id', activeConversationId)
            .order('created_at', { ascending: true })
            .limit(20);
            
        if (messages) {
            chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
            console.log(`[API] Loaded ${chatHistory.length} msgs.`);
        }
    }

    // [REMOVED] Hardcoded cache bypass - Allowing Agent to use query_influencer_knowledge_base tool for conversational RAG

    // 3. Run Agent
    const agentResult = await runHunterAgent(message, chatHistory);

    // 4. Save to DB
    if (supabaseAdmin && session.user.email) {
        try {
            // A. Resolve User
            const { data: user } = await supabaseAdmin
                .from('allowed_users')
                .select('id')
                .eq('email', session.user.email)
                .single();

            if (user) {
                // B. Create Conversation if Needed
                if (!activeConversationId) {
                    const title = message.length > 30 ? message.substring(0, 30) + "..." : message;
                    const { data: newConv } = await supabaseAdmin
                        .from('conversations')
                        .insert({ user_id: user.id, title })
                        .select()
                        .single();
                    if (newConv) activeConversationId = newConv.id;
                }
                
                // C. Insert Messages
                if (activeConversationId) {
                    await supabaseAdmin.from('messages').insert([
                        { conversation_id: activeConversationId, role: 'user', content: message },
                        { conversation_id: activeConversationId, role: 'assistant', content: agentResult.output }
                    ]);

                    // D. Save Analysis History
                    // D. Save Analysis History - REMOVED
                    // Analysis saving is now handled exclusively by the 'analyze_account' tool
                    // to ensure raw data (bio, etc.) is preserved correctly.
                    // The Agent's output is a summary/JSON presentation and may lack fields.
                }
            } else {
                 console.warn(`[API] User ${session.user.email} not allowed. History skipped.`);
            }
        } catch (dbError) {
            console.error("[API] DB Save Error:", dbError);
        }
    }

    return NextResponse.json({
      response: agentResult.output,
      steps: agentResult.steps,
      conversationId: activeConversationId
    });

  } catch (error: any) {
    console.error("[API] Chat Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
