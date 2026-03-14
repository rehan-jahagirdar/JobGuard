import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SCAM_DETECTION_PROMPT = `You are JobGuard, an expert AI system trained to detect fake and fraudulent job postings in India. You analyze job postings with deep knowledge of:
- Common scam patterns used on LinkedIn, Naukri, Internshala, and WhatsApp
- Legitimate Indian company hiring practices
- Regulatory requirements (real companies don't ask for Aadhaar/PAN upfront in job postings)
- Salary benchmarks for roles in India

Analyze the provided job posting and return ONLY a valid JSON object with this exact structure:

{
  "jobTitle": "extracted job title or 'Unknown'",
  "companyName": "extracted company name or 'Unknown'",
  "trustScore": <integer 0-100>,
  "verdict": "<SAFE|SUSPICIOUS|LIKELY_FAKE>",
  "summary": "<one sentence plain English summary of why this posting is or isn't trustworthy>",
  "flags": [
    {
      "category": "<PAYMENT|PERSONAL_DATA|VAGUE_DETAILS|UNREALISTIC_OFFER|CONTACT|URGENCY|COMPANY|LANGUAGE>",
      "severity": "<low|medium|high>",
      "title": "<short flag title>",
      "explanation": "<1-2 sentence explanation in plain language that a student would understand>"
    }
  ],
  "positiveSignals": [
    "<string describing something legitimate about the posting>"
  ],
  "adviceForApplicant": "<2-3 sentence practical advice for this specific case>"
}

Scoring guide:
- 80-100: SAFE — All major legitimacy signals present, no red flags
- 50-79: SUSPICIOUS — Some concerning patterns, verify before applying
- 0-49: LIKELY_FAKE — Multiple scam indicators, high risk

Flag categories explained:
- PAYMENT: Asks for any fee, deposit, training cost, registration, or security deposit
- PERSONAL_DATA: Asks for Aadhaar, PAN, bank details, or passport in the posting itself
- VAGUE_DETAILS: No specific role description, generic "work from home earn big" language
- UNREALISTIC_OFFER: Salary wildly high for role/experience, too-good-to-be-true perks
- CONTACT: Only WhatsApp/personal Gmail/no official email, no office address
- URGENCY: "Apply in 24 hours", "Limited seats", artificial pressure tactics
- COMPANY: Unknown company, no verifiable online presence mentioned
- LANGUAGE: Poor grammar, excessive caps, emoji overuse, informal language for a job posting

Return ONLY the JSON. No markdown, no explanation outside the JSON.`;

export async function analyzeWithClaude(jobText) {
  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `${SCAM_DETECTION_PROMPT}\n\nJOB POSTING TO ANALYZE:\n\n${jobText}`
      }
    ]
  });

  const responseText = message.content[0].text;

  try {
    // Clean up in case Claude adds markdown fences
    const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleaned);

    // Validate required fields
    if (typeof result.trustScore !== 'number' || !result.verdict || !Array.isArray(result.flags)) {
      throw new Error('Invalid response structure');
    }

    return result;
  } catch (err) {
    console.error('Claude response parse error:', responseText);
    throw new Error('AI analysis failed to return valid data. Please try again.');
  }
}