// server/src/services/groqService.js

import Groq from 'groq-sdk';

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

export async function analyzeWithGroq(jobText) {
  const apiKey = process.env.GROQ_API_KEY;

  console.log('=== GROQ DEBUG ===');
  console.log('API Key:', apiKey ? apiKey.slice(0, 8) + '...' : '❌ NOT FOUND');
  console.log('===================');

  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set.');
  }

  const groq = new Groq({ apiKey });

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SCAM_DETECTION_PROMPT
        },
        {
          role: 'user',
          content: `JOB POSTING TO ANALYZE:\n\n${jobText}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.2, // Keep it low for analytical consistency
      max_tokens: 2000,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '{}';

    console.log('Groq response length:', responseText.length);
    console.log('Groq response preview:', responseText.slice(0, 100));

    // Parse the JSON object directly (Groq's json_object mode usually guarantees clean JSON)
    const parsed = JSON.parse(responseText);

    // Validate required fields
    if (
      typeof parsed.trustScore !== 'number' ||
      !['SAFE', 'SUSPICIOUS', 'LIKELY_FAKE'].includes(parsed.verdict) ||
      !Array.isArray(parsed.flags)
    ) {
      throw new Error('Groq returned unexpected response structure');
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
    console.error('FULL GROQ ERROR:', err.message);
    throw new Error(interpretGroqError(err));
  }
}

export function interpretGroqError(err) {
  const msg = err.message || '';

  if (msg.includes('API key is invalid') || msg.includes('401')) {
    return 'Groq API key is invalid. Check your environment variables.';
  }
  if (msg.includes('Rate limit reached') || msg.includes('429')) {
    return 'Groq API limit reached. Try again in a minute.';
  }
  if (msg.includes('not found') || msg.includes('404')) {
    return 'Groq model not found. Check the model name string.';
  }
  if (msg.includes('not set')) {
    return 'Groq API key is missing on the server.';
  }
  if (msg.includes('JSON') || msg.name === 'SyntaxError') {
    return 'AI returned invalid JSON response. Please try again.';
  }
  return `AI analysis failed: ${msg}`;
}