'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Smile, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusItem } from '@/stores';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const STATUS_DURATION = 5000;

interface StatusViewerProps {
  statuses: StatusItem[];
  startIndex?: number;
  onClose: () => void;
}

export default function StatusViewer({ statuses, startIndex = 0, onClose }: StatusViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [sessionKey, setSessionKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showEmojiHint, setShowEmojiHint] = useState(false);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCloseRef = useRef(onClose);
  const statusesLengthRef = useRef(statuses.length);

  useEffect(() => {
    onCloseRef.current = onClose;
    statusesLengthRef.current = statuses.length;
  }, [onClose, statuses.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < statusesLengthRef.current - 1) {
        return prev + 1;
      }
      onCloseRef.current();
      return prev;
    });
    setSessionKey((k) => k + 1);
    setIsPaused(false);
  }, []);

  const goPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    if (currentIndex > 0) {
      setSessionKey((k) => k + 1);
      setIsPaused(false);
    }
  }, [currentIndex]);

  const currentStatus = statuses[currentIndex];

  // Progress bar animation - keyed on sessionKey so it resets on index change
  useEffect(() => {
    if (isPaused || !currentStatus) return;

    const startTime = Date.now();
    const tickInterval = 50;
    let currentProgress = 0;

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      currentProgress = Math.min((elapsed / STATUS_DURATION) * 100, 100);

      if (currentProgress >= 100) {
        if (progressRef.current) clearInterval(progressRef.current);
        goNext();
      }
    }, tickInterval);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [sessionKey, isPaused, goNext, currentStatus]);

  // Compute progress for display using CSS animation
  const progressStyle = isPaused
    ? { animationPlayState: 'paused' as const }
    : {};

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    if (x < width * 0.35) {
      goPrevious();
    } else {
      goNext();
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goNext();
      else if (e.key === 'ArrowLeft') goPrevious();
      else if (e.key === 'Escape') onCloseRef.current();
      else if (e.key === 'p') setIsPaused((p) => !p);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrevious]);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setReplyText('');
  };

  if (!currentStatus) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black flex flex-col"
      >
        {/* Progress Bars */}
        <div className="flex gap-1 px-2 pt-2 pb-1">
          {statuses.map((_, idx) => (
            <div key={idx} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
              {idx < currentIndex ? (
                <div className="h-full bg-white rounded-full w-full" />
              ) : idx === currentIndex ? (
                <div
                  key={sessionKey}
                  className="h-full bg-white rounded-full"
                  style={{
                    animation: isPaused ? 'none' : `statusProgress ${STATUS_DURATION}ms linear forwards`,
                    ...progressStyle,
                  }}
                />
              ) : null}
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-9 w-9 border-2 border-white/30">
            <AvatarFallback className="bg-primary/80 text-white text-xs font-semibold">
              {getInitials(currentStatus.userName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">
              {currentStatus.userName}
            </p>
            <p className="text-[10px] text-white/60">{currentStatus.createdAt}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10 shrink-0"
            onClick={() => setIsPaused((p) => !p)}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10 shrink-0"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Content - Tappable Area */}
        <div
          className="flex-1 flex items-center justify-center relative cursor-pointer select-none"
          onClick={handleTap}
        >
          <div className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
                onClick={(e) => { e.stopPropagation(); goPrevious(); }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10">
            {currentIndex < statuses.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Status Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStatus.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center w-full h-full px-6"
            >
              {currentStatus.type === 'text' ? (
                <div
                  className="w-full max-w-md aspect-[3/4] rounded-2xl flex items-center justify-center p-8 shadow-2xl"
                  style={{ backgroundColor: currentStatus.backgroundColor || '#10b981' }}
                >
                  <p
                    className="text-center text-xl font-medium leading-relaxed"
                    style={{ color: currentStatus.textColor || '#fff' }}
                  >
                    {currentStatus.content}
                  </p>
                </div>
              ) : currentStatus.type === 'image' ? (
                <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: currentStatus.backgroundColor || '#10b981' }}
                  >
                    <div className="text-center p-6">
                      <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="h-10 w-10 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                      <p className="text-white text-lg font-medium">{currentStatus.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: currentStatus.backgroundColor || '#14b8a6' }}
                  >
                    <div className="text-center p-6">
                      <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                        <Play className="h-10 w-10 text-white/80 ml-1" />
                      </div>
                      <p className="text-white text-lg font-medium">{currentStatus.content}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute left-0 top-0 h-full w-[35%]" />
          <div className="absolute right-0 top-0 h-full w-[65%]" />
        </div>

        {/* Bottom Bar - Reply */}
        <div className="flex items-center gap-2 px-3 pb-6 pt-2 sm:pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-white hover:bg-white/10 shrink-0"
            onClick={() => setShowEmojiHint((s) => !s)}
          >
            <Smile className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder={`Reply to ${currentStatus.userName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(); }}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full h-10 text-sm pr-10"
            />
            {replyText.trim() && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-primary hover:bg-white/10"
                onClick={handleSendReply}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Emoji reaction hint */}
        <AnimatePresence>
          {showEmojiHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2"
            >
              {['❤️', '😂', '😮', '😢', '👍', '🎉'].map((emoji) => (
                <button
                  key={emoji}
                  className="text-2xl hover:scale-125 transition-transform"
                  onClick={() => {
                    setReplyText((prev) => prev + emoji);
                    setShowEmojiHint(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CSS for progress animation */}
        <style jsx>{`
          @keyframes statusProgress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
