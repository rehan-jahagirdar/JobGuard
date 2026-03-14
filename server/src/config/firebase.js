import admin from 'firebase-admin';

if (!admin.apps.length) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    // ✅ Key already has real newlines — DO NOT replace anything
    credential = admin.credential.cert(serviceAccount);
    console.log('Firebase: using FIREBASE_SERVICE_ACCOUNT ✅');
  } else {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    credential = admin.credential.cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    });
  }

  admin.initializeApp({ credential });
}

export const db = admin.firestore();
export { admin };