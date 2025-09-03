
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

// In a real app, you would get this from the authenticated user's session.
const MOCK_LOGGED_IN_DOCTOR_UID = "some-doctor-uid"; 

export async function GET() {
  try {
    const { adminDb, adminAuth } = await getAdmin();
    if (!adminDb || !adminAuth) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }
    
    // In a real implementation, you would verify the user's token
    // and get their UID from there. For now, we use a mock UID.
    const doctorId = MOCK_LOGGED_IN_DOCTOR_UID;

    // Query the 'users' collection for documents where role is 'patient'
    // AND they are assigned to the logged-in doctor.
    const patientsSnapshot = await adminDb.collection('users')
        .where('role', '==', 'patient')
        .where('assignedDoctor', '==', doctorId)
        .get();
    
    if (patientsSnapshot.empty) {
        // If no patients are found for this doctor, we can try to find the doctor's own user record
        // to see if they exist. This helps differentiate between a doctor with no patients
        // and an invalid doctor ID.
        try {
            const doctorUser = await adminAuth.getUser(doctorId);
            // The doctor exists but has no patients assigned.
            console.log(`No patients found for doctor ${doctorUser.displayName} (UID: ${doctorId})`);
        } catch (error) {
            // The mock doctor UID doesn't exist in Firebase Auth.
             console.error(`Mock doctor with UID "${doctorId}" not found in Firebase Auth. Make sure this user exists.`);
        }
        return NextResponse.json([]);
    }

    const patients = patientsSnapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.displayName || data.fullName || 'N/A',
        // Placeholders, as these fields may not exist in the 'users' collection
        age: data.dob ? new Date().getFullYear() - new Date(data.dob).getFullYear() : 30, 
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
