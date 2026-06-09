'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import { Message } from '@/stores';

interface LinkPreviewProps {
  message: Message;
  isSent: boolean;
  onLinkClick?: (url: string) => void;
}

export default function LinkPreview({ message, isSent, onLinkClick }: LinkPreviewProps) {
  const preview = message.linkPreview;

  // Extract domain from URL - must be before early return (hooks rules)
  const domain = useMemo(() => {
    if (!preview) return '';
    try {
      const url = new URL(preview.url);
      return url.hostname;
    } catch {
      return preview.url;
    }
  }, [preview]);

  if (!preview) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`mt-1.5 rounded-lg overflow-hidden border cursor-pointer transition-colors hover:bg-muted/20 ${
        isSent ? 'border-primary-foreground/15 bg-primary-foreground/5' : 'border-border bg-muted/30'
      }`}
      onClick={() => onLinkClick?.(preview.url)}
    >
      <div className="flex">
        {/* Preview Image Placeholder */}
        <div
          className={`w-24 shrink-0 flex items-center justify-center ${
            isSent ? 'bg-primary-foreground/10' : 'bg-muted/50'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <Globe
              className={`h-6 w-6 ${isSent ? 'text-primary-foreground/40' : 'text-muted-foreground'}`}
            />
            <span className={`text-[8px] ${isSent ? 'text-primary-foreground/30' : 'text-muted-foreground'}`}>
              Preview
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-2">
          {/* Title */}
          <p
            className={`text-xs font-semibold leading-tight truncate ${
              isSent ? 'text-primary-foreground/90' : 'text-foreground'
            }`}
          >
            {preview.title}
          </p>

          {/* Description */}
          {preview.description && (
            <p
              className={`text-[10px] leading-snug mt-0.5 line-clamp-2 ${
                isSent ? 'text-primary-foreground/60' : 'text-muted-foreground'
              }`}
            >
              {preview.description}
            </p>
          )}

          {/* Domain */}
          <div className="flex items-center gap-1 mt-1">
            <ExternalLink
              className={`h-2.5 w-2.5 ${isSent ? 'text-primary-foreground/40' : 'text-muted-foreground'}`}
            />
            <span
              className={`text-[9px] truncate ${
                isSent ? 'text-primary-foreground/50' : 'text-muted-foreground'
              }`}
            >
              {domain}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
