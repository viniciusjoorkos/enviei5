import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { user_id } = await request.json();

    // Verificar se já existe uma sessão ativa
    const { data: existingSession } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'connected')
      .single();

    if (existingSession) {
      return NextResponse.json({
        status: 'connected',
        session: existingSession,
      });
    }

    // Criar nova sessão
    const { data: session, error } = await supabase
      .from('whatsapp_sessions')
      .insert([
        {
          user_id,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Aqui você pode adicionar a lógica para gerar o QR Code
    // Por exemplo, usando a biblioteca qrcode
    const qrCode = 'data:image/png;base64,...'; // Substitua pelo QR Code real

    // Atualizar a sessão com o QR Code
    const { error: updateError } = await supabase
      .from('whatsapp_sessions')
      .update({ qr_code: qrCode })
      .eq('id', session.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      status: 'pending',
      session: { ...session, qr_code: qrCode },
    });
  } catch (error) {
    console.error('Error in WhatsApp API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data: session, error } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (error) throw error;

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error in WhatsApp API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 