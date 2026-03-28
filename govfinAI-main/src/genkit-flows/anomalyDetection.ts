'use server';
/**
 * @fileOverview This file implements a Genkit flow for detecting financial anomalies.
 *
 * - detectAnomalies - A function that handles the anomaly detection process.
 * - AnomalyDetectionInput - The input type for the detectAnomalies function.
 * - AnomalyDetectionOutput - The return type for the detectAnomalies function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnomalyDetectionInputSchema = z.object({
  currentMonthTransactions: z.array(z.object({
    id: z.string().optional(),
    amount: z.number(),
    category: z.string().optional(),
    note: z.string().optional(),
    date: z.string(),
    type: z.enum(['income', 'expense']),
  })).describe('List of all transactions for the current month.'),
  previousMonthsSpendingSummary: z.array(z.object({
    category: z.string(),
    totalAmount: z.number(),
    averageAmount: z.number(),
    transactionCount: z.number(),
  })).describe('Aggregated average spending from the last 3 months, grouped by category.'),
  largeTransactionThreshold: z.number().describe('The monetary threshold above which a single transaction is considered large.').default(5000),
});
export type AnomalyDetectionInput = z.infer<typeof AnomalyDetectionInputSchema>;

const AnomalyDetectionOutputSchema = z.array(z.object({
  category: z.string().describe('The category associated with the anomaly.'),
  anomalyType: z.enum(['spike', 'unusual_category', 'large_transaction']).describe('The type of anomaly detected.'),
  reason: z.string().describe('A simple explanation of why this is considered an anomaly.'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity of the anomaly.'),
}));
export type AnomalyDetectionOutput = z.infer<typeof AnomalyDetectionOutputSchema>;

export async function detectAnomalies(input: AnomalyDetectionInput): Promise<AnomalyDetectionOutput> {
  return anomalyDetectionFlow(input);
}

const anomalyPrompt = ai.definePrompt({
  name: 'anomalyDetectionPrompt',
  input: { schema: AnomalyDetectionInputSchema },
  output: { schema: AnomalyDetectionOutputSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an AI financial auditor for an Indian citizen. Your goal is to detect unusual spending patterns (anomalies) in the current month's transactions compared to previous trends.

### Current Transactions:
{{#each currentMonthTransactions}}
- {{date}}: {{type}} of {{amount}} in {{category}} (Note: {{note}})
{{/each}}

### Historical Averages (Per Category):
{{#each previousMonthsSpendingSummary}}
- {{category}}: Average {{averageAmount}} per month.
{{/each}}

### Detection Rules:
1. **Spike**: If current spending in a category is > 50% higher than the historical average.
2. **Large Transaction**: Any single transaction above {{largeTransactionThreshold}}.
3. **Unusual Category**: A high amount spent in a category rarely used before.

Provide a list of detected anomalies with a clear reason and severity level.`,
});

const anomalyDetectionFlow = ai.defineFlow(
  {
    name: 'anomalyDetectionFlow',
    inputSchema: AnomalyDetectionInputSchema,
    outputSchema: AnomalyDetectionOutputSchema,
  },
  async (input) => {
    const { output } = await anomalyPrompt(input);
    return output || [];
  }
);
