'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Bem-vindo, {user?.email}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-indigo-900 mb-2">
            Status do WhatsApp
          </h2>
          <p className="text-indigo-700">
            Conecte seu WhatsApp para começar a enviar mensagens
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-green-900 mb-2">
            Assistente OpenAI
          </h2>
          <p className="text-green-700">
            Configure seu assistente para respostas automáticas
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-purple-900 mb-2">
            Mensagens
          </h2>
          <p className="text-purple-700">
            Visualize e gerencie suas mensagens
          </p>
        </div>
      </div>
    </div>
  );
} 