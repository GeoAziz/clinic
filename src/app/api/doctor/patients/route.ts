
import { NextResponse } from 'next/server';

// Mock data - in a real app, this would be fetched from a database
// based on the logged-in doctor's assigned patients.
const patients = [
  { id: 'p_1', name: 'John Doe', age: 34, lastVisit: '2024-10-28', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'p_2', name: 'Jane Smith', age: 45, lastVisit: '2024-10-20', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
  { id: 'p_3', name: 'Sam Wilson', age: 28, lastVisit: '2024-09-15', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
];

export async function GET() {
  try {
    // In a real application, you would:
    // 1. Verify the doctor's authentication token.
    // 2. Get the doctor's UID from the token.
    // 3. Query Firestore for patients assigned to that doctor.
    
    // For now, we return mock data after a short delay to simulate a network request.
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(patients);

  } catch (error) {
    console.error("Error fetching patients: ", error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
