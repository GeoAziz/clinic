
import { readFileSync } from 'fs';
import { join } from 'path';

let cached = {
  adminDb: null as any,
  adminAuth: null as any,
  initialized: false,
};

export async function getAdmin() {
  if (cached.initialized) {
    return { adminDb: cached.adminDb, adminAuth: cached.adminAuth };
  }
  const admin = await import('firebase-admin');
  if (!admin.apps.length) {
    try {
      const serviceAccountPath = join(process.cwd(), 'serviceAccountKey.json');
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      cached.adminDb = admin.firestore();
      cached.adminAuth = admin.auth();
      cached.initialized = true;
      console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
      throw error;
    }
  } else {
    cached.adminDb = admin.firestore();
    cached.adminAuth = admin.auth();
    cached.initialized = true;
  }
  return { adminDb: cached.adminDb, adminAuth: cached.adminAuth };
}
