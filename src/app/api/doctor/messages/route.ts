
import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/firebase/admin';
import { auth as clientAuth } from '@/lib/firebase/client'; // This is not ideal for backend

// Mock data until we can get the real logged-in user
const MOCK_DOCTOR_ID = "some-doctor-uid";

const initialConversations = {
  p_1: {
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    messages: [
      { from: 'patient', text: 'Thanks for the quick response, doctor!' },
      { from: 'doctor', text: 'You\'re welcome. Please follow the prescription and let me know if you have any questions.' },
    ],
  },
  p_2: {
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    messages: [
      { from: 'patient', text: 'Hi Dr. Reed, I wanted to follow up on my lab results.' },
    ],
  },
};


export async function GET(request: Request) {
  try {
    // In a real app, you'd get the doctor's UID from the authenticated session
    // const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    // if (!token) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const { adminAuth } = await getAdmin();
    // const decodedToken = await adminAuth.verifyIdToken(token);
    // const doctorId = decodedToken.uid;
    
    // For now, we'll return mock data.
    // The next step would be to query Firestore for conversations where doctorId === MOCK_DOCTOR_ID
    return NextResponse.json(initialConversations);

  } catch (error) {
    console.error("Error fetching conversations: ", error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
