import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";
import { CONSULTANT_SYSTEM_PROMPT } from "./prompts";

const apiKey = process.env.ANMOK_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash", 
  maxOutputTokens: 8192,
  temperature: 0.3,
  apiKey: apiKey,
});

import { queryInfluencerDbTool } from "./tools/knowledge";

const tools = [queryInfluencerDbTool];

// Helper function to create and run the agent
export async function runHunterAgent(
  input: string,
  chatHistory: any[] = []
) {
  try {
    // Create Agent (LangGraph-based in 1.x)
    const agent = createAgent({
      model: model,
      tools,
      systemPrompt: CONSULTANT_SYSTEM_PROMPT,
    });

    // Convert chat history to format expected by agent
    // Assuming the agent uses a standard message state
    const messages = [
      ...chatHistory.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      { role: "user", content: input }
    ];

    const result = await agent.invoke({
      messages,
    });
    console.log("[Core] Agent Result:", JSON.stringify(result, null, 2));

    // Verify result structure. Typically result.messages has the full history.
    // The last message is the AI response.
    const lastMessage = result.messages[result.messages.length - 1];
    let outputText = "";

    if (lastMessage && lastMessage.content) {
        if (typeof lastMessage.content === 'string') {
            outputText = lastMessage.content;
        } else {
             // Handle array content (multimodal) if necessary
            outputText = JSON.stringify(lastMessage.content);
        }
    }

    // Clean up markdown block if present (UI expects raw JSON + Text or just Text)
    outputText = outputText.replace(/```json/g, "").replace(/```/g, "").trim();

    return {
        output: outputText,
        steps: [] // Steps are not easily accessible in the same way as AgentExecutor
    };

  } catch (error) {
    console.error("Error running Hunter Agent:", error);
    throw error;
  }
}
