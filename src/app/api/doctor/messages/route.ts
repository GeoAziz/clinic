
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import * as admin from 'firebase-admin';

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

    const convosSnapshot = await adminDb.collection('conversations')
        .where('doctorId', '==', doctorId)
        .get();

    if (convosSnapshot.empty) {
        console.log(`No conversations found for doctor UID: ${doctorId}`);
        return NextResponse.json({});
    }

    const conversations: { [key: string]: any } = {};
    convosSnapshot.forEach(doc => {
        conversations[doc.id] = doc.data();
    });
    
    return NextResponse.json(conversations);

  } catch (error) {
    console.error("Error fetching conversations: ", error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
