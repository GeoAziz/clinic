
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

export async function POST(request: Request) {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) return NextResponse.json({ error: 'DB not initialized' }, { status: 500 });

    const nurseId = await getUserIdFromToken();
    if (!nurseId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await request.json();
    const { patientId, vitals, notes } = body;

    if (!patientId || !vitals) {
        return NextResponse.json({ error: 'Missing patientId or vitals data' }, { status: 400 });
    }
    
    const vitalsRecord = {
      patientId,
      nurseId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ...vitals,
      notes,
    };
    
    await adminDb.collection('vitalsLog').add(vitalsRecord);
    
    // Could also update a `lastVitalsTaken` field on the patient document
    
    return NextResponse.json({ success: true, message: "Vitals logged successfully" });

  } catch (error) {
    console.error("Error logging vitals: ", error);
    return NextResponse.json({ error: 'Failed to log vitals' }, { status: 500 });
  }
}
