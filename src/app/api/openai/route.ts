import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { user_id, message } = await request.json();

    // Buscar o assistente configurado para o usuário
    const { data: assistant, error: assistantError } = await supabase
      .from('assistants')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (assistantError) {
      return NextResponse.json(
        { error: 'Assistente não configurado' },
        { status: 400 }
      );
    }

    // Criar uma thread para a conversa
    const thread = await openai.beta.threads.create();

    // Adicionar a mensagem à thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    });

    // Executar o assistente
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.openai_assistant_id,
    });

    // Aguardar a conclusão da execução
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Buscar a resposta
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data[0];

    // Salvar a mensagem no banco de dados
    const { error: messageError } = await supabase.from('messages').insert([
      {
        user_id,
        content: message,
        direction: 'outgoing',
      },
      {
        user_id,
        content: assistantMessage.content[0].text.value,
        direction: 'incoming',
      },
    ]);

    if (messageError) throw messageError;

    return NextResponse.json({
      response: assistantMessage.content[0].text.value,
    });
  } catch (error) {
    console.error('Error in OpenAI API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 