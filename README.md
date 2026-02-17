# KAE · Lilith OS v69 Modular

App Vite + React + TypeScript para instrução guiada com estética glass/glitch/CRT.

## Configuração

1. Instale dependências:
   ```bash
   npm install
   ```
2. Crie `.env.local`:
   ```bash
   VITE_GEMINI_API_KEY=sua_chave
   ```
   Compatibilidade legada: `GEMINI_API_KEY` também é lida se `VITE_GEMINI_API_KEY` não existir.
3. Rode em desenvolvimento:
   ```bash
   npm run dev
   ```
4. Build de produção:
   ```bash
   npm run build
   ```

## JSON com vídeos por código

A tela possui uma seção **Configuração de vídeos**:
- você cadastra `code` + `url` (YouTube/Vimeo/link embedável).
- depois usa esse código no JSON em `items[].videoCode`.

Exemplo:

```json
{
  "title": "Treinamento",
  "items": [
    {
      "id": "intro",
      "title": "Introdução",
      "description": "Assista ao vídeo de abertura.",
      "videoCode": "intro_001"
    }
  ]
}
```

Quando o JSON é processado, cada `videoCode` é resolvido para um `<iframe>` com base na configuração salva localmente.
