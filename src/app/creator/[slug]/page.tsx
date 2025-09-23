// src/app/creator/[slug]/page.tsx

import React from 'react';
import { CreatorProfileCard } from '@/components/features/CreatorProfileCard';
import { DonationCard } from '@/components/features/DonationCard';
import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';

type CreatorProfilePageProps = {
  params: {
    slug: string;
  };
};

export default async function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  
  console.log("--- Début du rendu de la page pour le slug:", params.slug);

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.slug)
    .single();

  // On regarde ce que Supabase nous a VRAIMENT renvoyé
  console.log("Résultat de Supabase - Profile:", profile);
  console.log("Résultat de Supabase - Erreur:", error);

  if (error && error.code !== 'PGRST116') {
    // PGRST116 est l'erreur "aucune ligne trouvée", ce qui est normal si le profil n'existe pas.
    // On logue toutes les autres erreurs.
    console.error("Erreur inattendue de Supabase:", error);
  }

  if (!profile) {
    console.log("Aucun profil trouvé, déclenchement de la page 404.");
    notFound();
  }

  console.log("Profil trouvé, affichage de la page pour:", profile.username);

  return (
    // ... le reste de votre code JSX reste inchangé
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <CreatorProfileCard 
          name={profile.username} 
          walletAddress={profile.wallet_address}
          description={profile.description || "Aucune description fournie."}
        />
      </div>
      <div className="md:col-span-2">
        <DonationCard />
      </div>
    </div>
  );
}