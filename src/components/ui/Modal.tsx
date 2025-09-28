// src/components/ui/Modal.tsx
'use client'
import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  // Si la modale n'est pas ouverte, on n'affiche rien.
  if (!isOpen) return null;

  return (
    // --- Conteneur Principal (Superposition) ---
    // Cette partie est la clé du centrage.
    // Elle prend tout l'écran (fixed inset-0) et utilise Flexbox
    // pour centrer son contenu (flex items-center justify-center).
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm h-dvh"
      onClick={onClose} // Permet de fermer en cliquant sur le fond.
    >
      {/* --- Carte de la Modale --- */}
      {/* C'est l'élément qui est centré par son parent. */}
      <div
        className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 w-full max-w-md relative border border-white/20"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique à l'intérieur.
      >
        {/* Bouton de fermeture (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Titre de la modale */}
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        
        {/* Contenu (vos étapes de connexion) */}
        <div>{children}</div>
      </div>
    </div>
  );
};