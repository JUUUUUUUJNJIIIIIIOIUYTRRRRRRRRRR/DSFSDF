import { Plus, Trash2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import type { VideoConfig } from '../types';
import { videoCodeSchema, videoUrlSchema } from '../utils/validation';

type VideoConfigPanelProps = {
  configs: VideoConfig[];
  onAdd: (entry: VideoConfig) => void;
  onRemove: (code: string) => void;
};

export const VideoConfigPanel = ({ configs, onAdd, onRemove }: VideoConfigPanelProps) => {
  const [code, setCode] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addConfig = (event: FormEvent) => {
    event.preventDefault();

    const parsedCode = videoCodeSchema.safeParse(code);
    if (!parsedCode.success) {
      setError(parsedCode.error.issues[0]?.message ?? 'Código inválido.');
      return;
    }

    const parsedUrl = videoUrlSchema.safeParse(url);
    if (!parsedUrl.success) {
      setError(parsedUrl.error.issues[0]?.message ?? 'URL inválida.');
      return;
    }

    onAdd({ code: parsedCode.data, url: parsedUrl.data });
    setCode('');
    setUrl('');
    setError(null);
  };

  return (
    <section className="panel">
      <h2>Configuração de vídeos</h2>
      <p>Cadastre um código para cada vídeo. O JSON vai usar esse código em `videoCode`.</p>

      <form className="video-config-form" onSubmit={addConfig}>
        <input
          type="text"
          placeholder="codigo_exemplo"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          aria-label="Código do vídeo"
        />
        <input
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          aria-label="URL do vídeo"
        />
        <button type="submit">
          <Plus size={16} aria-hidden="true" />
          Adicionar
        </button>
      </form>

      {error && <p className="status error">{error}</p>}

      <ul className="video-config-list">
        {configs.map((entry) => (
          <li key={entry.code}>
            <code>{entry.code}</code>
            <span>{entry.url}</span>
            <button type="button" onClick={() => onRemove(entry.code)} aria-label={`Remover ${entry.code}`}>
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
