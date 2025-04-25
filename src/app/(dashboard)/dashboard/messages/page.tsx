'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Message } from '@/lib/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
      const subscription = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setMessages((current) => [payload.new as Message, ...current]);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data);
    } catch (err) {
      setError('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Mensagens
      </h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhuma mensagem encontrada
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.direction === 'incoming'
                  ? 'bg-gray-50'
                  : 'bg-indigo-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    {message.direction === 'incoming' ? 'Recebida' : 'Enviada'}
                  </p>
                  <p className="mt-1 text-gray-900">{message.content}</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 