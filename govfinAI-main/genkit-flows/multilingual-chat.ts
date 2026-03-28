'use server';
/**
 * @fileOverview A Genkit flow for a multilingual AI assistant that helps Indian citizens
 * with government schemes, personal finances, and policy explanations, responding in the user's preferred language.
 *
 * - multilingualChat - The main function to interact with the AI assistant.
 * - MultilingualChatInput - The input type for the multilingualChat function.
 * - MultilingualChatOutput - The return type for the multilingualChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MessageData } from 'genkit/types';

/**
 * Zod schema for a single chat message in the conversation history.
 */
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']).describe('The role of the message sender (user or AI model).'),
  content: z.string().describe('The textual content of the message.'),
});

/**
 * Zod schema for recent financial transactions to provide context to the AI.
 */
const TransactionContextSchema = z.object({
  amount: z.number().describe('The amount of the transaction.'),
  category: z.string().describe('The category of the transaction (e.g., Food, Transport).'),
  type: z.enum(['income', 'expense']).describe('The type of transaction.'),
  note: z.string().describe('A short description of the transaction.'),
  date: z.string().describe('The date of the transaction in YYYY-MM-DD format.'),
});

/**
 * Zod schema for saved schemes to provide context to the AI.
 */
const SavedSchemeContextSchema = z.object({
  schemeId: z.string().describe('The unique ID of the saved scheme.'),
  name: z.string().describe('The name of the saved scheme.'),
  ministry: z.string().describe('The ministry responsible for the scheme.'),
  category: z.string().describe('The category of the scheme (e.g., Education, Health).'),
  briefDescription: z.string().optional().describe('A brief description of the scheme.'),
});

/**
 * Zod schema for the user's profile information.
 */
const UserProfileSchema = z.object({
  name: z.string().describe("User's full name."),
  state: z.string().describe("User's state of residence in India."),
  age: z.number().describe("User's age."),
  income: z.number().describe("User's annual income."),
  occupation: z.string().optional().describe("User's occupation."),
  casteCategory: z.string().optional().describe("User's caste category (e.g., SC, ST, OBC, General). "),
  gender: z.string().optional().describe("User's gender."),
  familySize: z.number().optional().describe("Number of people in user's family."),
  disability: z.string().optional().describe("User's disability status (e.g., 'none', 'physical', 'visual')."),
  language: z.string().optional().describe("User's preferred language in profile, primarily for static UI strings."),
});

/**
 * Input schema for the multilingualChat Genkit flow.
 */
const MultilingualChatInputSchema = z.object({
  messages: z.array(ChatMessageSchema).describe('Conversation history with the AI assistant.'),
  userProfile: UserProfileSchema.describe('The current user\'s detailed profile information.'),
  targetLanguage: z.string().describe('The language in which the AI assistant should respond (e.g., "English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali", "Gujarati").'),
  recentTransactions: z.array(TransactionContextSchema).optional().describe('A list of recent financial transactions for contextual understanding.'),
  savedSchemes: z.array(SavedSchemeContextSchema).optional().describe('A list of schemes the user has saved or expressed interest in for context.'),
});
export type MultilingualChatInput = z.infer<typeof MultilingualChatInputSchema>;

/**
 * Output schema for the multilingualChat Genkit flow.
 */
const MultilingualChatOutputSchema = z.string().describe('The AI assistant\'s complete streaming response in the target language.');
export type MultilingualChatOutput = z.infer<typeof MultilingualChatOutputSchema>;

/**
 * Exports the multilingualChat function, which serves as a wrapper around the Genkit flow.
 */
export async function multilingualChat(input: MultilingualChatInput): Promise<MultilingualChatOutput> {
  return multilingualChatFlow(input);
}

/**
 * Defines the Genkit flow for the multilingual AI assistant.
 * This flow constructs a detailed prompt including user profile, recent transactions,
 * saved schemes, and conversation history to provide contextual and multilingual responses.
 */
const multilingualChatFlow = ai.defineFlow(
  {
    name: 'multilingualChatFlow',
    inputSchema: MultilingualChatInputSchema,
    outputSchema: MultilingualChatOutputSchema,
  },
  async (input) => {
    const { messages, userProfile, targetLanguage, recentTransactions, savedSchemes } = input;

    const systemInstruction = `You are GovFinAI Assistant, helping Indian citizens understand government welfare schemes and manage personal finances. Always respond in ${targetLanguage}. Be empathetic, clear, and helpful.`;

    const contextMessages: MessageData[] = [];

    // Add system instruction as the first message
    contextMessages.push({
      role: 'system',
      content: [{
        text: systemInstruction
      }],
    });

    // Add user profile as part of the context
    contextMessages.push({
      role: 'system',
      content: [{
        text: `User Profile: ${JSON.stringify(userProfile, null, 2)}`
      }],
    });

    // Add recent transactions if available
    if (recentTransactions && recentTransactions.length > 0) {
      contextMessages.push({
        role: 'system',
        content: [{
          text: `Recent Transactions: ${JSON.stringify(recentTransactions, null, 2)}`
        }],
      });
    }

    // Add saved schemes if available
    if (savedSchemes && savedSchemes.length > 0) {
      contextMessages.push({
        role: 'system',
        content: [{
          text: `Saved Schemes (ID, Name, Ministry, Category, Brief Description):
${savedScheemes.map(s => `- ${s.schemeId}: ${s.name} (${s.ministry}, ${s.category})${s.briefDescription ? ` - ${s.briefDescription}` : ''}`).join('\n')}`
        }],
      });
    }

    // Convert chat history messages to Genkit's MessageData format
    const chatHistoryMessages: MessageData[] = messages.map(m => ({
      role: m.role,
      content: [{ text: m.content }]
    }));

    // Combine all context and chat history messages
    const combinedMessages: MessageData[] = [...contextMessages, ...chatHistoryMessages];

    const { stream, response } = ai.generateStream({
      model: 'googleai/gemini-1.5-pro',
      messages: combinedMessages,
      config: {
        temperature: 0.7, // A balanced temperature for creative yet coherent responses
      },
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      if (chunk.content) {
        fullResponse += chunk.content.text();
      }
    }
    await response; // Wait for the full response to ensure all data is processed/logged

    return fullResponse;
  }
);
