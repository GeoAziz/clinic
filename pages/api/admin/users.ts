
export const runtime = 'nodejs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdmin } from '../../../src/lib/firebase/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      return res.status(500).json({ error: 'Firebase Admin DB is not initialized.' });
    }
    const usersSnapshot = await adminDb.collection('users').get();
    const users = usersSnapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.displayName || data.fullName || 'N/A',
        email: data.email,
        role: data.role,
        status: 'Active', // Placeholder
        lastLogin: data.lastLogin ? new Date(data.lastLogin.seconds * 1000).toLocaleDateString() : 'N/A',
      };
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching users', details: error });
  }
}
