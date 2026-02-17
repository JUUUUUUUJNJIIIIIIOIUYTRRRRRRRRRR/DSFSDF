export type ConversationMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
