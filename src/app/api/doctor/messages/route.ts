
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import * as admin from 'firebase-admin';


async function getUserIdFromToken(): Promise<string | null> {
  const { adminAuth } = await getAdmin();
  if (!adminAuth) return null;
  const authHeader = headers().get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.split('Bearer ')[1];
  if (!token) return null;
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}


export async function GET() {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin DB is not initialized.' }, { status: 500 });
    }
    
    const doctorId = await getUserIdFromToken();
    if (!doctorId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const convosSnapshot = await adminDb.collection('conversations')
        .where('doctorId', '==', doctorId)
        .get();

    if (convosSnapshot.empty) {
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
