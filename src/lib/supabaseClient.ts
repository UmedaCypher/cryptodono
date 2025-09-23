// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// Récupérer les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Créer et exporter le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)