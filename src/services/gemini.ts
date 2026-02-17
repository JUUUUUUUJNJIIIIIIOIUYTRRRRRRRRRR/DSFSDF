import { GoogleGenAI } from '@google/genai';
import type { ConversationMessage } from '../types';

const SYSTEM_PROMPT =
  'Você é KAE, um assistente de instrução guiada com tom direto, técnico e amigável. Responda em português de forma objetiva.';

export const requestGuidance = async (
  apiKey: string,
  history: ConversationMessage[],
  userPrompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey });

  const condensedHistory = history.slice(-8).map((message) => `${message.role}: ${message.content}`).join('\n');
  const prompt = `${SYSTEM_PROMPT}\n\nContexto:\n${condensedHistory}\n\nPergunta atual:\n${userPrompt}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text?.trim() || 'Sem resposta do modelo.';
};
