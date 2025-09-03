
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

async function getUserIdFromToken(): Promise<string | null> {
  const { adminAuth } = await getAdmin();
  if (!adminAuth) return null;
  const hdrs = await headers();
  const authHeader = hdrs.get('Authorization');
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
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }
    
    const patientId = await getUserIdFromToken();
     if (!patientId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const labResultsSnapshot = await adminDb.collection('labResults')
        .where('patientId', '==', patientId)
        .orderBy('date', 'desc')
        .get();

    if (labResultsSnapshot.empty) {
        return NextResponse.json([]);
    }

    const labResults = labResultsSnapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data()
    }));
    
    return NextResponse.json(labResults);

  } catch (error) {
    console.error("Error fetching medical history: ", error);
    return NextResponse.json({ error: 'Failed to fetch medical history' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';