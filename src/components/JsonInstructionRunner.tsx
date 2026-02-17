import { useMemo, useState } from 'react';
import type { JsonInstructionPayload } from '../types';
import { jsonInstructionSchema } from '../utils/validation';

type JsonInstructionRunnerProps = {
  videoRegistry: Record<string, string>;
};

const EXAMPLE_JSON = `{
  "title": "Fluxo de Onboarding",
  "items": [
    {
      "id": "step-1",
      "title": "Introdução",
      "description": "Veja o vídeo de boas-vindas.",
      "videoCode": "intro_001"
    }
  ]
}`;

export const JsonInstructionRunner = ({ videoRegistry }: JsonInstructionRunnerProps) => {
  const [jsonInput, setJsonInput] = useState(EXAMPLE_JSON);
  const [parsedPayload, setParsedPayload] = useState<JsonInstructionPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runJson = () => {
    try {
      const raw = JSON.parse(jsonInput) as unknown;
      const parsed = jsonInstructionSchema.safeParse(raw);

      if (!parsed.success) {
        setParsedPayload(null);
        setError(parsed.error.issues[0]?.message ?? 'JSON inválido.');
        return;
      }

      setParsedPayload(parsed.data);
      setError(null);
    } catch {
      setParsedPayload(null);
      setError('Não foi possível fazer parse do JSON. Verifique vírgulas, aspas e chaves.');
    }
  };

  const unresolvedCodes = useMemo(() => {
    if (!parsedPayload) {
      return [];
    }

    return parsedPayload.items
      .filter((item) => item.videoCode && !videoRegistry[item.videoCode])
      .map((item) => item.videoCode as string);
  }, [parsedPayload, videoRegistry]);

  return (
    <section className="panel">
      <h2>Executor de JSON</h2>
      <p>Cole um JSON com `items[].videoCode`. Cada código busca URL na configuração acima.</p>

      <textarea
        value={jsonInput}
        onChange={(event) => setJsonInput(event.target.value)}
        rows={12}
        aria-label="JSON de instruções"
      />

      <button type="button" onClick={runJson}>
        Processar JSON
      </button>

      {error && <p className="status error">{error}</p>}

      {unresolvedCodes.length > 0 && (
        <p className="status warning">
          Códigos sem configuração: {Array.from(new Set(unresolvedCodes)).join(', ')}
        </p>
      )}

      {parsedPayload && (
        <div className="json-render">
          {parsedPayload.title && <h3>{parsedPayload.title}</h3>}
          {parsedPayload.items.map((item) => {
            const embedUrl = item.videoCode ? videoRegistry[item.videoCode] : undefined;

            return (
              <article key={item.id} className="instruction-card">
                <h4>{item.title}</h4>
                {item.description && <p>{item.description}</p>}
                {item.videoCode && <p className="video-code">videoCode: {item.videoCode}</p>}
                {embedUrl && (
                  <div className="iframe-wrap">
                    <iframe
                      src={embedUrl}
                      title={`Vídeo ${item.videoCode}`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
