import { z } from 'zod';

export const promptSchema = z
  .string()
  .trim()
  .min(3, 'Digite pelo menos 3 caracteres.')
  .max(1200, 'Mensagem muito longa. Reduza para no máximo 1200 caracteres.');
