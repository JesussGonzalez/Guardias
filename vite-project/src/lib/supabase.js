import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kksqvgawqpsrheikuewx.supabase.co'
const supabaseAnonKey = 'sb_publishable_-U9oZnR7rYVaxF-sXe-iGg_h2LP4xIR'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)