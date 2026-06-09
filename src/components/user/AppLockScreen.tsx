'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores';

const PIN_LENGTH = 4;

export default function AppLockScreen() {
  const { unlockApp, isAppLocked } = useAuthStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const handleNumber = useCallback(
    (num: string) => {
      if (pin.length >= PIN_LENGTH) return;
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === PIN_LENGTH) {
        // Attempt unlock
        setTimeout(() => {
          unlockApp(newPin);
          // If still locked after attempt, show error
          if (useAuthStore.getState().isAppLocked) {
            setError(true);
            setShakeKey((k) => k + 1);
            setTimeout(() => setPin(''), 300);
          }
        }, 200);
      }
    },
    [pin, unlockApp]
  );

  const handleBackspace = useCallback(() => {
    setPin((p) => p.slice(0, -1));
    setError(false);
  }, []);

  if (!isAppLocked) return null;

  const numberPad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '⌫'],
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-6"
    >
      {/* Lock Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="mb-6"
      >
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-10 w-10 text-primary" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-foreground mb-2"
      >
        Zaxo is locked
      </motion.h1>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-sm text-muted-foreground mb-8"
      >
        Enter your PIN to unlock
      </motion.p>

      {/* PIN Circles */}
      <motion.div
        key={shakeKey}
        animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex gap-4 mb-8"
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full transition-colors duration-150 ${
              i < pin.length
                ? error
                  ? 'bg-destructive'
                  : 'bg-primary'
                : 'bg-muted-foreground/20 border-2 border-muted-foreground/30'
            }`}
          />
        ))}
      </motion.div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] mb-6">
        {numberPad.flat().map((key, idx) => {
          if (key === '') {
            return <div key={`empty-${idx}`} />;
          }
          if (key === '⌫') {
            return (
              <Button
                key="backspace"
                variant="ghost"
                className="h-16 text-lg font-medium rounded-full hover:bg-muted/50"
                onClick={handleBackspace}
              >
                ⌫
              </Button>
            );
          }
          return (
            <Button
              key={key}
              variant="ghost"
              className="h-16 text-xl font-semibold rounded-full hover:bg-muted/50 active:bg-muted"
              onClick={() => handleNumber(key)}
            >
              {key}
            </Button>
          );
        })}
      </div>

      {/* Forgot PIN */}
      <Button variant="link" className="text-sm text-muted-foreground mb-4">
        Forgot PIN?
      </Button>

      {/* Biometric Option */}
      <Button
        variant="outline"
        className="gap-2 rounded-xl border-primary/30 text-primary hover:bg-primary/5"
        onClick={() => {
          // Simulate biometric unlock
          unlockApp('');
        }}
      >
        <Fingerprint className="h-5 w-5" />
        Use Fingerprint
      </Button>
    </motion.div>
  );
}
