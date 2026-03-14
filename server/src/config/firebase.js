import admin from 'firebase-admin';
import { createRequire } from 'module';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!admin.apps.length) {
  let credential;
  const keyPath = join(__dirname, '../../serviceAccountKey.json');

  if (existsSync(keyPath)) {
    const require = createRequire(import.meta.url);
    const serviceAccount = require('../../serviceAccountKey.json');
    credential = admin.credential.cert(serviceAccount);
    console.log('Firebase: using serviceAccountKey.json');
  } else {
    // Fix the private key — Railway escapes \n as \\n
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ?.replace(/\\n/g, '\n')
      ?.replace(/\\/g, '')
      ?.trim();

    console.log('Firebase: using env vars');
    console.log('Private key starts with:', privateKey?.slice(0, 40));

    credential = admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  privateKey,
    });
  }

  admin.initializeApp({ credential });
}

export const db = admin.firestore();
export { admin };