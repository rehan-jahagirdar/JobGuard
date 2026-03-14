// server/src/services/geminiService.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const SCAM_DETECTION_PROMPT = `
You are JobGuard AI. Detect scam job postings in India.

Return JSON only:

{
 "jobTitle": "",
 "companyName": "",
 "trustScore": 0,
 "verdict": "SAFE | SUSPICIOUS | LIKELY_FAKE",
 "summary": "",
 "flags": [
   {
     "category": "PAYMENT | PERSONAL_DATA | VAGUE_DETAILS | UNREALISTIC_OFFER | CONTACT | URGENCY | COMPANY | LANGUAGE",
     "severity": "low | medium | high",
     "title": "",
     "explanation": ""
   }
 ],
 "positiveSignals": [],
 "adviceForApplicant": ""
}

Rules:
- Real companies never ask for money or Aadhaar/PAN in job postings
- WhatsApp-only contact or unrealistic salary is suspicious
- Legitimate jobs include clear role, company identity and professional tone

Return ONLY JSON.
`;

/**
 * Compress job posting to reduce token usage
 */
function compressJobText(text = "") {
  return text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1500);
}

/**
 * Retry helper for rate limits
 */
async function retry(fn, retries = 1) {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0 && (err.message.includes("429") || err.message.includes("limit"))) {
      await new Promise(r => setTimeout(r, 2000));
      return retry(fn, retries - 1);
    }
    throw err;
  }
}

export async function analyzeWithGemini(jobText) {

  const apiKey = process.env.GEMINI_API_KEY;

  console.log("=== GEMINI DEBUG ===");
  console.log("API Key:", apiKey ? apiKey.slice(0, 8) + "..." : "❌ NOT FOUND");
  console.log("====================");

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
      maxOutputTokens: 600
    }
  });

  const compressedText = compressJobText(jobText);

  const prompt = `
${SCAM_DETECTION_PROMPT}

JOB POSTING:

${compressedText}
`;

  try {

    const result = await retry(() => model.generateContent(prompt));

    const responseText = result.response.text();

    console.log("Gemini response length:", responseText.length);

    let cleaned = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON found in Gemini response");
    }

    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned);

    // Validate response structure
    if (
      typeof parsed.trustScore !== "number" ||
      !["SAFE", "SUSPICIOUS", "LIKELY_FAKE"].includes(parsed.verdict) ||
      !Array.isArray(parsed.flags)
    ) {
      throw new Error("Gemini returned unexpected response structure");
    }

    // Clamp trust score
    parsed.trustScore = Math.max(0, Math.min(100, parsed.trustScore));

    // Ensure fields exist
    parsed.jobTitle = parsed.jobTitle || "Unknown";
    parsed.companyName = parsed.companyName || "Unknown";
    parsed.summary = parsed.summary || "";
    parsed.positiveSignals = parsed.positiveSignals || [];
    parsed.adviceForApplicant = parsed.adviceForApplicant || "";

    return parsed;

  } catch (err) {
    console.error("FULL GEMINI ERROR:", err.message);
    throw new Error(interpretGeminiError(err));
  }
}

export function interpretGeminiError(err) {

  const msg = err.message || "";

  if (msg.includes("API_KEY_INVALID")) {
    return "Gemini API key is invalid. Check Railway variables.";
  }

  if (msg.includes("QUOTA_EXCEEDED") || msg.includes("429")) {
    return "Gemini free tier limit reached. Try again in a minute.";
  }

  if (msg.includes("not found") || msg.includes("404")) {
    return "Gemini model not found. Check the model name.";
  }

  if (msg.includes("SAFETY")) {
    return "Content blocked by safety filters. Try a shorter job description.";
  }

  if (msg.includes("RECITATION")) {
    return "Analysis blocked due to policy restrictions.";
  }

  if (msg.includes("not set")) {
    return "Gemini API key is missing on the server.";
  }

  if (msg.includes("JSON") || msg.includes("Unexpected")) {
    return "AI returned invalid response. Please try again.";
  }

  return `AI analysis failed: ${msg}`;
}