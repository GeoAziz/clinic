

import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

try {
  let serviceAccount: any = null;
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountString) {
    serviceAccount = JSON.parse(serviceAccountString);
  } else {
    // Try to load from file
    const keyPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(keyPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    } else {
      console.warn('serviceAccountKey.json not found and FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK will not be initialized.');
    }
  }

  if (
    serviceAccount &&
    typeof serviceAccount === 'object' &&
    serviceAccount.private_key &&
    serviceAccount.client_email &&
    !admin.apps.length
  ) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key,
        }),
      });
      adminDb = admin.firestore();
      adminAuth = admin.auth();
    } catch (err) {
      console.error('Error initializing Firebase Admin SDK with service account:', err);
    }
  } else if (admin.apps.length) {
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  }
} catch (error: any) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
}

export { adminDb, adminAuth };
