'use client';

import { useState, useMemo } from 'react';
import { Shield, Lock, QrCode, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface E2EInfoProps {
  open: boolean;
  onClose: () => void;
  chatName?: string;
}

export default function E2EInfo({ open, onClose, chatName }: E2EInfoProps) {
  const [verified, setVerified] = useState(false);

  const verificationCode = useMemo(() => {
    const rows: string[] = [];
    for (let r = 0; r < 5; r++) {
      const digits: string[] = [];
      for (let d = 0; d < 12; d++) {
        digits.push(Math.floor(Math.random() * 10).toString());
      }
      rows.push(digits.join(''));
    }
    return rows;
  }, []);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[360px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
          </DialogTitle>
          <DialogTitle className="text-center text-base">
            Messages and calls are end-to-end encrypted
          </DialogTitle>
          <DialogDescription className="text-center text-xs leading-relaxed">
            {chatName
              ? `Your messages and calls with ${chatName} are secured with end-to-end encryption. No one outside of this chat, not even Zaxo, can read or listen to them.`
              : 'Your messages and calls are secured with end-to-end encryption. No one outside of this chat, not even Zaxo, can read or listen to them.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Lock icon with shield */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Shield className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Verification Code */}
          <div>
            <p className="text-xs font-medium text-center text-muted-foreground mb-2">
              Verification Code
            </p>
            <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
              {verificationCode.map((row, idx) => (
                <p
                  key={idx}
                  className="text-xs font-mono tracking-[0.2em] text-center py-0.5"
                >
                  {row}
                </p>
              ))}
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center">
            <div className="h-28 w-28 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 bg-muted/10">
              <QrCode className="h-8 w-8 text-muted-foreground" />
              <span className="text-[8px] text-muted-foreground">QR Code</span>
            </div>
          </div>

          {/* Verify Button */}
          {verified ? (
            <div className="flex items-center justify-center gap-2 py-2">
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-primary">Verified</span>
            </div>
          ) : (
            <Button
              className="w-full rounded-xl gap-1.5"
              onClick={() => setVerified(true)}
            >
              <Shield className="h-4 w-4" />
              Verify
            </Button>
          )}

          {/* Learn More */}
          <div className="text-center">
            <button className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Learn more about end-to-end encryption
              <ExternalLink className="h-2.5 w-2.5" />
            </button>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="w-full rounded-xl">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
