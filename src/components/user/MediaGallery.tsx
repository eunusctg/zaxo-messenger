'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowLeft,
  Share2,
  SmilePlus,
  Forward,
  Trash2,
  Download,
  FileText,
  Film,
  Image as ImageIcon,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/stores';

interface MediaGalleryProps {
  mediaItems: {
    id: string;
    type: 'image' | 'video' | 'document';
    url?: string;
    fileName?: string;
    fileSize?: string;
    senderName: string;
    timestamp: string;
    caption?: string;
  }[];
  initialIndex?: number;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export default function MediaGallery({
  mediaItems,
  initialIndex = 0,
  onClose,
  onDelete,
}: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const item = mediaItems[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < mediaItems.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setCurrentIndex((i) => i - 1);
      setIsZoomed(false);
    }
  }, [hasPrev]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      setCurrentIndex((i) => i + 1);
      setIsZoomed(false);
    }
  }, [hasNext]);

  const handleDoubleTap = useCallback(() => {
    setIsZoomed((z) => !z);
  }, []);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:bg-white/10"
            onClick={onClose}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{item.senderName}</p>
            <p className="text-xs text-white/60">{item.timestamp}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/10">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/10">
            <SmilePlus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/10">
            <Forward className="h-4 w-4" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/10 hover:text-destructive"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Media Display Area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Navigation Arrows */}
        {hasPrev && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 z-10 h-10 w-10 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 z-10 h-10 w-10 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center w-full h-full"
            onDoubleClick={handleDoubleTap}
          >
            {item.type === 'image' && (
              <motion.div
                animate={{ scale: isZoomed ? 2 : 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-64 h-64 sm:w-80 sm:h-80 bg-muted/20 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-3">
                  <ImageIcon className="h-16 w-16 text-white/30" />
                  <p className="text-sm text-white/50">Image Preview</p>
                  <p className="text-xs text-white/30">{item.caption || 'No caption'}</p>
                </div>
              </motion.div>
            )}

            {item.type === 'video' && (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-72 h-48 sm:w-96 sm:h-64 bg-muted/20 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-3 relative">
                  <Film className="h-16 w-16 text-white/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <div className="ml-1 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/40">Video - {item.timestamp}</p>
              </div>
            )}

            {item.type === 'document' && (
              <div className="bg-background rounded-xl p-6 max-w-xs w-full mx-4 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.fileName || 'Document'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.fileSize || 'Unknown size'}
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4 rounded-xl gap-1.5" size="sm">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Zoom indicator */}
        {item.type === 'image' && (
          <button
            onClick={handleDoubleTap}
            className="absolute bottom-4 right-4 h-9 w-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Bottom Bar - Swipe Indicator */}
      <div className="flex items-center justify-center gap-2 pb-6 pt-3 bg-black/50 backdrop-blur-sm">
        <span className="text-sm text-white/60">
          {currentIndex + 1} / {mediaItems.length}
        </span>
        <div className="flex gap-1 ml-3">
          {mediaItems.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-4 bg-primary' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
