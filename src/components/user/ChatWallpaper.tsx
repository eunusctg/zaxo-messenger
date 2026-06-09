'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useChatStore } from '@/stores';
import { wallpaperOptions } from '@/lib/mock-data';

interface ChatWallpaperProps {
  chatId: string;
  onClose: () => void;
}

export default function ChatWallpaper({ chatId, onClose }: ChatWallpaperProps) {
  const { setChatWallpaper, chats } = useChatStore();
  const chat = chats.find((c) => c.id === chatId);
  const currentWallpaper = chat?.wallpaper || null;

  const [selectedWallpaper, setSelectedWallpaper] = useState<string | null>(currentWallpaper);
  const [brightness, setBrightness] = useState(100);

  const wallpaperStyle = useMemo(() => {
    if (!selectedWallpaper) return {};
    const option = wallpaperOptions.find((w) => w.id === selectedWallpaper);
    if (!option) return {};
    if (option.color?.includes('gradient')) {
      return { background: option.color };
    }
    if (option.color) {
      return { backgroundColor: option.color };
    }
    return {};
  }, [selectedWallpaper]);

  const handleSetWallpaper = () => {
    setChatWallpaper(chatId, selectedWallpaper || 'default');
    onClose();
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-semibold text-sm">Chat Wallpaper</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Preview Area */}
        <div className="p-4">
          <div
            className="relative rounded-2xl overflow-hidden border border-border h-72 sm:h-80"
            style={wallpaperStyle}
          >
            {/* Dim overlay based on brightness */}
            <div
              className="absolute inset-0 bg-black pointer-events-none"
              style={{ opacity: (100 - brightness) / 100 }}
            />

            {/* Mock chat screen */}
            <div className="relative p-4 space-y-3 h-full flex flex-col justify-end">
              {/* Received message */}
              <div className="self-start max-w-[65%]">
                <div className="bg-white dark:bg-gray-800 text-foreground px-3 py-2 rounded-xl rounded-tl-sm shadow-sm">
                  <p className="text-xs">Hey! How are you doing?</p>
                  <span className="text-[8px] text-muted-foreground float-right ml-2 mt-0.5">2:30 PM</span>
                </div>
              </div>

              {/* Sent message */}
              <div className="self-end max-w-[65%]">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 text-foreground px-3 py-2 rounded-xl rounded-tr-sm shadow-sm">
                  <p className="text-xs">I&apos;m great! Thanks for asking 😊</p>
                  <span className="text-[8px] text-emerald-700 dark:text-emerald-300 float-right ml-2 mt-0.5">
                    2:31 PM ✓✓
                  </span>
                </div>
              </div>

              {/* Another received */}
              <div className="self-start max-w-[65%]">
                <div className="bg-white dark:bg-gray-800 text-foreground px-3 py-2 rounded-xl rounded-tl-sm shadow-sm">
                  <p className="text-xs">Want to grab coffee later?</p>
                  <span className="text-[8px] text-muted-foreground float-right ml-2 mt-0.5">2:32 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brightness Slider */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3">
            <Sun className="h-4 w-4 text-muted-foreground shrink-0" />
            <Slider
              value={[brightness]}
              onValueChange={(v) => setBrightness(v[0])}
              min={20}
              max={100}
              step={5}
              className="flex-1"
            />
            <Moon className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
        </div>

        {/* Wallpaper Options */}
        <div className="px-4 pb-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-3">Wallpaper Options</h3>

          {/* Default */}
          <button
            onClick={() => setSelectedWallpaper(null)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl mb-3 transition-colors border ${
              selectedWallpaper === null
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-muted/50'
            }`}
          >
            <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
              {selectedWallpaper === null ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <span className="text-xs text-muted-foreground">✕</span>
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Default</p>
              <p className="text-xs text-muted-foreground">No wallpaper</p>
            </div>
          </button>

          {/* Grid of wallpaper options */}
          <div className="grid grid-cols-3 gap-2">
            {wallpaperOptions
              .filter((w) => w.id !== 'default')
              .map((wallpaper) => {
                const isSelected = selectedWallpaper === wallpaper.id;
                return (
                  <button
                    key={wallpaper.id}
                    onClick={() => setSelectedWallpaper(wallpaper.id)}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border'
                    }`}
                  >
                    <div
                      className="absolute inset-0"
                      style={
                        wallpaper.color?.includes('gradient')
                          ? { background: wallpaper.color }
                          : { backgroundColor: wallpaper.color || 'transparent' }
                      }
                    />
                    {/* Check indicator */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    {/* Name */}
                    <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-sm px-2 py-1">
                      <span className="text-[9px] text-white font-medium">{wallpaper.name}</span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Set Wallpaper Button */}
      <div className="border-t px-4 py-3">
        <Button className="w-full h-11 rounded-xl gap-1.5" onClick={handleSetWallpaper}>
          <Check className="h-4 w-4" />
          Set Wallpaper
        </Button>
      </div>
    </motion.div>
  );
}
