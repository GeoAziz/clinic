
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
    
    const patientId = await getUserIdFromToken();
     if (!patientId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointmentsSnapshot = await adminDb.collection('appointments')
        .where('patientId', '==', patientId)
        .orderBy('date', 'desc')
        .get();

    if (appointmentsSnapshot.empty) {
        return NextResponse.json([]);
    }

    const appointments = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    return NextResponse.json(appointments);

  } catch (error) {
    console.error("Error fetching appointments: ", error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';