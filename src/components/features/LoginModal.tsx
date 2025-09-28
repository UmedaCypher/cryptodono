// src/components/features/LoginModal.tsx
'use client'

import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { SiweMessage } from 'siwe';
import { supabase } from '@/lib/supabaseClient';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { address, chainId, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const [step, setStep] = useState(1);

  // Surveille la connexion pour passer à l'étape 2
  useEffect(() => {
    if (isOpen && isConnected && step === 1) {
      console.log("🟢 Wallet connecté, passage à l'étape 2 (signature).");
      setStep(2);
    }
    if (isOpen && !isConnected) {
      setStep(1);
    }
  }, [isOpen, isConnected, step]);

  const handleSignIn = async () => {
    try {
      if (!address || !chainId) return;

      console.log("🔑 Étape 2 : début du sign-in");

      const nonce = (Math.random() + 1).toString(36).substring(2);
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Signez ce message pour vous authentifier sur Tipso. C\'est gratuit.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
        issuedAt: new Date().toISOString(),
      });

      console.log("📝 Message SIWE préparé :", message);

      const signature = await signMessageAsync({ message: message.prepareMessage() });
      console.log("✍️ Signature obtenue :", signature);

      const supabaseFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/functions/v1/siwe-login`;
      console.log("🌐 Appel de la fonction edge :", supabaseFunctionUrl);

      const response = await fetch(supabaseFunctionUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
  }, // <--- LA VIRGULE MANQUANTE VA ICI
  body: JSON.stringify({ message, signature }),
});

      console.log("📡 Réponse brute de la fonction :", response);

      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Erreur de la fonction :", errText);
        throw new Error(errText);
      }

      const session = await response.json();
      console.log("✅ Session reçue :", session);

      await supabase.auth.setSession(session);

      onClose();
    } catch (error) {
      console.error('❌ Erreur lors du Sign-In (frontend):', error);
      // Réinitialiser à l'étape 1 en cas d'erreur de signature ou de réseau
      setStep(1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setStep(1);
        onClose();
      }}
      title="Connexion Web3"
    >
      {step === 1 && (
        <div>
          <h3 className="font-semibold">Étape 1 sur 2 : Connexion du portefeuille</h3>
          <p className="text-sm text-gray-600 mt-2 mb-4">
            Veuillez autoriser l'application à se connecter à votre portefeuille.
          </p>
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isConnecting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {isConnecting ? 'Veuillez vérifier votre portefeuille...' : 'Connecter le portefeuille'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="font-semibold">Étape 2 sur 2 : Vérification de propriété</h3>
          <p className="text-sm text-gray-600 mt-2 mb-4">
            Pour finaliser, veuillez signer ce message. Cette action est gratuite et prouve que vous êtes bien le propriétaire de ce portefeuille.
          </p>
          <button
            onClick={handleSignIn}
            disabled={isSigning}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {isSigning ? 'Veuillez vérifier votre portefeuille...' : 'Signer le message'}
          </button>
        </div>
      )}
    </Modal>
  );
};