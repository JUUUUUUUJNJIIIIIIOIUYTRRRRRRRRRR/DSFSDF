import type { RequestStatus } from '../types';

type StatusBannerProps = {
  status: RequestStatus;
  error: string | null;
  hasApiKey: boolean;
};

export const StatusBanner = ({ status, error, hasApiKey }: StatusBannerProps) => {
  if (!hasApiKey) {
    return <p className="status warning">Configuração faltando: defina VITE_GEMINI_API_KEY no .env.local.</p>;
  }

  if (status === 'loading') {
    return <p className="status loading">Processando instrução...</p>;
  }

  if (status === 'error' && error) {
    return <p className="status error">Falha na requisição: {error}</p>;
  }

  return null;
};
