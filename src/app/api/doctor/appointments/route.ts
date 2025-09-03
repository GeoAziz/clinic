
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

// In a real app, you would get this from the authenticated user's session.
const MOCK_LOGGED_IN_DOCTOR_UID = "some-doctor-uid"; 

// Mock data, assuming you have an 'appointments' collection in Firestore
const mockAppointments = [
    { id: 'apt_1', patientName: 'John Doe', patientId: 'p_1', doctorId: 'some-doctor-uid', service: 'Consultation', date: '2024-10-28', time: '10:00 AM', status: 'Confirmed' },
    { id: 'apt_2', patientName: 'Jane Smith', patientId: 'p_2', doctorId: 'some-doctor-uid', service: 'Follow-up', date: '2024-10-28', time: '11:30 AM', status: 'Confirmed' },
    { id: 'apt_3', patientName: 'Sam Wilson', patientId: 'p_3', doctorId: 'another-doctor-uid', service: 'Consultation', date: '2024-10-29', time: '02:00 PM', status: 'Completed' },
];


export async function GET() {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }
    
    // This is where you would get the real doctor's UID from the session
    const doctorId = MOCK_LOGGED_IN_DOCTOR_UID;

    // In a real implementation, you would query Firestore.
    // For now, we filter our mock data.
    const appointments = mockAppointments.filter(apt => apt.doctorId === doctorId);

    /* 
    // Example of a real Firestore query:
    const appointmentsSnapshot = await adminDb.collection('appointments')
        .where('doctorId', '==', doctorId)
        .orderBy('date', 'desc')
        .get();

    const appointments = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    */
    
    return NextResponse.json(appointments);

  } catch (error) {
    console.error("Error fetching appointments: ", error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
