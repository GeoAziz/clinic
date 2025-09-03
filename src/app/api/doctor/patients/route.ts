
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

async function getUserIdFromToken(): Promise<string | null> {
  const { adminAuth } = await getAdmin();
  if (!adminAuth) return null;
  const authHeader = headers().get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.split('Bearer ')[1];
  if (!token) return null;
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export async function GET() {
  try {
    const { adminDb, adminAuth } = await getAdmin();
    if (!adminDb || !adminAuth) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }
    
    const doctorId = await getUserIdFromToken();
     if (!doctorId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query the 'users' collection for documents where role is 'patient'
    // AND they are assigned to the logged-in doctor.
    const patientsSnapshot = await adminDb.collection('users')
        .where('role', '==', 'patient')
        .where('assignedDoctor', '==', doctorId)
        .get();
    
    if (patientsSnapshot.empty) {
        return NextResponse.json([]);
    }

    const patients = patientsSnapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.displayName || data.fullName || 'N/A',
        age: data.dob ? new Date().getFullYear() - new Date(data.dob).getFullYear() : 'N/A', 
        lastVisit: data.lastLogin ? new Date(data.lastLogin._seconds * 1000).toLocaleDateString() : 'N/A',
        avatar: `https://i.pravatar.cc/150?u=${doc.id}`,
      };
    });

    return NextResponse.json(patients);

  } catch (error) {
    console.error("Error fetching patients: ", error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
