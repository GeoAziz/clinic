
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

    // In a real app, you'd get the patient ID from their authenticated session
    // const patientId = await getUserIdFromToken();
    // For now, we'll use a mock ID. Replace with real auth later.
    const patientId = "p_1";

    if (!patientId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch upcoming appointment
    const appointmentsSnapshot = await adminDb.collection('appointments')
        .where('patientId', '==', patientId)
        .where('date', '>=', new Date().toISOString().split('T')[0])
        .orderBy('date', 'asc')
        .limit(1)
        .get();

    let upcomingAppointment = null;
    if (!appointmentsSnapshot.empty) {
        upcomingAppointment = appointmentsSnapshot.docs[0].data();
    }

    // Fetch recent lab results
    const labResultsSnapshot = await adminDb.collection('labResults')
        .where('patientId', '==', patientId)
        .orderBy('date', 'desc')
        .limit(1)
        .get();
        
    let recentActivity = null;
    if (!labResultsSnapshot.empty) {
        const lab = labResultsSnapshot.docs[0].data();
        recentActivity = `Lab results for '${lab.testName}' are available.`;
    }

    return NextResponse.json({ upcomingAppointment, recentActivity });

  } catch (error) {
    console.error("Error fetching patient dashboard data: ", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
