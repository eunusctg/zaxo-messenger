'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Reply,
  Forward,
  Star,
  Copy,
  Pencil,
  Pin,
  Trash2,
  Info,
  X,
} from 'lucide-react';
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
import { useChatStore, Message } from '@/stores';

const QUICK_REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🙏', '🎉'];

interface MessageActionsProps {
  message: Message;
  chatId: string;
  isOwnMessage: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onReply?: (messageId: string) => void;
  onForward?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
}

export default function MessageActions({
  message,
  chatId,
  isOwnMessage,
  position,
  onClose,
  onReply,
  onForward,
  onEdit,
}: MessageActionsProps) {
  const { starMessage, deleteMessage, pinMessage, addReaction } = useChatStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isPinned = useChatStore((s) => {
    const chat = s.chats.find((c) => c.id === chatId);
    return chat?.pinnedMessages.includes(message.id) ?? false;
  });

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleCopy = useCallback(() => {
    if (message.content) {
      navigator.clipboard.writeText(message.content).catch(() => {});
    }
    onClose();
  }, [message.content, onClose]);

  const handleStar = useCallback(() => {
    starMessage(chatId, message.id);
    onClose();
  }, [starMessage, chatId, message.id, onClose]);

  const handlePin = useCallback(() => {
    pinMessage(chatId, message.id);
    onClose();
  }, [pinMessage, chatId, message.id, onClose]);

  const handleQuickReact = useCallback(
    (emoji: string) => {
      addReaction(chatId, message.id, emoji);
      onClose();
    },
    [addReaction, chatId, message.id, onClose]
  );

  const handleDelete = useCallback(
    (forEveryone: boolean) => {
      deleteMessage(chatId, message.id, forEveryone);
      setShowDeleteDialog(false);
      onClose();
    },
    [deleteMessage, chatId, message.id, onClose]
  );

  // Calculate menu position
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    left: Math.min(position.x, window.innerWidth - 220),
    top: Math.min(position.y, window.innerHeight - 400),
    zIndex: 100,
  };

  const actions = [
    { icon: Reply, label: 'Reply', action: () => { onReply?.(message.id); onClose(); } },
    { icon: Forward, label: 'Forward', action: () => { onForward?.(message.id); onClose(); } },
    { icon: Star, label: message.isStarred ? 'Unstar' : 'Star', action: handleStar },
    { icon: Copy, label: 'Copy', action: handleCopy },
    ...(isOwnMessage
      ? [{ icon: Pencil, label: 'Edit', action: () => { onEdit?.(message.id); onClose(); } }]
      : []),
    { icon: Pin, label: isPinned ? 'Unpin' : 'Pin', action: handlePin },
    { icon: Trash2, label: 'Delete', action: () => setShowDeleteDialog(true), destructive: true },
    { icon: Info, label: 'Info', action: () => setShowInfoDialog(true) },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[99]" onClick={onClose} />

      {/* Action Menu */}
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.9, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -5 }}
        transition={{ duration: 0.15 }}
        style={menuStyle}
        className="w-56 rounded-xl bg-popover text-popover-foreground shadow-xl border border-border overflow-hidden"
      >
        {/* Quick Reactions Row */}
        <div className="flex items-center justify-around px-2 py-2.5 border-b border-border">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleQuickReact(emoji)}
              className="text-xl hover:scale-125 active:scale-95 transition-transform p-0.5"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Action Items */}
        <div className="py-1">
          {actions.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted/50 active:bg-muted ${
                'destructive' in item && item.destructive
                  ? 'text-destructive hover:text-destructive'
                  : ''
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-[300px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete message?</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={() => handleDelete(false)}
            >
              Delete for me
            </Button>
            {isOwnMessage && (
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(true)}
              >
                Delete for everyone
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="max-w-[320px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Message Info
            </DialogTitle>
            <DialogDescription>Delivery and read information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary text-xs">✓✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Read</p>
                  <p className="text-xs text-muted-foreground">
                    {message.isRead ? message.createdAt : 'Not yet read'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-muted-foreground text-xs">✓✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Delivered</p>
                  <p className="text-xs text-muted-foreground">
                    {message.isDelivered ? message.createdAt : 'Not yet delivered'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-muted-foreground text-xs">🕐</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Sent</p>
                  <p className="text-xs text-muted-foreground">{message.createdAt}</p>
                </div>
              </div>
            </div>
            {message.isEdited && (
              <div className="text-xs text-muted-foreground border-t pt-3">
                This message has been edited
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
