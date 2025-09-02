
import { readFileSync } from 'fs';
import { join } from 'path';
// Use require for firebase-admin for Node.js compatibility
let admin: typeof import('firebase-admin');

let cached = {
  adminDb: null as any,
  adminAuth: null as any,
  initialized: false,
};

export function getAdmin() {
  if (!admin) {
    admin = require('firebase-admin');
  }
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
    }
  } else {
    cached.adminDb = admin.firestore();
    cached.adminAuth = admin.auth();
    cached.initialized = true;
  }
  return { adminDb: cached.adminDb, adminAuth: cached.adminAuth };
}
