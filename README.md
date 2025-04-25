# Envieii - Sistema de Mensagens

Sistema de mensagens com WhatsApp e OpenAI, construído com Next.js 14.

## Funcionalidades

- Autenticação com Supabase
- Integração com WhatsApp
- Assistente OpenAI para respostas automáticas
- Dashboard para gerenciamento de mensagens
- Interface moderna e responsiva

## Requisitos

- Node.js 18+
- Conta no Supabase
- Chave de API do OpenAI
- Conta no WhatsApp

## Configuração

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/envieii.git
cd envieii
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
OPENAI_API_KEY=sua_chave_da_api_openai
```

4. Configure o banco de dados no Supabase:
Execute os seguintes comandos SQL no editor SQL do Supabase:

```sql
-- Tabela de usuários
create table public.users (
  id uuid references auth.users on delete cascade,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Tabela de sessões do WhatsApp
create table public.whatsapp_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade,
  qr_code text,
  status text check (status in ('pending', 'connected', 'disconnected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de mensagens
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade,
  whatsapp_session_id uuid references public.whatsapp_sessions on delete cascade,
  content text,
  direction text check (direction in ('incoming', 'outgoing')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de assistentes
create table public.assistants (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade,
  name text,
  openai_assistant_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Políticas de segurança
alter table public.users enable row level security;
alter table public.whatsapp_sessions enable row level security;
alter table public.messages enable row level security;
alter table public.assistants enable row level security;

create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can view their own sessions" on public.whatsapp_sessions
  for select using (auth.uid() = user_id);

create policy "Users can view their own messages" on public.messages
  for select using (auth.uid() = user_id);

create policy "Users can view their own assistants" on public.assistants
  for select using (auth.uid() = user_id);
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse http://localhost:3000 no seu navegador.

## Estrutura do Projeto

```
envieii/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── messages/
│   │   ├── settings/
│   │   └── whatsapp/
│   ├── api/
│   │   ├── auth/
│   │   ├── whatsapp/
│   │   └── openai/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── forms/
│   └── shared/
├── lib/
│   ├── supabase/
│   ├── whatsapp/
│   └── openai/
├── types/
└── public/
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
