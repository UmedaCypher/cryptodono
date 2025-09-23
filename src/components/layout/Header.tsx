// src/components/layout/Header.tsx

import React from 'react';

export const Header = () => {
  return (
    <header className="w-full py-4 px-8 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Tipso
        </h1>
        <div>
          {/* TODO: Ici viendra notre bouton de connexion de portefeuille */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Connecter
          </button>
        </div>
      </div>
    </header>
  );
};