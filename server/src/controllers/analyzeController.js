// server/src/controllers/analyzeController.js

import { scrapeJobPosting } from '../services/scraperService.js';
import { analyzeWithGroq } from '../services/groqService.js';
import { checkCompanyDomain } from '../services/domainService.js';
import { db, admin } from '../config/firebase.js';
import { nanoid } from 'nanoid';

export async function analyzePosting(req, res, next) {
  try {
    const { type, content, userId = 'anonymous' } = req.body;

    // Input validation
    if (!type || !content) {
      return res.status(400).json({ error: 'type and content are required' });
    }
    if (!['url', 'text'].includes(type)) {
      return res.status(400).json({ error: 'type must be "url" or "text"' });
    }
    if (content.trim().length < 20) {
      return res.status(400).json({ error: 'Content too short to analyze' });
    }

    // Step 1: Get the job text
    let jobText;
    let sourceUrl = null;

    if (type === 'url') {
      const scraped = await scrapeJobPosting(content);
      jobText = scraped.text;
      sourceUrl = content;
    } else {
      jobText = content.trim().slice(0, 6000);
    }

    // Step 2: AI Analysis (Updated to Groq)
    const aiResult = await analyzeWithGroq(jobText);

    // Step 3: Domain check (non-blocking — don't fail if this errors)
    let domainCheck = { checked: false };
    try {
      domainCheck = await checkCompanyDomain(aiResult.companyName);
      // If domain doesn't exist, that's a red flag — lower the score slightly
      if (domainCheck.checked && !domainCheck.exists && aiResult.trustScore > 40) {
        aiResult.trustScore = Math.max(aiResult.trustScore - 10, 0);
        aiResult.flags.push({
          category: 'COMPANY',
          severity: 'medium',
          title: 'Company website not found',
          explanation: `We couldn't verify a website for "${aiResult.companyName}". Legitimate companies almost always have an official web presence.`
        });
        // Re-evaluate verdict after score change
        if (aiResult.trustScore < 50 && aiResult.verdict === 'SAFE') {
          aiResult.verdict = 'SUSPICIOUS';
        }
      }
    } catch (e) {
      console.warn('Domain check failed silently:', e.message);
    }

    // Step 4: Save to Firestore
    const shareId = nanoid(8);
    const docData = {
      userId,
      inputType: type,
      sourceUrl,
      jobTitle: aiResult.jobTitle,
      companyName: aiResult.companyName,
      trustScore: aiResult.trustScore,
      verdict: aiResult.verdict,
      flags: aiResult.flags,
      positiveSignals: aiResult.positiveSignals || [],
      summary: aiResult.summary,
      adviceForApplicant: aiResult.adviceForApplicant,
      domainCheck,
      shareId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('checks').add(docData);

    // Step 5: Return result
    res.json({
      checkId: docRef.id,
      shareId,
      shareUrl: `${process.env.FRONTEND_URL}/result/${shareId}`,
      ...aiResult,
      domainCheck
    });

  } catch (err) {
    next(err);
  }
}

export async function getHistory(req, res, next) {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('checks')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(15)
      .get();

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      jobTitle: doc.data().jobTitle,
      companyName: doc.data().companyName,
      trustScore: doc.data().trustScore,
      verdict: doc.data().verdict,
      shareId: doc.data().shareId,
      createdAt: doc.data().createdAt
    }));

    res.json({ history });
  } catch (err) {
    next(err);
  }
}

export async function getByShareId(req, res, next) {
  try {
    const { shareId } = req.params;
    const snapshot = await db.collection('checks')
      .where('shareId', '==', shareId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Result not found or expired' });
    }

    const doc = snapshot.docs[0];
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    next(err);
  }
}