
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }
    
    const doctorsSnapshot = await adminDb.collection('doctors').get();

    if (doctorsSnapshot.empty) {
        return NextResponse.json([]);
    }

    const doctors = doctorsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.displayName || 'N/A',
            specialty: data.specialty || 'N/A',
            // Use a placeholder for avatar and serviceIds as they aren't in the DB yet
            avatar: `https://i.pravatar.cc/150?u=${doc.id}`,
            // This will need to be added to your firestore documents
            serviceIds: data.serviceIds || [1, 2, 3], 
        }
    });
    
    return NextResponse.json(doctors);

  } catch (error) {
    console.error("Error fetching doctors: ", error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
