import { Send } from 'lucide-react';
import { type FormEvent, useState } from 'react';

type ComposerProps = {
  disabled: boolean;
  onSend: (value: string) => Promise<void>;
};

export const Composer = ({ disabled, onSend }: ComposerProps) => {
  const [value, setValue] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onSend(value);
    setValue('');
  };

  return (
    <form className="composer" onSubmit={submit}>
      <label htmlFor="prompt" className="sr-only">
        Digite sua instrução
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Descreva o que você quer construir..."
        rows={4}
        maxLength={1200}
        required
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        <Send size={16} aria-hidden="true" />
        Enviar
      </button>
    </form>
  );
};
