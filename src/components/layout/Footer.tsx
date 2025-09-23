// src/components/layout/Footer.tsx

import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full py-4 px-8 bg-gray-100 mt-auto">
      <div className="container mx-auto text-center text-gray-500">
        <p>&copy; {currentYear} Tipso. Tous droits réservés.</p>
      </div>
    </footer>
  );
};