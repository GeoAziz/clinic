
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }
    
    const appointmentsSnapshot = await adminDb.collection('appointments')
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
