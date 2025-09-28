import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4'
import { SiweMessage } from 'npm:siwe@^2.1.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, signature } = await req.json()
    if (!message || !signature) throw new Error('Message or signature not provided.')

    const siweMessage = new SiweMessage(message)
    const { data: fields } = await siweMessage.verify({ signature })

    const userWalletAddress = fields.address.toLowerCase()
    const userEmail = `${userWalletAddress}@wallet.com`
    const tempPassword = crypto.randomUUID() // Mot de passe sécurisé à usage unique

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Étape 1 : Trouver l'utilisateur ou le créer avec un mot de passe temporaire connu
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({ email: userEmail });
    if (listError) throw listError;

    if (users && users.length > 0) {
      console.log("✅ Utilisateur existant trouvé. Mise à jour du mot de passe temporaire.");
      // Mettre à jour le mot de passe pour pouvoir se connecter juste après
      await supabaseAdmin.auth.admin.updateUserById(users[0].id, { password: tempPassword });
    } else {
      console.log("🆕 Utilisateur non trouvé, création en cours...");
      const { error: creationError } = await supabaseAdmin.auth.admin.createUser({
        email: userEmail,
        password: tempPassword,
        user_metadata: { address: userWalletAddress },
        email_confirm: true, // L'utilisateur est déjà vérifié par son portefeuille
      });
      if (creationError) throw creationError;
      console.log("✅ Utilisateur créé.");
    }

    // Étape 2 : Utiliser le mot de passe temporaire pour se connecter et obtenir une session valide
    console.log("🔑 Connexion avec le mot de passe temporaire pour générer la session...");
    const { data: sessionData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: userEmail,
      password: tempPassword,
    });

    if (signInError) throw signInError;

    const { session } = sessionData;
    if (!session) throw new Error("La connexion n'a pas retourné de session valide.");

    console.log("🎉 Session générée avec succès !");

    // On renvoie l'objet session complet, que le client frontend saura gérer
    return new Response(
      JSON.stringify(session),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("❌ Erreur dans siwe-login:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});