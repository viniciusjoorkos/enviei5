import { Inter } from 'next/font/google';
import { Session } from '@supabase/supabase-js';
import { AuthProvider as SupabaseAuthProvider } from '@/contexts/AuthContext';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import './globals.css';

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
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Erro ao buscar sessão:', error.message);
    }

    return (
      <html lang="pt-BR">
        <body className={inter.className}>
          <SupabaseAuthProvider initialSession={session}>
            {children}
          </SupabaseAuthProvider>
        </body>
      </html>
    );
  } catch (error) {
    console.error('Erro ao inicializar Supabase:', error);
    
    return (
      <html lang="pt-BR">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    );
  }
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialSession: Session | null;
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  // ... resto do código
}