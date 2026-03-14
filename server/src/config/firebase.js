import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!admin.apps.length) {
  let credential;

  // Check if serviceAccountKey.json exists (local dev)
  const keyPath = join(__dirname, '../../serviceAccountKey.json');

  if (existsSync(keyPath)) {
    // Local development — use JSON file
    const require = createRequire(import.meta.url);
    const serviceAccount = require('../../serviceAccountKey.json');
    credential = admin.credential.cert(serviceAccount);
    console.log('Firebase: using serviceAccountKey.json');
  } else {
    // Production (Railway) — use environment variables
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    credential = admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  privateKey,
    });
    console.log('Firebase: using environment variables');
    console.log('Project ID:', process.env.FIREBASE_PROJECT_ID || '❌ NOT SET');
    console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL || '❌ NOT SET');
    console.log('Private Key:', process.env.FIREBASE_PRIVATE_KEY ? '✅ SET' : '❌ NOT SET');
  }

  admin.initializeApp({ credential });
}

export const db = admin.firestore();
export { admin };



