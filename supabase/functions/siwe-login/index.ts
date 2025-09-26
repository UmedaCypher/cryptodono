// supabase/functions/siwe-login/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4'
import { SiweMessage } from 'npm:siwe@^2.1.4'

// Fonction pour gérer les requêtes CORS (sécurité inter-domaines)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gérer la requête pre-flight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, signature } = await req.json()
    const siweMessage = new SiweMessage(message)

    // Étape 1: Vérifier la signature du message. C'est la preuve cryptographique.
    const { data: fields, error } = await siweMessage.verify({ signature })
    if (error) throw new Error(`Signature verification failed: ${error.message}`)

    // Étape 2: Si la signature est valide, créer un client Supabase "Admin".
    // Ce client a les droits pour créer des utilisateurs, ce que le client public ne peut pas faire.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Étape 3: Chercher ou créer l'utilisateur dans Supabase Auth.
    // On utilise l'adresse du portefeuille comme identifiant.
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getOrCreateUser({
       address: fields.address,
    })
    if (userError) throw userError

    // Étape 4: Générer un token de session (JWT) pour cet utilisateur.
    const { data: { session }, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
      email: user.email, // L'email est fictif ici, Supabase le gère en interne
      password: "password" // Le mot de passe est fictif, l'authentification est basée sur la signature
    })

    if (sessionError) throw sessionError

    // Étape 5: Renvoyer la session au client.
    return new Response(
      JSON.stringify(session),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})