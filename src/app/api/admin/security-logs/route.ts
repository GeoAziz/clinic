import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

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
