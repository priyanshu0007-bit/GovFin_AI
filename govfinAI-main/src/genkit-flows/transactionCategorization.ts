'use server';
/**
 * @fileOverview An AI agent to categorize financial transactions based on a description.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AICategorizeTransactionInputSchema = z.object({
  note: z.string().describe('The description or note of the transaction.'),
  categories: z
    .array(z.string())
    .describe('A list of predefined categories to choose from.'),
});
export type AICategorizeTransactionInput = z.infer<
  typeof AICategorizeTransactionInputSchema
>;

const AICategorizeTransactionOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe('The suggested category from the provided list.'),
});
export type AICategorizeTransactionOutput = z.infer<
  typeof AICategorizeTransactionOutputSchema
>;

export async function aiCategorizeTransaction(
  input: AICategorizeTransactionInput
): Promise<AICategorizeTransactionOutput> {
  return transactionCategorizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: { schema: AICategorizeTransactionInputSchema },
  output: { schema: AICategorizeTransactionOutputSchema },
  prompt: `You are an AI assistant specialized in categorizing financial transactions.

Based on the transaction note provided, select the single best category from the given list of available categories. 

Ensure your response for 'suggestedCategory' is *exactly* one of the provided categories. Do not provide any other text or explanation in your output, just the suggested category.

Transaction Note: "{{{note}}}"
Available Categories: {{{categories}}}`,
});

const transactionCategorizationFlow = ai.defineFlow(
  {
    name: 'transactionCategorizationFlow',
    inputSchema: AICategorizeTransactionInputSchema,
    outputSchema: AICategorizeTransactionOutputSchema,
    model: 'googleai/gemini-1.5-flash',
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
