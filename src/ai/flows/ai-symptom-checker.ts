'use server';
/**
 * @fileOverview This file defines the AI symptom checker flow.
 *
 * - aiSymptomChecker - A function that takes patient symptoms and returns a pre-diagnosis and triage score.
 * - AISymptomCheckerInput - The input type for the aiSymptomChecker function.
 * - AISymptomCheckerOutput - The return type for the aiSymptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISymptomCheckerInputSchema = z.object({
  symptoms: z.string().describe('The symptoms described by the patient.'),
});
export type AISymptomCheckerInput = z.infer<typeof AISymptomCheckerInputSchema>;

const AISymptomCheckerOutputSchema = z.object({
  preDiagnosis: z.string().describe('The pre-diagnosis based on the symptoms.'),
  triageScore: z.number().describe('The triage score indicating the urgency of the condition.'),
});
export type AISymptomCheckerOutput = z.infer<typeof AISymptomCheckerOutputSchema>;

export async function aiSymptomChecker(input: AISymptomCheckerInput): Promise<AISymptomCheckerOutput> {
  return aiSymptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSymptomCheckerPrompt',
  input: {schema: AISymptomCheckerInputSchema},
  output: {schema: AISymptomCheckerOutputSchema},
  prompt: `You are an AI nurse assistant that helps patients understand the urgency of their condition.
  Based on the symptoms provided, generate a pre-diagnosis and a triage score (1-10, 1 being not urgent, and 10 being extremely urgent).

  Symptoms: {{{symptoms}}}

  Pre-Diagnosis:
  Triage Score: `,
});

const aiSymptomCheckerFlow = ai.defineFlow(
  {
    name: 'aiSymptomCheckerFlow',
    inputSchema: AISymptomCheckerInputSchema,
    outputSchema: AISymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

