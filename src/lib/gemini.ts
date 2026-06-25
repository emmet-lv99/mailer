import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI_MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.5-flash";

const apiKey = process.env.ANMOK_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in environment variables!");
} else {
  console.log("✅ GEMINI_API_KEY loaded successfully.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiModel = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
export const geminiVisionModel = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });

export default genAI;
