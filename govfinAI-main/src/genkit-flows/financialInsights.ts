'use server';
/**
 * @fileOverview This file implements a Genkit flow for providing personalized financial insights.
 *
 * - getFinancialInsights - A function that analyzes user transactions and profile to provide financial insights.
 * - FinancialInsightsInput - The input type for the getFinancialInsights function.
 * - FinancialInsightsOutput - The return type for the getFinancialInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TransactionSchema = z.object({
  amount: z.number().describe('The amount of the transaction.'),
  category: z.string().describe('The category of the transaction (e.g., Food, Transport, Rent).'),
  type: z.enum(['income', 'expense']).describe('Whether the transaction is an income or an expense.'),
  note: z.string().optional().describe('An optional note or description for the transaction.'),
  date: z.string().describe('The date of the transaction in YYYY-MM-DD format.'),
  aiCategory: z.string().optional().describe('AI-suggested category for the transaction, if available.'),
});

const UserProfileForFinanceSchema = z.object({
  income: z.number().describe('The user\u0027s estimated monthly or annual income.'),
  age: z.number().describe('The user\u0027s age.'),
  state: z.string().describe('The user\u0027s state of residence in India.'),
  gender: z.string().describe('The user\u0027s gender.'),
  occupation: z.string().optional().describe('The user\u0027s occupation.'),
  casteCategory: z.string().optional().describe('The user\u0027s caste category.'),
  disability: z.boolean().optional().describe('Whether the user has a disability.'),
  familySize: z.number().optional().describe('The number of people in the user\u0027s family.'),
});

const FinancialInsightsInputSchema = z.object({
  transactions: z.array(TransactionSchema).describe('A list of user transactions for the last 90 days.'),
  userProfile: UserProfileForFinanceSchema.describe('The user\u0027s relevant profile information for financial analysis.'),
});
export type FinancialInsightsInput = z.infer<typeof FinancialInsightsInputSchema>;

const FinancialInsightsOutputSchema = z.object({
  insights: z.array(z.string()).length(5).describe('A list of 5 personalized financial insights based on the user data.'),
  recommendations: z.array(z.string()).length(3).describe('A list of 3 actionable financial recommendations.'),
  savingsScore: z.number().min(0).max(100).describe('A savings score from 0 to 100, indicating financial health.'),
});
export type FinancialInsightsOutput = z.infer<typeof FinancialInsightsOutputSchema>;

export async function getFinancialInsights(input: FinancialInsightsInput): Promise<FinancialInsightsOutput> {
  return financialInsightsFlow(input);
}

const financialInsightsPrompt = ai.definePrompt({
  name: 'financialInsightsPrompt',
  input: { schema: FinancialInsightsInputSchema },
  output: { schema: FinancialInsightsOutputSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert financial advisor and personal finance assistant for Indian citizens. Your goal is to analyze the provided financial data and user profile to generate personalized insights, actionable recommendations, and a savings score.

### User Profile:
Income: {{{userProfile.income}}}
Age: {{{userProfile.age}}}
State: {{{userProfile.state}}}
Gender: {{{userProfile.gender}}}
{{#if userProfile.occupation}}Occupation: {{{userProfile.occupation}}}{{/if}}
{{#if userProfile.casteCategory}}Caste Category: {{{userProfile.casteCategory}}}{{/if}}
{{#if userProfile.disability}}Disability: {{{userProfile.disability}}}{{/if}}
{{#if userProfile.familySize}}Family Size: {{{userProfile.familySize}}}{{/if}}

### Transactions (Last 90 Days):
{{#if transactions.length}}
{{#each transactions}}
- Date: {{{date}}}, Type: {{{type}}}, Category: {{{category}}}, Amount: {{{amount}}}, Note: '{{{note}}}'
{{/each}}
{{else}}
No transactions provided.
{{/if}}

### Instructions:
1.  **Insights**: Generate exactly 5 concise, personalized financial insights based on the user's spending patterns, income, and any relevant profile information. Highlight trends, significant changes, or areas of concern.
2.  **Recommendations**: Provide exactly 3 actionable, practical recommendations to improve the user's financial health, saving rate, or spending habits. Tailor these to the Indian context if applicable.
3.  **Savings Score**: Calculate a savings score between 0 and 100. A higher score indicates better financial health and saving habits. Provide a brief justification if possible in the insights.

Ensure the output strictly adheres to the JSON schema provided, with exactly 5 insights and 3 recommendations.`,
});

const financialInsightsFlow = ai.defineFlow(
  {
    name: 'financialInsightsFlow',
    inputSchema: FinancialInsightsInputSchema,
    outputSchema: FinancialInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await financialInsightsPrompt(input);
    return output!;
  }
);
