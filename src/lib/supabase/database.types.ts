export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          direction: 'incoming' | 'outgoing';
          created_at: string;
        };
        Insert: {
          user_id: string;
          content: string;
          direction: 'incoming' | 'outgoing';
          created_at?: string;
        };
        Update: {
          content?: string;
          direction?: 'incoming' | 'outgoing';
        };
      };
      whatsapp_sessions: {
        Row: {
          id: string;
          user_id: string;
          qr_code: string | null;
          status: 'pending' | 'connected' | 'disconnected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          qr_code?: string | null;
          status: 'pending' | 'connected' | 'disconnected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          qr_code?: string | null;
          status?: 'pending' | 'connected' | 'disconnected';
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}; 