// server/src/services/geminiService.js

import { GoogleGenerativeAI } from '@google/generative-ai';

const SCAM_DETECTION_PROMPT = `You are JobGuard, an expert AI system trained to detect fake and fraudulent job postings in India. You analyze job postings with deep knowledge of:
- Common scam patterns used on LinkedIn, Naukri, Internshala, and WhatsApp
- Legitimate Indian company hiring practices
- Regulatory requirements (real companies never ask for Aadhaar/PAN/bank details in job postings)
- Salary benchmarks for roles in India

Analyze the provided job posting and return a JSON object with this EXACT structure:

{
  "jobTitle": "extracted job title or Unknown",
  "companyName": "extracted company name or Unknown",
  "trustScore": <integer between 0 and 100>,
  "verdict": "<must be exactly one of: SAFE, SUSPICIOUS, LIKELY_FAKE>",
  "summary": "<one sentence plain English summary of your assessment>",
  "flags": [
    {
      "category": "<one of: PAYMENT, PERSONAL_DATA, VAGUE_DETAILS, UNREALISTIC_OFFER, CONTACT, URGENCY, COMPANY, LANGUAGE>",
      "severity": "<one of: low, medium, high>",
      "title": "<short flag title under 8 words>",
      "explanation": "<1-2 sentences a student would understand>"
    }
  ],
  "positiveSignals": [
    "<string describing something legitimate about the posting>"
  ],
  "adviceForApplicant": "<2-3 sentences of practical advice for this specific posting>"
}

Scoring guide:
- 80 to 100 → SAFE: All major legitimacy signals present, no red flags
- 50 to 79 → SUSPICIOUS: Some concerning patterns, student should verify before applying
- 0 to 49 → LIKELY_FAKE: Multiple scam indicators, high risk, do not apply

Flag category meanings:
- PAYMENT: Asks for registration fee, deposit, training cost, security deposit, or any money
- PERSONAL_DATA: Requests Aadhaar, PAN card, bank account, or passport in the posting itself
- VAGUE_DETAILS: No specific role, generic work-from-home earn-money language
- UNREALISTIC_OFFER: Salary wildly high for role and experience level
- CONTACT: Only WhatsApp or personal Gmail, no official email, no company address
- URGENCY: Apply within 24 hours, limited seats, artificial pressure language
- COMPANY: Unknown company, no verifiable online presence mentioned in posting
- LANGUAGE: Poor grammar, excessive capital letters, emoji overuse, unprofessional tone

IMPORTANT: Return ONLY the JSON object. No markdown, no backticks, no explanation outside the JSON.`;

export async function analyzeWithGemini(jobText) {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log('=== GEMINI DEBUG ===');
  console.log('API Key:', apiKey ? apiKey.slice(0, 8) + '...' : '❌ NOT FOUND');
  console.log('===================');

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
      maxOutputTokens: 2000,
    }
  });

  const prompt = `${SCAM_DETECTION_PROMPT}

JOB POSTING TO ANALYZE:

${jobText}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log('Gemini response length:', responseText.length);
    console.log('Gemini response preview:', responseText.slice(0, 100));

    // Clean response — remove markdown fences if present
    let cleaned = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Extract just the JSON object
    const firstBrace = cleaned.indexOf('{');
    const lastBrace  = cleaned.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No JSON found in Gemini response');
    }

    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(cleaned);

    // Validate required fields
    if (
      typeof parsed.trustScore !== 'number' ||
      !['SAFE', 'SUSPICIOUS', 'LIKELY_FAKE'].includes(parsed.verdict) ||
      !Array.isArray(parsed.flags)
    ) {
      throw new Error('Gemini returned unexpected response structure');
    }

    // Clamp score
    parsed.trustScore = Math.max(0, Math.min(100, parsed.trustScore));

    // Ensure all fields exist
    parsed.positiveSignals    = parsed.positiveSignals    || [];
    parsed.adviceForApplicant = parsed.adviceForApplicant || '';
    parsed.summary            = parsed.summary            || '';
    parsed.jobTitle           = parsed.jobTitle           || 'Unknown';
    parsed.companyName        = parsed.companyName        || 'Unknown';

    return parsed;

  } catch (err) {
    console.error('FULL GEMINI ERROR:', err.message);
    throw new Error(interpretGeminiError(err));
  }
}

export function interpretGeminiError(err) {
  const msg = err.message || '';

  if (msg.includes('API_KEY_INVALID')) {
    return 'Gemini API key is invalid. Check Railway variables.';
  }
  if (msg.includes('QUOTA_EXCEEDED') || msg.includes('429')) {
    return 'Gemini free tier limit reached. Try again in a minute.';
  }
  if (msg.includes('not found') || msg.includes('404')) {
    return 'Gemini model not found. Check the model name.';
  }
  if (msg.includes('SAFETY')) {
    return 'Content blocked by safety filters. Try pasting a shorter excerpt.';
  }
  if (msg.includes('RECITATION')) {
    return 'Analysis blocked due to content policy. Try pasting text manually.';
  }
  if (msg.includes('not set')) {
    return 'Gemini API key is missing on the server.';
  }
  if (msg.includes('JSON') || msg.includes('Unterminated')) {
    return 'AI returned invalid response. Please try again.';
  }
  return `AI analysis failed: ${msg}`;
}