
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }

    const { appointmentId } = await request.json();

    if (!appointmentId) {
        return NextResponse.json({ error: 'Appointment ID is required.' }, { status: 400 });
    }

    const appointmentRef = adminDb.collection('appointments').doc(appointmentId);
    
    await appointmentRef.update({
        status: 'Checked-in'
    });

    return NextResponse.json({ success: true, message: 'Patient checked in successfully.' });

  } catch (error) {
    console.error("Error checking in patient: ", error);
    return NextResponse.json({ error: 'Failed to check in patient' }, { status: 500 });
  }
}
