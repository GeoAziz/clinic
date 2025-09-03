
import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

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
    if (!adminDb) return NextResponse.json({ error: 'DB not initialized' }, { status: 500 });
    
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const nurseDoc = await adminDb.collection('nurses').doc(userId).get();
    if (!nurseDoc.exists) {
        return NextResponse.json({ error: 'Nurse profile not found' }, { status: 404 });
    }

    const assignedPatientIds = nurseDoc.data()?.assignedPatients || [];
    if (assignedPatientIds.length === 0) {
        return NextResponse.json([]);
    }

    const patientsSnapshot = await adminDb.collection('users').where('uid', 'in', assignedPatientIds).get();
    const patients = patientsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.displayName || data.fullName,
            avatar: `https://i.pravatar.cc/150?u=${doc.id}`,
            // These would be fetched from a 'patientAdmissions' collection in a real app
            room: `B-${Math.floor(Math.random() * 200) + 100}`, 
            lastVitalsTime: 'Today, 08:00 AM'
        }
    });
    
    return NextResponse.json(patients);

  } catch (error) {
    console.error("Error fetching assigned patients: ", error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
