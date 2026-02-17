import { useCallback, useMemo, useState } from 'react';
import { Composer } from './components/Composer';
import { MessageBubble } from './components/MessageBubble';
import { StatusBanner } from './components/StatusBanner';
import { useReducedMotion } from './hooks/useReducedMotion';
import { requestGuidance } from './services/gemini';
import type { ConversationMessage, RequestStatus } from './types';
import { getGeminiApiKey, hasGeminiApiKey } from './utils/env';
import { promptSchema } from './utils/validation';

const initialMessage: ConversationMessage = {
  id: 'init',
  role: 'assistant',
  content:
    'Lilith OS v69 Modular online. Envie seu objetivo e eu vou quebrar em passos guiados (arquitetura, ação e validação).'
};

export const App = () => {
  const reducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<ConversationMessage[]>([initialMessage]);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const apiKeyAvailable = hasGeminiApiKey();
  const disableInteractions = !apiKeyAvailable || status === 'loading';
  const rootClassName = useMemo(
    () => `app-shell ${reducedMotion ? 'reduced-motion' : 'full-motion'}`,
    [reducedMotion]
  );

  const sendPrompt = useCallback(async (rawValue: string) => {
    const parsedPrompt = promptSchema.safeParse(rawValue);

    if (!parsedPrompt.success) {
      setStatus('error');
      setError(parsedPrompt.error.issues[0]?.message ?? 'Prompt inválido.');
      return;
    }

    if (!apiKeyAvailable) {
      setStatus('error');
      setError('Chave de API ausente na configuração local.');
      return;
    }

    const prompt = parsedPrompt.data;
    const userMessage: ConversationMessage = { id: crypto.randomUUID(), role: 'user', content: prompt };

    setStatus('loading');
    setError(null);
    setMessages((current) => [...current, userMessage]);

    try {
      const answer = await requestGuidance(getGeminiApiKey(), [...messages, userMessage], prompt);
      const assistantMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: answer
      };

      setMessages((current) => [...current, assistantMessage]);
      setStatus('success');
    } catch {
      setStatus('error');
      setError('Não foi possível completar a chamada ao modelo. Tente novamente.');
    }
  }, [apiKeyAvailable, messages]);

  return (
    <main className={rootClassName}>
      <section className="crt-overlay" aria-hidden="true" />
      <header>
        <h1>Lilith OS v69 Modular</h1>
        <p>KAE · Guided Instruction Engine</p>
      </header>

      <StatusBanner status={status} error={error} hasApiKey={apiKeyAvailable} />

      <section className="messages" aria-live="polite">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </section>

      <Composer disabled={disableInteractions} onSend={sendPrompt} />
    </main>
  );
};
