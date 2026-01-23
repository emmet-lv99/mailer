
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.ANMOK_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in environment variables!");
} else {
  console.log("✅ GEMINI_API_KEY loaded successfully.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
export const geminiVisionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default genAI;
