
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
  role: z.enum(['patient', 'doctor', 'receptionist', 'admin']),
});

export async function createUser(prevState: any, formData: FormData) {
    const validatedFields = createUserSchema.safeParse({
        email: formData.get('email'),
        fullName: formData.get('fullName'),
        role: formData.get('role'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input.',
        };
    }

    const { email, fullName, role } = validatedFields.data;

    try {
        const { adminAuth, adminDb } = await getAdmin();
        if (!adminAuth || !adminDb) {
            throw new Error('Firebase Admin SDK not initialized.');
        }

        const userRecord = await adminAuth.createUser({
            email,
            emailVerified: false, // User will verify via password reset link
            displayName: fullName,
            disabled: false,
        });

        await adminAuth.setCustomUserClaims(userRecord.uid, { role });

        await adminDb.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            displayName: fullName,
            role,
            createdAt: new Date().toISOString(),
        });

        const link = await adminAuth.generatePasswordResetLink(email);

        return {
            message: `User created successfully!`,
            data: {
                ...validatedFields.data,
                resetLink: link
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
