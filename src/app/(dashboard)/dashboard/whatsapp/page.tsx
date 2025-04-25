'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { WhatsAppSession } from '@/lib/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

export default function WhatsAppPage() {
  const { user } = useAuth();
  const [session, setSession] = useState<WhatsAppSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSession();
    }
  }, [user]);

  const fetchSession = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setSession(data);
    } catch (err) {
      setError('Erro ao carregar sessão do WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_sessions')
        .insert([
          {
            user_id: user?.id,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setSession(data);
    } catch (err) {
      setError('Erro ao iniciar sessão do WhatsApp');
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
        Configuração do WhatsApp
      </h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {!session ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Conecte seu WhatsApp para começar a enviar mensagens
          </p>
          <button
            onClick={startSession}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Conectando...' : 'Conectar WhatsApp'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Status: {session.status}
              </h2>
              <p className="text-sm text-gray-500">
                Última atualização: {new Date(session.updated_at).toLocaleString()}
              </p>
            </div>
            {session.status === 'pending' && (
              <div className="text-center">
                <img
                  src={session.qr_code}
                  alt="QR Code WhatsApp"
                  className="w-48 h-48 mx-auto mb-4"
                />
                <p className="text-sm text-gray-600">
                  Escaneie o QR Code com seu WhatsApp
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 