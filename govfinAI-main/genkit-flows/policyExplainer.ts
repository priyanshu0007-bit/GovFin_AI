'use server';
/**
 * @fileOverview A Genkit flow for explaining complex policy documents in simple, easy-to-understand language.
 *
 * - policyExplainer - A function that handles the policy explanation process.
 * - PolicyExplainerInput - The input type for the policyExplainer function.
 * - PolicyExplainerOutput - The return type for the policyExplainer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PolicyExplainerInputSchema = z.object({
  policyText: z.string().describe('The complex policy document text to be explained.'),
  targetLanguage: z
    .enum(['en', 'hi', 'mr', 'ta', 'te', 'bn', 'gu'])
    .describe('The target language for the explanation (e.g., en for English, hi for Hindi).'),
  userEducationLevel:
    z.enum(['basic', 'intermediate']).describe('The user's education level to tailor the explanation.'),
});
export type PolicyExplainerInput = z.infer<typeof PolicyExplainerInputSchema>;

const PolicyExplainerOutputSchema = z.object({
  summary: z.string().describe('A two-sentence summary of the policy.'),
  keyBenefits: z.array(z.string()).describe('A list of key benefits from the policy.'),
  howToApply: z.array(z.string()).describe('A list of steps on how to apply for the policy/scheme.'),
  importantDates: z
    .array(z.string())
    .describe('A list of important dates related to the policy (e.g., deadlines, start dates).'),
});
export type PolicyExplainerOutput = z.infer<typeof PolicyExplainerOutputSchema>;

export async function policyExplainer(input: PolicyExplainerInput): Promise<PolicyExplainerOutput> {
  return policyExplainerFlow(input);
}

const policyExplainerPrompt = ai.definePrompt({
  name: 'policyExplainerPrompt',
  input: { schema: PolicyExplainerInputSchema },
  output: { schema: PolicyExplainerOutputSchema },
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are an expert at simplifying complex government policy documents for Indian citizens. Your goal is to explain the provided policy text in a simple, easy-to-understand manner, suitable for a user with a '{{{userEducationLevel}}}' education level.

The explanation must be provided in '{{{targetLanguage}}}'.

Carefully read the policy text and extract the following information:
- A two-sentence summary of the policy.
- A list of the key benefits it offers.
- A list of steps on how to apply for the policy or scheme.
- A list of any important dates associated with the policy (e.g., application deadlines, start dates).

Policy Text:
{{policyText}}
`,
});

const policyExplainerFlow = ai.defineFlow(
  {
    name: 'policyExplainerFlow',
    inputSchema: PolicyExplainerInputSchema,
    outputSchema: PolicyExplainerOutputSchema,
  },
  async (input) => {
    const { output } = await policyExplainerPrompt(input);
    return output!;
  },
);
