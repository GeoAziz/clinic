import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { adminDb } = await getAdmin();
        if (!adminDb) {
            throw new Error('Firebase Admin SDK not initialized.');
        }

        const linksSnapshot = await adminDb
            .collection('userSetupLinks')
            .orderBy('createdAt', 'desc')
            .get();

        const links = linksSnapshot.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...(data || {}),
                // Convert Firestore Timestamps to ISO strings if needed
                createdAt: data?.createdAt,
                expiresAt: data?.expiresAt
            };
        });

        return NextResponse.json(links);
    } catch (error: any) {
        console.error('Error fetching setup links:', error);
        return NextResponse.json(
            { error: 'Failed to fetch setup links' },
            { status: 500 }
        );
    }
}
