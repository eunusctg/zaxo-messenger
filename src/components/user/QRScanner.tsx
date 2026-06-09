'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Zap,
  Camera,
  Phone,
  Video,
  MessageCircle,
  UserPlus,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface ScanResult {
  name: string;
  zaxoNumber: string;
}

export default function QRScanner() {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  // Simulated scanning progress - auto-detect after a few seconds
  useEffect(() => {
    if (!scanning) return;

    const progressInterval = setInterval(() => {
      setSimulatedProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 0.5;
      });
    }, 50);

    // Simulate finding a QR code after ~4 seconds
    const detectTimeout = setTimeout(() => {
      setScanning(false);
      setScanResult({
        name: 'Sarah Chen',
        zaxoNumber: '291-834-567',
      });
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(detectTimeout);
    };
  }, [scanning]);

  const handleCloseResult = useCallback(() => {
    setScanResult(null);
    setScanning(true);
    setSimulatedProgress(0);
  }, []);

  const handleAction = useCallback((action: string) => {
    // In a real app, these would navigate or trigger actions
    console.log('QR Scanner action:', action);
    handleCloseResult();
  }, [handleCloseResult]);

  return (
    <div className="flex h-full flex-col bg-background relative min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 z-10">
        <h1 className="text-xl font-bold">Scan QR Code</h1>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => {
            setScanning(true);
            setSimulatedProgress(0);
            setScanResult(null);
          }}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Scanner area */}
      <div className="flex-1 relative bg-zinc-900 overflow-hidden">
        {/* Dark camera preview area */}
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          {/* Simulated camera grain */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
              }}
            />
          </div>

          {/* Scanner frame */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            {/* Corner guides - top-left */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-primary rounded-tl-sm" />
            {/* Top-right */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-primary rounded-tr-sm" />
            {/* Bottom-left */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-primary rounded-bl-sm" />
            {/* Bottom-right */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-primary rounded-br-sm" />

            {/* Scanning line */}
            {scanning && (
              <motion.div
                className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                animate={{ top: ['0%', '100%'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatType: 'reverse',
                }}
              />
            )}

            {/* Semi-transparent overlay outside the frame */}
            <div className="absolute inset-0 border-2 border-white/5 rounded-sm" />
          </div>
        </div>

        {/* Instruction text */}
        <div className="absolute bottom-8 left-0 right-0 text-center z-10">
          <p className="text-white/70 text-sm">
            {scanning ? 'Scan a Zaxo QR Code' : 'QR Code detected!'}
          </p>
          {scanning && simulatedProgress > 20 && (
            <p className="text-white/40 text-xs mt-1">
              Align the QR code within the frame
            </p>
          )}
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center gap-6 z-10">
          {/* Flashlight toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-12 w-12 rounded-full ${
              flashlightOn ? 'bg-white text-yellow-500' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            onClick={() => setFlashlightOn(!flashlightOn)}
          >
            <Zap className="h-5 w-5" />
          </Button>

          {/* Gallery import */}
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Scan Result Modal */}
      <Dialog open={!!scanResult} onOpenChange={(open) => !open && handleCloseResult()}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <DialogTitle className="sr-only">QR Code Scan Result</DialogTitle>
          <div className="p-6 flex flex-col items-center">
            <h3 className="font-semibold text-lg mb-4">Contact Found</h3>

            {/* Contact info */}
            <Avatar className="h-16 w-16 mb-3">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {scanResult?.name?.split(' ').map((n) => n[0]).join('') || 'SC'}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold text-base">{scanResult?.name}</p>
            <p className="text-sm text-primary font-mono font-semibold mt-0.5">
              {scanResult?.zaxoNumber}
            </p>

            <Separator className="my-4" />

            {/* Action buttons */}
            <div className="w-full space-y-2">
              <Button
                onClick={() => handleAction('add-contact')}
                className="w-full justify-start rounded-xl h-11"
                variant="outline"
              >
                <UserPlus className="h-4 w-4 mr-3 text-primary" />
                Add Contact
              </Button>
              <Button
                onClick={() => handleAction('start-chat')}
                className="w-full justify-start rounded-xl h-11"
                variant="outline"
              >
                <MessageCircle className="h-4 w-4 mr-3 text-primary" />
                Start Chat
              </Button>
              <Button
                onClick={() => handleAction('audio-call')}
                className="w-full justify-start rounded-xl h-11"
                variant="outline"
              >
                <Phone className="h-4 w-4 mr-3 text-primary" />
                Audio Call
              </Button>
              <Button
                onClick={() => handleAction('video-call')}
                className="w-full justify-start rounded-xl h-11"
                variant="outline"
              >
                <Video className="h-4 w-4 mr-3 text-primary" />
                Video Call
              </Button>
            </div>

            <Button
              onClick={handleCloseResult}
              variant="ghost"
              className="mt-4 rounded-full text-muted-foreground"
            >
              Scan Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
