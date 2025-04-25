export type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type WhatsAppSession = {
  id: string;
  user_id: string;
  qr_code: string;
  status: 'pending' | 'connected' | 'disconnected';
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  user_id: string;
  whatsapp_session_id: string;
  content: string;
  direction: 'incoming' | 'outgoing';
  created_at: string;
};

export type Assistant = {
  id: string;
  user_id: string;
  name: string;
  openai_assistant_id: string;
  created_at: string;
  updated_at: string;
}; 