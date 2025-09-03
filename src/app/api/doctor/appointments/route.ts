
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

// In a real app, you would get this from the authenticated user's session.
const MOCK_LOGGED_IN_DOCTOR_UID = "some-doctor-uid"; 

export async function GET() {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }
    
    // This is where you would get the real doctor's UID from the session
    const doctorId = MOCK_LOGGED_IN_DOCTOR_UID;

    // In a real implementation, you would query Firestore.
    const appointmentsSnapshot = await adminDb.collection('appointments')
        .where('doctorId', '==', doctorId)
        .orderBy('date', 'desc')
        .get();

    if (appointmentsSnapshot.empty) {
        console.log(`No appointments found for doctor UID: ${doctorId}`);
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
