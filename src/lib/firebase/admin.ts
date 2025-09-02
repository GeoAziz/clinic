
import { readFileSync } from 'fs';
import { join } from 'path';
import * as admin from 'firebase-admin';

let cached = {
  adminDb: null as admin.firestore.Firestore | null,
  adminAuth: null as admin.auth.Auth | null,
  initialized: false,
};

export async function getAdmin() {
  if (cached.initialized) {
    return { adminDb: cached.adminDb, adminAuth: cached.adminAuth };
  }
  
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
      // We don't throw here to avoid crashing the server on boot, 
      // but functions calling getAdmin should handle null returns.
    }
  } else {
    // If already initialized by another part of the app
    cached.adminDb = admin.firestore();
    cached.adminAuth = admin.auth();
    cached.initialized = true;
  }

  return { adminDb: cached.adminDb, adminAuth: cached.adminAuth };
}
