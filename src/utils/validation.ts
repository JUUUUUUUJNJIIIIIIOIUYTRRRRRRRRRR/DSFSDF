import { z } from 'zod';

export const promptSchema = z
  .string()
  .trim()
  .min(3, 'Digite pelo menos 3 caracteres.')
  .max(1200, 'Mensagem muito longa. Reduza para no máximo 1200 caracteres.');

export const videoCodeSchema = z
  .string()
  .trim()
  .min(1, 'O código do vídeo é obrigatório.')
  .max(32, 'Use no máximo 32 caracteres no código.')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Use apenas letras, números, _ e - no código.');

export const videoUrlSchema = z
  .string()
  .trim()
  .url('Informe uma URL válida.')
  .refine((url) => /^https?:\/\//.test(url), 'A URL deve começar com http:// ou https://');

const instructionItemSchema = z.object({
  id: z.string().trim().min(1, 'Cada item precisa de id.'),
  title: z.string().trim().min(1, 'Cada item precisa de title.'),
  description: z.string().trim().optional(),
  videoCode: z.string().trim().optional()
});

export const jsonInstructionSchema = z.object({
  title: z.string().trim().optional(),
  items: z.array(instructionItemSchema).min(1, 'O JSON precisa ter ao menos 1 item em items.')
});
