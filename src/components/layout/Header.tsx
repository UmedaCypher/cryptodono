// src/components/layout/Header.tsx

import React from 'react';
import { ConnectButton } from '../ui/ConnectButton';

export const Header = () => {
  return (
    // --- MODIFICATION DU DESIGN ---
    // Header "flottant" avec effet Glassmorphism
    // Il reste en haut de la page lors du défilement (sticky)
    <header className="sticky top-0 z-50 w-full py-4 px-8 bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Texte plus lumineux pour le contraste */}
        <h1 className="text-2xl font-bold text-white">
          Tipso
        </h1>
        <div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};