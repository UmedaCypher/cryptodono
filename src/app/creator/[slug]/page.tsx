// src/app/creator/[slug]/page.tsx

import React from 'react';

// Cette fonction permet à Next.js de récupérer le "slug" de l'URL
// Par exemple, si l'URL est /creator/vitalik, params.slug sera "vitalik"
type CreatorProfilePageProps = {
  params: {
    slug: string;
  };
};

export default function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Colonne de Gauche : Profil */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-32 h-32 rounded-full mx-auto bg-gray-200 mb-4">
            {/* Emplacement pour l'avatar */}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {/* On affiche le nom du créateur depuis l'URL pour l'instant */}
            {params.slug}
          </h2>
          <p className="text-gray-500 mt-2">
            0x1234...abcd
          </p>
          <p className="mt-4 text-gray-600">
            Ceci est la description de mon profil. Je crée du contenu incroyable
            sur le Web3. Soutenez-moi !
          </p>
        </div>
      </div>

      {/* Colonne de Droite : Section de Don */}
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Envoyer un don
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Montant (en ETH)
              </label>
              <input
                type="text"
                name="amount"
                id="amount"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.1"
              />
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
              Faire un don
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}