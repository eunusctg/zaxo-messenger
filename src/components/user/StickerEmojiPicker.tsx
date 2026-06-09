'use client';

import { useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Clock, SmilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { stickerPacks } from '@/lib/mock-data';

// Emoji data organized by category
const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    icon: '😀',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🫡', '🤐', '🤨', '😐', '😑', '😶', '🫥', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷'],
  },
  {
    name: 'Gestures',
    icon: '👋',
    emojis: ['👋', '🤚', '✋', '🖖', '🫱', '🫲', '🫳', '🫴', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '🫵', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝', '🙏'],
  },
  {
    name: 'Hearts',
    icon: '❤️',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  },
  {
    name: 'Animals',
    icon: '🐶',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱', '🐛', '🦋', '🐌', '🐞'],
  },
  {
    name: 'Food',
    icon: '🍕',
    emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🥝', '🍅', '🥑', '🍆', '🥦', '🥬', '🌶️', '🫑', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🫘', '🍕', '🍔', '🍟', '🌭', '🍿', '🧈', '🥞', '🧇', '🥓', '🥚', '🍳', '🧀', '🥗', '🥙', '🌮', '🍣', '🍜', '🍛', '🍚', '🍰', '🎂', '🧁', '🍮', '☕', '🍵'],
  },
  {
    name: 'Travel',
    icon: '✈️',
    emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛺', '🚔', '🚍', '✈️', '🛫', '🛬', '🧳', '⛵', '🚢', '🗺️', '🏔️', '⛰️', '🌋', '🏕️', '🏖️', '🏜️', '🏝️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩'],
  },
  {
    name: 'Objects',
    icon: '💡',
    emojis: ['⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '💡', '🔦', '🏮', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '📑', '🔖'],
  },
  {
    name: 'Symbols',
    icon: '♻️',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '🔀', '🔁', '🔂', '▶️', '⏩', '⏭️', '⏯️', '◀️', '⏪', '⏮️', '🔼', '⏫', '🔽', '⏬', '⏹️', '⏺️', '⏏️', '🎵', '🎶', '🎶', '✅', '❌', '❓', '❗', '‼️', '⁉️', '♻️', '🔥'],
  },
];

