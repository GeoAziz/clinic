
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
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }
    
    const doctorId = await getUserIdFromToken();
    if (!doctorId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Since labs are not directly assigned to doctors, we fetch all labs
    // In a real-world scenario, you might have a linking collection or field.
    const labResultsSnapshot = await adminDb.collection('labResults')
        .orderBy('date', 'desc')
        .get();

    if (labResultsSnapshot.empty) {
        return NextResponse.json([]);
    }

    const results = labResultsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    return NextResponse.json(results);

  } catch (error) {
    console.error("Error fetching lab results: ", error);
    return NextResponse.json({ error: 'Failed to fetch lab results' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
