
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../src/lib/firebase/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!adminDb) {
    return res.status(500).json({ error: 'Firebase Admin DB is not initialized.' });
  }
  try {
    const usersSnapshot = await adminDb.collection('users').get();
    const users = usersSnapshot.docs.map(doc => {
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