const SKIN_TONES = ['👋', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿'];
const SKIN_TONE_NAMES = ['Default', 'Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'];

interface StickerEmojiPickerProps {
  onEmojiSelect?: (emoji: string) => void;
  onStickerSelect?: (sticker: string) => void;
  onGifSelect?: (gifUrl: string) => void;
  onClose: () => void;
}

export default function StickerEmojiPicker({
  onEmojiSelect,
  onStickerSelect,
  onGifSelect,
  onClose,
}: StickerEmojiPickerProps) {
  const [activeTab, setActiveTab] = useState('emoji');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [gifSearch, setGifSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedStickerPack, setSelectedStickerPack] = useState(stickerPacks[0].id);
  const [skinTone, setSkinTone] = useState(0);
  const [showSkinTonePicker, setShowSkinTonePicker] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<string[]>(['❤️', '👍', '😂', '😮']);
  const emojiScrollRef = useRef<HTMLDivElement>(null);

  const filteredEmojis = useMemo(() => {
    if (!emojiSearch.trim()) return EMOJI_CATEGORIES[selectedCategory]?.emojis || [];
    const q = emojiSearch.toLowerCase();
    const all = EMOJI_CATEGORIES.flatMap((c) => c.emojis);
    return [...new Set(all)]; // return all when searching (no category name match for emojis)
  }, [emojiSearch, selectedCategory]);

  const selectedPackData = useMemo(
    () => stickerPacks.find((p) => p.id === selectedStickerPack) || stickerPacks[0],
    [selectedStickerPack]
  );

  const handleEmojiClick = useCallback(
    (emoji: string) => {
      setRecentEmojis((prev) => {
        const filtered = prev.filter((e) => e !== emoji);
        return [emoji, ...filtered].slice(0, 8);
      });
      onEmojiSelect?.(emoji);
    },
    [onEmojiSelect]
  );

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-background border-t border-border rounded-t-2xl shadow-2xl"
      style={{ height: '40vh', maxHeight: '400px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="bg-transparent h-9 p-0 gap-4">
            <TabsTrigger
              value="emoji"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-0 text-sm"
            >
              Emoji
            </TabsTrigger>
            <TabsTrigger
              value="stickers"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-0 text-sm"
            >
              Stickers
            </TabsTrigger>
            <TabsTrigger
              value="gif"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-0 text-sm"
            >
              GIF
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-48px)] overflow-hidden">
        {/* Emoji Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'emoji' && (
            <motion.div
              key="emoji"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              {/* Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={emojiSearch}
                    onChange={(e) => setEmojiSearch(e.target.value)}
                    placeholder="Search emoji..."
                    className="h-8 pl-8 text-xs rounded-full bg-muted/50"
                  />
                </div>
              </div>

              {/* Recently used */}
              {!emojiSearch && recentEmojis.length > 0 && (
                <div className="px-3 pb-1">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-medium">Recently Used</span>
                  </div>
                  <div className="flex gap-1">
                    {recentEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-xl p-1 hover:bg-muted/50 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category tabs */}
              {!emojiSearch && (
                <div className="flex gap-0.5 px-2 border-b border-border overflow-x-auto scrollbar-none">
                  {EMOJI_CATEGORIES.map((cat, idx) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(idx)}
                      className={`px-2 py-1.5 text-sm shrink-0 transition-colors ${
                        selectedCategory === idx
                          ? 'bg-primary/10 text-primary border-b-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {cat.icon}
                    </button>
                  ))}
                </div>
              )}

              {/* Emoji Grid */}
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-8 gap-0.5 p-2">
                  {filteredEmojis.map((emoji, idx) => (
                    <button
                      key={`${emoji}-${idx}`}
                      onClick={() => handleEmojiClick(emoji)}
                      className="aspect-square flex items-center justify-center text-xl hover:bg-muted/50 rounded transition-colors active:scale-90"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </ScrollArea>

              {/* Bottom bar with skin tone */}
              <div className="flex items-center justify-between px-3 py-1.5 border-t border-border">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 gap-1 text-xs"
                    onClick={() => setShowSkinTonePicker(!showSkinTonePicker)}
                  >
                    {SKIN_TONES[skinTone]}
                    <span className="text-muted-foreground">{SKIN_TONE_NAMES[skinTone]}</span>
                  </Button>
                  <AnimatePresence>
                    {showSkinTonePicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full left-0 mb-1 bg-popover border border-border rounded-lg shadow-lg p-2 flex gap-1 z-10"
                      >
                        {SKIN_TONES.map((tone, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSkinTone(idx);
                              setShowSkinTonePicker(false);
                            }}
                            className={`text-lg p-1 rounded hover:bg-muted/50 ${
                              skinTone === idx ? 'bg-primary/10 ring-1 ring-primary' : ''
                            }`}
                          >
                            {tone}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <SmilePlus className="h-4 w-4 text-muted-foreground" />
              </div>
            </motion.div>
          )}

          {/* Stickers Tab */}
          {activeTab === 'stickers' && (
            <motion.div
              key="stickers"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              {/* Sticker Grid */}
              <ScrollArea className="flex-1">
                <div className="grid grid-cols-4 gap-2 p-3">
                  {selectedPackData.stickers.map((sticker, idx) => (
                    <motion.button
                      key={`${sticker}-${idx}`}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => onStickerSelect?.(sticker)}
                      className="aspect-square flex items-center justify-center text-3xl bg-muted/30 hover:bg-muted/60 rounded-xl transition-colors border border-border/50"
                    >
                      {sticker}
                    </motion.button>
                  ))}
                </div>
              </ScrollArea>

              {/* Sticker Pack Selector */}
              <div className="flex gap-2 px-3 py-2 border-t border-border overflow-x-auto scrollbar-none">
                {stickerPacks.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedStickerPack(pack.id)}
                    className={`shrink-0 flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                      selectedStickerPack === pack.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-lg">{pack.icon}</span>
                    <span className="text-[9px] font-medium truncate max-w-[48px]">{pack.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* GIF Tab */}
          {activeTab === 'gif' && (
            <motion.div
              key="gif"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col"
            >
              {/* GIF Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={gifSearch}
                    onChange={(e) => setGifSearch(e.target.value)}
                    placeholder="Search GIFs..."
                    className="h-8 pl-8 text-xs rounded-full bg-muted/50"
                  />
                </div>
              </div>

              {/* Trending GIFs placeholder */}
              <ScrollArea className="flex-1">
                <div className="px-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    {gifSearch ? `Results for "${gifSearch}"` : 'Trending GIFs'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => onGifSelect?.(`gif-placeholder-${idx}`)}
                        className="aspect-[4/3] bg-muted/40 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-1 hover:bg-muted/60 transition-colors"
                      >
                        <span className="text-2xl">
                          {['🎬', '😂', '🎉', '🔥', '💫', '🎵'][idx]}
                        </span>
                        <span className="text-[9px] text-muted-foreground">GIF</span>
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollArea>

              {/* Powered by GIPHY */}
              <div className="text-center py-1.5 border-t border-border">
                <span className="text-[9px] text-muted-foreground">Powered by GIPHY</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
