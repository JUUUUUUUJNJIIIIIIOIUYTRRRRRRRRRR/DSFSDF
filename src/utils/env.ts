export const getGeminiApiKey = (): string => {
  const viteKey = import.meta.env.VITE_GEMINI_API_KEY;
  const fallbackKey = import.meta.env.GEMINI_API_KEY;
  return (viteKey || fallbackKey || '').trim();
};

export const hasGeminiApiKey = (): boolean => Boolean(getGeminiApiKey());
