import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBxMEEDu5p4nq2mEJiaiYu1mTXaRFUN6mM"; // From .env.local
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    console.log("--- Gemini API Capability Check ---");
    
    // In @google/generative-ai, we can't easily list models without a helper or direct fetch
    // BUT we can try to initialize the model and see if it fails.
    const modelName = "imagen-3.0-generate-001";
    const model = genAI.getGenerativeModel({ model: modelName });
    
    console.log(`Model '${modelName}' initialized.`);
    console.log("Attempting a dummy generation check (this might fail if the model is restricted to Pro users or requires Vertex AI)...");
    
    // Image generation usually happens via a specific call, but let's see if we can get model info
    // For now, let's try to just use a fetch to the actual listModels endpoint to be 100% sure.
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await res.json();
    
    if (data.models) {
      const imagenModels = data.models.filter(m => m.name.includes("imagen"));
      if (imagenModels.length > 0) {
        console.log("✅ Imagen models found in your API Key:");
        imagenModels.forEach(m => console.log(` - ${m.name} (${m.displayName})`));
      } else {
        console.log("❌ No Imagen models found in this API key.");
        console.log("Your key supports: " + data.models.map(m => m.displayName).slice(0, 5).join(", ") + "...");
      }
    } else {
      console.log("Could not list models. Response:", JSON.stringify(data));
    }

  } catch (error) {
    console.error("Error check:", error.message);
  }
}

run();
