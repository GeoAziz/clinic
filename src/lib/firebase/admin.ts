
import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

try {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountString) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK will not be initialized on the server. This is expected in a browser environment.');
  } else if (!admin.apps.length) {
    const serviceAccount = JSON.parse(serviceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  } else {
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  }
} catch (error: any) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
}

export { adminDb, adminAuth };
