
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

    const userDoc = await adminDb.collection('nurses').doc(userId).get();
    if (!userDoc.exists) {
        // Fallback to users collection if not in nurses
        const mainUserDoc = await adminDb.collection('users').doc(userId).get();
        if(!mainUserDoc.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        return NextResponse.json(mainUserDoc.data());
    }

    return NextResponse.json(userDoc.data());

  } catch (error) {
    console.error("Error fetching profile: ", error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { adminDb, adminAuth } = await getAdmin();
    if (!adminDb || !adminAuth) return NextResponse.json({ error: 'DB not initialized' }, { status: 500 });

    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await request.json();
    const { displayName, phone, department } = body;
    
    const updates: any = {
      phone,
      department,
      displayName,
      updatedAt: new Date().toISOString()
    };
    
    // Update both users and nurses collection for consistency
    await adminAuth.updateUser(userId, { displayName });
    await adminDb.collection('users').doc(userId).update({ displayName, phone });
    await adminDb.collection('nurses').doc(userId).set(updates, { merge: true });
    
    return NextResponse.json({ success: true, message: "Profile updated successfully" });

  } catch (error) {
    console.error("Error saving profile: ", error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
