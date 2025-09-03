import { getAdmin } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { adminDb } = await getAdmin();
        if (!adminDb) {
            throw new Error('Firebase Admin SDK not initialized.');
        }
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: 'Missing link id' }, { status: 400 });
        }
        await adminDb.collection('userSetupLinks').doc(id).update({ status: 'revoked', revokedAt: new Date().toISOString() });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error revoking setup link:', error);
        return NextResponse.json({ error: 'Failed to revoke setup link' }, { status: 500 });
    }
}
