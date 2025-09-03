
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }

    // Query the 'users' collection for documents where role is 'patient'
    const patientsSnapshot = await adminDb.collection('users').where('role', '==', 'patient').get();
    
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
