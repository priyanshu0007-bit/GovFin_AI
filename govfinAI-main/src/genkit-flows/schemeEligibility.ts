'use server';
/**
 * @fileOverview This file implements the schemeEligibility Genkit flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SchemeDetailsForEvaluationSchema = z.object({
  id: z.string(),
  name: z.string(),
  ministry: z.string(),
  category: z.string(),
  description: z.string(),
  eligibilityCriteria: z.object({
    age: z.string().optional(),
    income: z.string().optional(),
    state: z.string().optional(),
    gender: z.string().optional(),
    casteCategory: z.string().optional(),
    occupation: z.string().optional(),
    familySize: z.string().optional(),
    disabilityStatus: z.string().optional(),
  }).optional(),
});

const SchemeEligibilityInputSchema = z.object({
  userProfile: z.object({
    age: z.number(),
    income: z.number(),
    state: z.string(),
    gender: z.string(),
    occupation: z.string(),
    casteCategory: z.string(),
    disabilityStatus: z.boolean(),
    familySize: z.number(),
  }),
  schemes: z.array(SchemeDetailsForEvaluationSchema),
});

export type SchemeEligibilityInput = z.infer<typeof SchemeEligibilityInputSchema>;

const SchemeEligibilityOutputSchema = z.array(
  z.object({
    schemeId: z.string(),
    name: z.string(),
    matchScore: z.number(),
    matchReason: z.string(),
    missingCriteria: z.array(z.string()),
  })
);

export type SchemeEligibilityOutput = z.infer<typeof SchemeEligibilityOutputSchema>;

const schemeEligibilityPrompt = ai.definePrompt({
  name: 'schemeEligibilityPrompt',
  input: { schema: SchemeEligibilityInputSchema },
  output: { schema: SchemeEligibilityOutputSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert Government Financial Inclusion Assistant. Evaluate user eligibility for the provided schemes.

User Profile:
- Age: {{{userProfile.age}}}
- Annual Income: INR {{{userProfile.income}}} LPA
- State: {{{userProfile.state}}}
- Gender: {{{userProfile.gender}}}
- Occupation: {{{userProfile.occupation}}}
- Caste Category: {{{userProfile.casteCategory}}}
- Disability Status: {{#if userProfile.disabilityStatus}}Yes{{else}}No{{/if}}
- Family Size: {{{userProfile.familySize}}}

List of Schemes:
{{#each schemes}}
Scheme ID: {{{this.id}}}
Scheme Name: {{{this.name}}}
Ministry: {{{this.ministry}}}
Description: {{{this.description}}}
Eligibility: {{{json this.eligibilityCriteria}}}
---
{{/each}}

Provide a matchScore (0-100), matchReason, and missingCriteria for each. Return top 10.`,
});

const schemeEligibilityFlow = ai.defineFlow(
  {
    name: 'schemeEligibilityFlow',
    inputSchema: SchemeEligibilityInputSchema,
    outputSchema: SchemeEligibilityOutputSchema,
  },
  async (input) => {
    const { output } = await schemeEligibilityPrompt(input);
    return output?.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10) || [];
  }
);

export async function schemeEligibility(input: SchemeEligibilityInput): Promise<SchemeEligibilityOutput> {
  return schemeEligibilityFlow(input);
}
