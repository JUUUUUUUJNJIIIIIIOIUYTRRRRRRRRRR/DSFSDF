export type ConversationMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export type VideoConfig = {
  code: string;
  url: string;
};

export type JsonInstructionItem = {
  id: string;
  title: string;
  description?: string;
  videoCode?: string;
};

export type JsonInstructionPayload = {
  title?: string;
  items: JsonInstructionItem[];
};
