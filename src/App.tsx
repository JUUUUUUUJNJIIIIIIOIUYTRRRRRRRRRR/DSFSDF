import { useCallback, useEffect, useMemo, useState } from 'react';
import { Composer } from './components/Composer';
import { JsonInstructionRunner } from './components/JsonInstructionRunner';
import { MessageBubble } from './components/MessageBubble';
import { StatusBanner } from './components/StatusBanner';
import { VideoConfigPanel } from './components/VideoConfigPanel';
import { useReducedMotion } from './hooks/useReducedMotion';
import { requestGuidance } from './services/gemini';
import type { ConversationMessage, RequestStatus, VideoConfig } from './types';
import { getGeminiApiKey, hasGeminiApiKey } from './utils/env';
import { promptSchema, videoCodeSchema, videoUrlSchema } from './utils/validation';
import { buildVideoRegistry } from './utils/video';

const STORAGE_KEY = 'kae-video-configs';

const initialMessage: ConversationMessage = {
  id: 'init',
  role: 'assistant',
  content:
    'Lilith OS v69 Modular online. Envie seu objetivo e eu vou quebrar em passos guiados (arquitetura, ação e validação).'
};

const loadStoredConfigs = (): VideoConfig[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((entry): entry is VideoConfig => {
        if (!entry || typeof entry !== 'object') {
          return false;
        }

        const obj = entry as Record<string, unknown>;
        const codeOk = videoCodeSchema.safeParse(obj.code).success;
        const urlOk = videoUrlSchema.safeParse(obj.url).success;
        return codeOk && urlOk;
      })
      .map((entry) => ({ code: entry.code.trim(), url: entry.url.trim() }));
  } catch {
    return [];
  }
};

export const App = () => {
  const reducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<ConversationMessage[]>([initialMessage]);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [videoConfigs, setVideoConfigs] = useState<VideoConfig[]>(() => loadStoredConfigs());

  const apiKeyAvailable = hasGeminiApiKey();
  const disableInteractions = !apiKeyAvailable || status === 'loading';
  const videoRegistry = useMemo(() => buildVideoRegistry(videoConfigs), [videoConfigs]);

  const rootClassName = useMemo(
    () => `app-shell ${reducedMotion ? 'reduced-motion' : 'full-motion'}`,
    [reducedMotion]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videoConfigs));
  }, [videoConfigs]);

  const addVideoConfig = useCallback((entry: VideoConfig) => {
    setVideoConfigs((current) => {
      const existing = current.find((item) => item.code === entry.code);
      if (existing) {
        return current.map((item) => (item.code === entry.code ? entry : item));
      }
      return [...current, entry];
    });
  }, []);

  const removeVideoConfig = useCallback((code: string) => {
    setVideoConfigs((current) => current.filter((item) => item.code !== code));
  }, []);

  const sendPrompt = useCallback(
    async (rawValue: string) => {
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
    },
    [apiKeyAvailable, messages]
  );

  return (
    <main className={rootClassName}>
      <section className="crt-overlay" aria-hidden="true" />
      <header>
        <h1>Lilith OS v69 Modular</h1>
        <p>KAE · Guided Instruction Engine</p>
      </header>

      <VideoConfigPanel configs={videoConfigs} onAdd={addVideoConfig} onRemove={removeVideoConfig} />
      <JsonInstructionRunner videoRegistry={videoRegistry} />

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
