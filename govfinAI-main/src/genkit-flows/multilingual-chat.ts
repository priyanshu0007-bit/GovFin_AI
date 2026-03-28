
'use server';
/**
 * @fileOverview A Genkit flow for a multilingual AI assistant that helps Indian citizens
 * with government welfare schemes and personal finances.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MessageData } from 'genkit/types';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']).describe('The role of the message sender.'),
  content: z.string().describe('The textual content of the message.'),
});

const TransactionContextSchema = z.object({
  amount: z.number(),
  category: z.string(),
  type: z.enum(['income', 'expense']),
  note: z.string(),
  date: z.string(),
});

const SavedSchemeContextSchema = z.object({
  schemeId: z.string(),
  name: z.string(),
  ministry: z.string(),
  category: z.string(),
  briefDescription: z.string().optional(),
});

const UserProfileSchema = z.object({
  name: z.string(),
  state: z.string(),
  age: z.number(),
  income: z.number(),
  occupation: z.string().optional(),
  casteCategory: z.string().optional(),
  gender: z.string().optional(),
  familySize: z.number().optional(),
  disability: z.string().optional(),
  language: z.string().optional(),
});

const MultilingualChatInputSchema = z.object({
  messages: z.array(ChatMessageSchema),
  userProfile: UserProfileSchema,
  targetLanguage: z.string(),
  recentTransactions: z.array(TransactionContextSchema).optional(),
  savedSchemes: z.array(SavedSchemeContextSchema).optional(),
});
export type MultilingualChatInput = z.infer<typeof MultilingualChatInputSchema>;

export async function multilingualChat(input: MultilingualChatInput): Promise<string> {
  return multilingualChatFlow(input);
}

const multilingualChatFlow = ai.defineFlow(
  {
    name: 'multilingualChatFlow',
    inputSchema: MultilingualChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { messages, userProfile, targetLanguage, recentTransactions, savedSchemes } = input;

    // Gemini requirement: single system message at the start
    let systemPrompt = `You are GovFinAI Assistant, an expert advisor helping Indian citizens with welfare schemes and finance. Always respond in ${targetLanguage}.

USER PROFILE:
- Name: ${userProfile.name}
- Residence: ${userProfile.state}
- Profile: Age ${userProfile.age}, Income ${userProfile.income} LPA, Category ${userProfile.casteCategory || 'General'}
- Occupation: ${userProfile.occupation || 'Service'}
`;

    if (recentTransactions?.length) {
      systemPrompt += `\nRECENT FINANCES:\n${recentTransactions.map(t => `- ${t.date}: ${t.type} of ₹${t.amount} in ${t.category}`).join('\n')}\n`;
    }

    if (savedSchemes?.length) {
      systemPrompt += `\nINTERESTED SCHEMES:\n${savedSchemes.map(s => `- ${s.name} (${s.ministry})`).join('\n')}\n`;
    }

    const combinedMessages: MessageData[] = [
      { role: 'system', content: [{ text: systemPrompt }] },
      ...messages.map(m => ({
        role: m.role as any,
        content: [{ text: m.content }]
      }))
    ];

    const { response } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      messages: combinedMessages,
      config: { temperature: 0.7 }
    });

    return response.text;
  }
);
