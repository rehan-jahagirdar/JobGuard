import { analyzeWithGroq } from '../services/groqService.js';
import { scrapeJobPosting } from '../services/scraperService.js';
import { db, admin } from '../config/firebase.js';
import { nanoid } from 'nanoid';

export async function analyzePosting(req, res, next) {
  try {
    const { type, content, userId = 'anonymous' } = req.body;
    let textToAnalyze = content;
    let sourceUrl = null;

    // Handle URL scraping if needed
    if (type === 'url') {
      const scraped = await scrapeJobPosting(content);
      textToAnalyze = scraped.text;
      sourceUrl = scraped.sourceUrl;
    }

    // Analyze with Llama 3.3 via Groq
    const aiResult = await analyzeWithGroq(textToAnalyze);
    const shareId = nanoid(8);

    const docData = {
      userId,
      jobTitle: aiResult.jobTitle,
      companyName: aiResult.companyName,
      trustScore: aiResult.trustScore,
      verdict: aiResult.verdict,
      summary: aiResult.summary,
      flags: aiResult.flags,
      positiveSignals: aiResult.positiveSignals,
      advice: aiResult.adviceForApplicant,
      sourceUrl,
      shareId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('checks').add(docData);

    res.json({
      id: docRef.id,
      shareId,
      ...aiResult
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
      .limit(50)
      .get();

    const history = [];
    snapshot.forEach(doc => {
      history.push({ id: doc.id, ...doc.data() });
    });

    res.json({ history });
  } catch (err) {
    next(err);
  }
}

export async function deleteAnalysis(req, res, next) {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const docRef = db.collection('checks').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    if (doc.data().userId !== userId) return res.status(403).json({ error: 'Unauthorized' });

    await docRef.delete();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}