// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// ✅ CORRECTION : Utilisation des variables d'environnement renommées pour plus de clarté
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_DB!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Créer et exporter le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)