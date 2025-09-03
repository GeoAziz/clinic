import * as admin from 'firebase-admin';

// Your service account key file
import serviceAccount from '../serviceAccountKey.json';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
}


const db = admin.firestore();
const auth = admin.auth();

const adminEmail = 'admin@clinic.io';
const adminPassword = 'password123';

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Check if user already exists
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(adminEmail);
      console.log('User already exists:', userRecord.uid);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // Create new user if not found
        userRecord = await auth.createUser({
          email: adminEmail,
          password: adminPassword,
          emailVerified: true,
          displayName: 'Clinic Admin',
        });
        console.log('Successfully created new user:', userRecord.uid);
      } else {
        throw error;
      }
    }

    const { uid } = userRecord;

    // Set custom user claims for admin role
    await auth.setCustomUserClaims(uid, { role: 'admin' });
    console.log(`Custom claim { role: 'admin' } set for user ${uid}`);

    // Create user document in Firestore
    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.set({
      uid: uid,
      email: adminEmail,
      displayName: 'Clinic Admin',
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`User document created in Firestore for ${uid}`);
    
    console.log('✅ Admin user setup complete!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser().then(() => {
    process.exit(0);
});
