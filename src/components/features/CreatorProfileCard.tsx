// src/components/features/CreatorProfileCard.tsx

import React from 'react';

// On définit les "props" que ce composant attend.
// C'est comme un contrat : pour utiliser cette carte, vous devez fournir ces informations.
type CreatorProfileCardProps = {
  name: string;
  walletAddress: string;
  description: string;
  // On ajoutera l'URL de l'avatar plus tard
};

export const CreatorProfileCard = ({ name, walletAddress, description }: CreatorProfileCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="w-32 h-32 rounded-full mx-auto bg-gray-200 mb-4">
        {/* Emplacement pour l'avatar */}
      </div>
      <h2 className="text-2xl font-bold text-gray-800">
        {name}
      </h2>
      <p className="text-gray-500 mt-2 break-all">
        {walletAddress}
      </p>
      <p className="mt-4 text-gray-600">
        {description}
      </p>
    </div>
  );
};