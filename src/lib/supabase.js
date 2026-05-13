import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kksqvgawqpsrheikuewx.supabase.co'
const supabaseAnonKey = 'sb_publishable_-U9oZnR7rYVaxF-sXe-iGg_h2LP4xIR'

// Esto nos dirá en la consola qué está pasando exactamente
console.log("Configuración detectada:", { 
  hayUrl: !!supabaseUrl, 
  hayKey: !!supabaseAnonKey 
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Las variables de entorno no están configuradas en Vercel.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)