
import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/firebase/admin';

// This is a mock implementation. In a real app, you'd have proper authentication
// and data validation. For now, we will simulate updating the data in-memory
// and eventually this would be a real Firestore update.

// This mock store will be reset on every server restart.
let mockConversations: { [key: string]: any } = {
  p_1: {
    messages: [
      { from: 'patient', text: 'Thanks for the quick response, doctor!' },
      { from: 'doctor', text: "You're welcome. Please follow the prescription and let me know if you have any questions." },
    ],
  },
  p_2: {
    messages: [
      { from: 'patient', text: 'Hi Dr. Reed, I wanted to follow up on my lab results.' },
    ],
  },
};

export async function POST(request: Request) {
  try {
    // In a real app, you'd get the doctor's UID from the authenticated session
    // const { adminAuth } = await getAdmin();
    // const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    // if (!token) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const decodedToken = await adminAuth.verifyIdToken(token);
    // const doctorId = decodedToken.uid;
    
    const { conversationId, message } = await request.json();

    if (!conversationId || !message) {
      return NextResponse.json({ error: 'Missing conversationId or message' }, { status: 400 });
    }
    
    // --- Start of Mock/In-memory logic ---
    // In a real app, this would be a Firestore transaction
    if (mockConversations[conversationId]) {
      mockConversations[conversationId].messages.push(message);
    } else {
      // For simplicity, we don't handle creating new conversations here
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    // --- End of Mock/In-memory logic ---

    /* 
    // --- Example of Real Firestore Logic ---
    const { adminDb, admin } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }
    const convoRef = adminDb.collection('conversations').doc(conversationId);
    await convoRef.update({
      messages: admin.firestore.FieldValue.arrayUnion(message)
    });
    */

    return NextResponse.json({ success: true, message: 'Message sent successfully' });

  } catch (error) {
    console.error("Error sending message: ", error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
