import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) throw new Error('Firebase Admin SDK not initialized.');
    const { nurseId, patientId } = await request.json();
    if (!nurseId || !patientId) {
      return NextResponse.json({ error: 'Missing nurseId or patientId' }, { status: 400 });
    }
    const nurseRef = adminDb.collection('nurses').doc(nurseId);
    await nurseRef.update({
      assignedPatients: adminDb.FieldValue.arrayUnion(patientId)
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error assigning patient:', error);
    return NextResponse.json({ error: 'Failed to assign patient' }, { status: 500 });
  }
}
