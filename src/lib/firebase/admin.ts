import * as admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }
    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    adminDb = admin.firestore();
    adminAuth = admin.auth();
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
  }
} else {
  adminDb = admin.firestore();
  adminAuth = admin.auth();
}

export { adminDb, adminAuth };
