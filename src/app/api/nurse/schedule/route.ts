
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

    const schedule = nurseDoc.data()?.schedule || [];
    // sort by date
    schedule.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Error fetching nurse schedule: ", error);
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
