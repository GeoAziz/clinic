
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) throw new Error('Firebase Admin SDK not initialized.');
    const { nurseId, schedule } = await request.json();
    if (!nurseId || !Array.isArray(schedule)) {
      return NextResponse.json({ error: 'Missing nurseId or schedule' }, { status: 400 });
    }
    const nurseRef = adminDb.collection('nurses').doc(nurseId);
    await nurseRef.update({ schedule });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating schedule:', error);
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}
