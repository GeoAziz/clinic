
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { patientId: string } }) {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }
    
    const patientId = params.patientId;
    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required.' }, { status: 400 });
    }
    
    const patientDoc = await adminDb.collection('users').doc(patientId).get();
    if (!patientDoc.exists) {
      return NextResponse.json({ error: 'Patient not found.' }, { status: 404 });
    }
    
    const patientData = patientDoc.data()!;
    
    // Fetch upcoming appointments
    const appointmentsSnapshot = await adminDb.collection('appointments')
        .where('patientId', '==', patientId)
        .where('date', '>=', new Date().toISOString().split('T')[0])
        .orderBy('date', 'asc')
        .get();

    const upcomingAppointments = appointmentsSnapshot.docs.map(doc => doc.data());

    // Fetch recent lab results
    const labResultsSnapshot = await adminDb.collection('labResults')
        .where('patientId', '==', patientId)
        .orderBy('date', 'desc')
        .get();
        
    const labResults = labResultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const response = {
      ...patientData,
      id: patientId,
      name: patientData.displayName,
      age: patientData.dob ? new Date().getFullYear() - new Date(patientData.dob).getFullYear() : 'N/A', 
      avatar: `https://i.pravatar.cc/150?u=${patientId}`,
      details: {
        bloodType: 'O+', // Placeholder
        allergies: 'None', // Placeholder
        conditions: 'N/A' // Placeholder
      },
      upcomingAppointments,
      labResults
    };
    
    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching patient chart data: ", error);
    return NextResponse.json({ error: 'Failed to fetch patient chart data' }, { status: 500 });
  }
}
