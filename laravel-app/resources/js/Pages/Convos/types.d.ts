export type Convo = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
  updated_at: string;
};