'use server';

import { aiSymptomChecker, AISymptomCheckerInput } from '@/ai/flows/ai-symptom-checker';
import { z } from 'zod';

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
