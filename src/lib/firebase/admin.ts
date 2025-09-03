
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
      let serviceAccount;
      if (process.env.SERVICE_ACCOUNT_KEY_JSON) {
        // In Vercel/production, use the environment variable
        serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY_JSON);
      } else {
        // For local development, read the file
        const serviceAccountPath = join(process.cwd(), 'serviceAccountKey.json');
        serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      }
      
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
