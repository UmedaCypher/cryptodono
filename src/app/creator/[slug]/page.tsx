// src/app/creator/[slug]/page.tsx

import React from 'react';
import { CreatorProfileCard } from '@/components/features/CreatorProfileCard';
import { DonationCard } from '@/components/features/DonationCard';

type CreatorProfilePageProps = {
  params: {
    slug: string;
  };
};

// Données factices en attendant la base de données
const MOCK_CREATOR_DATA = {
  walletAddress: "0x1234567890AbCdEf1234567890AbCdEf12345678",
  description: "Ceci est la description de mon profil. Je crée du contenu incroyable sur le Web3. Soutenez-moi !",
};

export default function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <CreatorProfileCard 
          name={params.slug} 
          walletAddress={MOCK_CREATOR_DATA.walletAddress}
          description={MOCK_CREATOR_DATA.description}
        />
      </div>
      <div className="md:col-span-2">
        <DonationCard />
      </div>
    </div>
  );
}