import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

export async function GET() {
    try {
        const { adminDb } = await getAdmin();
        if (!adminDb) {
            throw new Error('Firebase Admin SDK not initialized.');
        }
        const logsSnapshot = await adminDb
            .collection('securityLogs')
            .orderBy('timestamp', 'desc')
            .limit(100)
            .get();
        const logs = logsSnapshot.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return NextResponse.json(logs);
    } catch (error: any) {
        console.error('Error fetching security logs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch security logs' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
     try {
        const { adminDb } = await getAdmin();
        if (!adminDb) {
            throw new Error('Firebase Admin SDK not initialized.');
        }
        const logData = await request.json();
        
        await adminDb.collection('securityLogs').add({
            ...logData,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error writing security log:', error);
        return NextResponse.json(
            { error: 'Failed to write security log' },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';
