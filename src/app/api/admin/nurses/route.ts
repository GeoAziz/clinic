import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) throw new Error('Firebase Admin SDK not initialized.');
    const snapshot = await adminDb.collection('nurses').get();
    const nurses = snapshot.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => ({
      uid: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(nurses);
  } catch (error: any) {
    console.error('Error fetching nurses:', error);
    return NextResponse.json({ error: 'Failed to fetch nurses' }, { status: 500 });
  }
}
