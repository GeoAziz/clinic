
import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/firebase/admin';
import * as admin from 'firebase-admin';

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
    
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const convoRef = adminDb.collection('conversations').doc(conversationId);
    
    await convoRef.update({
      messages: admin.firestore.FieldValue.arrayUnion(message)
    });
    
    return NextResponse.json({ success: true, message: 'Message sent successfully' });

  } catch (error) {
    console.error("Error sending message: ", error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
