'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  Download,
  Copy,
  QrCode,
  Check,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/stores';
import QRCode from 'qrcode';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function QRCodeView() {
  const { currentUser } = useAuthStore();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  const qrContent = currentUser
    ? `zaxo://user/${currentUser.zaxoNumber}`
    : 'zaxo://user/unknown';

  // Generate QR code
  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsGenerating(true);
        const url = await QRCode.toDataURL(qrContent, {
          width: 512,
          margin: 2,
          color: {
            dark: '#0d9488', // teal-600 - primary-ish
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('QR generation failed:', err);
      } finally {
        setIsGenerating(false);
      }
    };
    generateQR();
  }, [qrContent]);

  const handleCopyNumber = useCallback(async () => {
    if (!currentUser) return;
    try {
      await navigator.clipboard.writeText(currentUser.zaxoNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [currentUser]);

  const handleShare = useCallback(() => {
    if (navigator.share && currentUser) {
      navigator.share({
        title: 'My Zaxo QR Code',
        text: `Add me on Zaxo! My number: ${currentUser.zaxoNumber}`,
        url: qrContent,
      }).catch(() => {});
    }
  }, [currentUser, qrContent]);

  const handleSaveToGallery = useCallback(() => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `zaxo-qr-${currentUser?.zaxoNumber || 'code'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrDataUrl, currentUser]);

  if (!currentUser) return null;

  return (
    <div className="flex h-full flex-col bg-background min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">QR Code</h1>
      </div>

      {/* QR Code Card */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <div
            className="bg-card rounded-2xl border shadow-lg p-6 flex flex-col items-center cursor-pointer"
            onClick={() => setIsEnlarged(true)}
          >
            {/* User info */}
            <Avatar className="h-16 w-16 mb-3">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {getInitials(currentUser.displayName)}
              </AvatarFallback>
            </Avatar>

            <h2 className="font-semibold text-base">{currentUser.displayName}</h2>

            {/* Zaxo number */}
            <div className="flex items-center gap-2 mt-1 mb-5">
              <span className="text-sm text-primary font-mono font-semibold">
                {currentUser.zaxoNumber}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyNumber();
                }}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* QR Code */}
            <div className="relative bg-white rounded-xl p-4 shadow-inner">
              {isGenerating ? (
                <div className="h-52 w-52 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <QrCode className="h-12 w-12 text-muted-foreground animate-pulse" />
                    <span className="text-xs text-muted-foreground">Generating...</span>
                  </div>
                </div>
              ) : (
                <img
                  src={qrDataUrl}
                  alt="Zaxo QR Code"
                  className="h-52 w-52 object-contain"
                />
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Tap to enlarge
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1 rounded-xl h-11"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={handleSaveToGallery}
              variant="outline"
              className="flex-1 rounded-xl h-11"
            >
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Enlarged QR Dialog */}
      <Dialog open={isEnlarged} onOpenChange={setIsEnlarged}>
        <DialogContent className="max-w-sm p-0 overflow-hidden bg-card">
          <DialogTitle className="sr-only">QR Code - Enlarged</DialogTitle>
          <div className="p-6 flex flex-col items-center">
            <Avatar className="h-14 w-14 mb-3">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {getInitials(currentUser.displayName)}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">{currentUser.displayName}</h3>
            <span className="text-sm text-primary font-mono font-semibold mt-0.5">
              {currentUser.zaxoNumber}
            </span>
            <div className="bg-white rounded-xl p-3 mt-4 shadow-inner">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Zaxo QR Code Enlarged"
                  className="h-64 w-64 object-contain"
                />
              )}
            </div>
            <Button
              onClick={() => setIsEnlarged(false)}
              variant="ghost"
              className="mt-4 rounded-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
