
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.ANMOK_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
export const geminiVisionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

export default genAI;
