import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const useSupabase = () => {
  const supabase = createClientComponentClient()
  return { supabase }
}