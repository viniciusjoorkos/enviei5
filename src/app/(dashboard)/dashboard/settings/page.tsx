'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Assistant } from '@/lib/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const assistantSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  openai_assistant_id: z.string().min(1, 'ID do assistente é obrigatório'),
});

type AssistantFormData = z.infer<typeof assistantSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AssistantFormData>({
    resolver: zodResolver(assistantSchema),
  });

  useEffect(() => {
    if (user) {
      fetchAssistant();
    }
  }, [user]);

  const fetchAssistant = async () => {
    try {
      const { data, error } = await supabase
        .from('assistants')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setAssistant(data);
      if (data) {
        reset({
          name: data.name,
          openai_assistant_id: data.openai_assistant_id,
        });
      }
    } catch (err) {
      setError('Erro ao carregar configurações do assistente');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AssistantFormData) => {
    try {
      setLoading(true);
      if (assistant) {
        const { error } = await supabase
          .from('assistants')
          .update(data)
          .eq('id', assistant.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('assistants')
          .insert([{ ...data, user_id: user?.id }]);

        if (error) throw error;
      }
      setSuccess('Configurações salvas com sucesso');
      fetchAssistant();
    } catch (err) {
      setError('Erro ao salvar configurações');
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
        Configurações
      </h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome do Assistente
          </label>
          <input
            {...register('name')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="openai_assistant_id"
            className="block text-sm font-medium text-gray-700"
          >
            ID do Assistente OpenAI
          </label>
          <input
            {...register('openai_assistant_id')}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.openai_assistant_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.openai_assistant_id.message}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
} 