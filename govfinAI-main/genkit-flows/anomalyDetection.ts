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
    category: z.string().optional(), // Category might be null for new transactions
    note: z.string().optional(),
    date: z.string(), // ISO string format
    type: z.enum(['income', 'expense']),
  })).describe('List of all transactions for the current month.'),
  previousMonthsSpendingSummary: z.array(z.object({
    category: z.string(),
    totalAmount: z.number(),
    averageAmount: z.number(),
    transactionCount: z.number(),
  })).describe('Aggregated average spending from the last 3 months, grouped by category.'),
  largeTransactionThreshold: z.number().describe('The monetary threshold above which a single transaction is considered large and potentially anomalous.').default(5000),
});
export type AnomalyDetectionInput = z.infer<typeof AnomalyDetectionInputSchema>;

const AnomalyDetectionOutputSchema = z.array(z.object({
  category: z.string().describe('The category associated with the anomaly, if applicable. Can be 