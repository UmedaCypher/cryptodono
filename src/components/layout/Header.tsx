// src/components/layout/Header.tsx

import React from 'react';
import { ConnectButton } from '../ui/ConnectButton'; // <-- Importer le nouveau bouton

export const Header = () => {
  return (
    <header className="w-full py-4 px-8 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Tipso - crypto dono
        </h1>
        <div>
          <ConnectButton /> {/* <-- Utiliser le composant ici */}
        </div>
      </div>
    </header>
  );
};