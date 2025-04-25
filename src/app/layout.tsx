import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import './globals.css';
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Envieii - Sistema de Mensagens',
  description: 'Sistema de mensagens com WhatsApp e OpenAI',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}