import { createClient } from '@supabase/supabase-js'

// Usamos import.meta.env para que Vite detecte las variables de Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación simple para que sepas si las claves están llegando bien
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: No se encontraron las variables de entorno de Supabase.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)