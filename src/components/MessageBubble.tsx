import { memo } from 'react';
import type { ConversationMessage } from '../types';
import { sanitizeHtml } from '../utils/sanitize';

type MessageBubbleProps = {
  message: ConversationMessage;
};

export const MessageBubble = memo(({ message }: MessageBubbleProps) => {
  const className = `message-bubble ${message.role}`;

  return (
    <article className={className}>
      <header>{message.role === 'user' ? 'Você' : 'KAE'}</header>
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(message.content) }} />
    </article>
  );
});

MessageBubble.displayName = 'MessageBubble';
