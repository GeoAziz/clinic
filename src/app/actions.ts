
'use server';

import { aiSymptomChecker, AISymptomCheckerInput } from '@/ai/flows/ai-symptom-checker';
import { z } from 'zod';
import { getAdmin } from '@/lib/firebase/admin';


const symptomSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in more detail.'),
});

export async function checkSymptoms(prevState: any, formData: FormData) {
  const validatedFields = symptomSchema.safeParse({
    symptoms: formData.get('symptoms'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.symptoms?.[0] || 'Invalid input.',
    };
  }

  try {
    const input: AISymptomCheckerInput = {
      symptoms: validatedFields.data.symptoms,
    };
    const result = await aiSymptomChecker(input);
    return { data: {...result, symptoms: input.symptoms } };
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

const createUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  role: z.enum(['patient', 'doctor', 'nurse', 'receptionist', 'admin']),
});

export async function createUser(prevState: any, formData: FormData) {
    console.log('Server Action: createUser started');
    const validatedFields = createUserSchema.safeParse({
        email: formData.get('email'),
        fullName: formData.get('fullName'),
        role: formData.get('role'),
    });

    if (!validatedFields.success) {
        console.log('Server Action: Validation failed', validatedFields.error);
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input.',
        };
    }

    const { email, fullName, role } = validatedFields.data;
    console.log('Server Action: Creating user with data:', { email, fullName, role });

    try {
        const { adminAuth, adminDb } = await getAdmin();
        if (!adminAuth || !adminDb) {
            throw new Error('Firebase Admin SDK not initialized.');
        }

        // Step 1: Create Firebase Auth User
        console.log('Server Action: Creating Firebase Auth user...');
        const userRecord = await adminAuth.createUser({
            email,
            emailVerified: false,
            displayName: fullName,
            disabled: false,
        });
        console.log('Server Action: User created in Firebase Auth', userRecord.uid);

        // Step 2: Set Role Claims
        console.log('Server Action: Setting custom claims...');
        await adminAuth.setCustomUserClaims(userRecord.uid, { role });

        // Step 3: Create User Profile
        console.log('Server Action: Creating user profile in Firestore...');
        const userData = {
            uid: userRecord.uid,
            email,
            displayName: fullName,
            role,
            createdAt: new Date().toISOString(),
            status: 'Pending',
            lastLogin: null,
        };
        await adminDb.collection('users').doc(userRecord.uid).set(userData);

    // Step 4: Create Role-Specific Profile if needed
    if (role === 'doctor') {
      console.log('Server Action: Creating doctor profile...');
      await adminDb.collection('doctors').doc(userRecord.uid).set({
        ...userData,
        specialty: '',
        department: '',
        consultationFee: 0,
        availability: [],
      });
    }
    if (role === 'nurse') {
      console.log('Server Action: Creating nurse profile...');
      await adminDb.collection('nurses').doc(userRecord.uid).set({
        ...userData,
        assignedPatients: [],
        schedule: [],
        department: '',
      });
    }

        // Step 5: Generate Secure Setup Link
        console.log('Server Action: Generating password reset link...');
        const link = await adminAuth.generatePasswordResetLink(email);
        console.log('Server Action: Setup link generated successfully');

        // Store the reset link in a separate collection for auditing
        await adminDb.collection('userSetupLinks').doc(userRecord.uid).set({
            userId: userRecord.uid,
            email: email,
            link: link,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours expiry
            status: 'active'
        });

        return {
            message: 'User created successfully!',
            data: {
                ...validatedFields.data,
                resetLink: link,
                uid: userRecord.uid
            }
        };
    } catch (error: any) {
        console.error('Error creating user:', error);
        let errorMessage = 'An unexpected error occurred.';
        if (error.code === 'auth/email-already-exists') {
            errorMessage = 'A user with this email address already exists.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        return {
            message: errorMessage,
            error: { _form: [errorMessage] }
        };
    }
}


const updateUserSchema = z.object({
  uid: z.string().min(1, 'User ID is required.'),
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }).optional(),
  role: z.enum(['patient', 'doctor', 'nurse', 'receptionist', 'admin']).optional(),
});

export async function updateUser(prevState: any, formData: FormData) {
  const validatedFields = updateUserSchema.safeParse({
    uid: formData.get('uid'),
    fullName: formData.get('fullName'),
    role: formData.get('role'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid input.',
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { uid, fullName, role } = validatedFields.data;
  const updates: any = {};
  if (fullName) updates.displayName = fullName;
  if (role) updates.role = role;


  try {
    const { adminAuth, adminDb } = await getAdmin();
    if (!adminAuth || !adminDb) {
      throw new Error('Firebase Admin SDK not initialized.');
    }

    // Update Auth
    if (fullName) {
        await adminAuth.updateUser(uid, { displayName: fullName });
    }
    if (role) {
        await adminAuth.setCustomUserClaims(uid, { role });
    }
    
    // Update Firestore
    await adminDb.collection('users').doc(uid).update(updates);
    
    return { message: 'User updated successfully!' };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { message: 'An unexpected error occurred.', error: { _form: [error.message] } };
  }
}

const deactivateUserSchema = z.object({
    uid: z.string().min(1, 'User ID is required.'),
});

export async function deactivateUser(prevState: any, formData: FormData) {
    const validatedFields = deactivateUserSchema.safeParse({
        uid: formData.get('uid'),
    });

    if (!validatedFields.success) {
        return { message: 'Invalid User ID.' };
    }
    
    const { uid } = validatedFields.data;

    try {
        const { adminAuth, adminDb } = await getAdmin();
        if (!adminAuth || !adminDb) {
            throw new Error('Firebase Admin SDK not initialized.');
        }

        await adminAuth.updateUser(uid, { disabled: true });
        await adminDb.collection('users').doc(uid).update({ status: 'Inactive' });

        return { message: 'User deactivated successfully!' };
    } catch (error: any) {
        console.error('Error deactivating user:', error);
        return { message: 'An unexpected error occurred.' };
    }
}

const appointmentSchema = z.object({
  service: z.string().min(1, 'Service is required.'),
  doctorId: z.string().min(1, 'Doctor is required.'),
  doctorName: z.string().min(1, 'Doctor name is required.'),
  date: z.string().min(1, 'Date is required.'),
  time: z.string().min(1, 'Time is required.'),
  patientId: z.string().min(1, 'Patient ID is required.'),
  patientName: z.string().min(1, 'Patient name is required.'),
});

export async function createAppointment(prevState: any, formData: FormData) {
  const validatedFields = appointmentSchema.safeParse({
    service: formData.get('service'),
    doctorId: formData.get('doctorId'),
    doctorName: formData.get('doctorName'),
    date: formData.get('date'),
    time: formData.get('time'),
    patientId: formData.get('patientId'),
    patientName: formData.get('patientName'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid appointment data.',
    };
  }
  
  try {
    const { adminDb } = await getAdmin();
    if (!adminDb) {
      throw new Error('Firebase Admin SDK not initialized.');
    }
    
    const appointmentData = {
      ...validatedFields.data,
      status: 'Confirmed', // Default status
      createdAt: new Date().toISOString(),
    };

    await adminDb.collection('appointments').add(appointmentData);

    return { message: 'Appointment created successfully!' };

  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return { 
        message: 'An unexpected error occurred.',
        error: { _form: [error.message] } 
    };
  }
}
