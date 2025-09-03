
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    const { adminDb, adminAuth } = await getAdmin();
    if (!adminDb || !adminAuth) throw new Error('Firebase Admin SDK not initialized.');
    const { nurseId, patientId } = await request.json();
    if (!nurseId || !patientId) {
      return NextResponse.json({ error: 'Missing nurseId or patientId' }, { status: 400 });
    }
    
    const nurseRef = adminDb.collection('nurses').doc(nurseId);
    
    await nurseRef.update({
      assignedPatients: FieldValue.arrayUnion(patientId)
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error assigning patient:', error);
    return NextResponse.json({ error: 'Failed to assign patient' }, { status: 500 });
  }
}
