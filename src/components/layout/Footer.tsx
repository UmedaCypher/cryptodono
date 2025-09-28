// src/components/layout/Footer.tsx

import React from 'react';

export const Footer = () => {
  return (
    // Le footer reste en bas grâce à la structure flex du layout
    <footer className="w-full py-4 px-8 mt-auto bg-black/30 border-t border-white/10">
      <div className="container mx-auto text-center text-gray-400 text-sm">
        <p>© 2025 Tipso. Tous droits réservés.</p>
      </div>
    </footer>
  );
};