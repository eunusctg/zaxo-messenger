'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MoreVertical,
  Camera,
  Image as ImageIcon,
  X,
  Bold,
  Italic,
  Send,
  Eye,
  Lock,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useStatusStore, StatusItem } from '@/stores';
import { mockContactStatuses, mockMyStatuses, mockUsers, statusBackgroundColors } from '@/lib/mock-data';
import StatusViewer from './StatusViewer';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatTimeAgo(time: string): string {
  return time.replace(' ago', '').replace(' hours', 'h').replace(' hour', 'h').replace(' minutes', 'm');
}

// ==================== Create Status Dialog ====================
interface CreateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateStatusDialog({ open, onOpenChange }: CreateStatusDialogProps) {
  const { addMyStatus } = useStatusStore();
  const [textContent, setTextContent] = useState('');
  const [selectedBg, setSelectedBg] = useState(statusBackgroundColors[0]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);

  const handleSend = useCallback(() => {
    if (!textContent.trim() && !isImageMode) return;

    const newStatus: StatusItem = {
      id: `my-status-${Date.now()}`,
      userId: 'demo-user-1',
      userName: 'Alex Morgan',
      userAvatar: null,
      type: isImageMode ? 'image' : 'text',
      content: textContent || '📷 Photo',
      backgroundColor: selectedBg,
      textColor: selectedBg === '#f59e0b' || selectedBg === '#84cc16' ? '#000' : '#fff',
      createdAt: 'Just now',
      expiresAt: '24h left',
      seenBy: [],
      isMyStatus: true,
    };

    addMyStatus(newStatus);
    setTextContent('');
    setSelectedBg(statusBackgroundColors[0]);
    setIsBold(false);
    setIsItalic(false);
    setIsImageMode(false);
    onOpenChange(false);
  }, [textContent, selectedBg, isBold, isItalic, isImageMode, addMyStatus, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-base font-semibold">Create Status</DialogTitle>
        </DialogHeader>

        {/* Status Preview */}
        <div className="px-4 pb-3">
          <div
            className="relative flex items-center justify-center rounded-xl overflow-hidden"
            style={{
              backgroundColor: selectedBg,
              minHeight: 180,
            }}
          >
            <p
              className={`text-center px-6 text-lg ${
                selectedBg === '#f59e0b' || selectedBg === '#84cc16' ? 'text-black' : 'text-white'
              } ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''}`}
            >
              {textContent || 'Type a status...'}
            </p>
          </div>
        </div>

        {/* Text Input */}
        <div className="px-4 pb-3">
          <Input
            placeholder="Type a status update..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="bg-muted/50 border-none rounded-lg text-sm"
            maxLength={700}
          />
        </div>

        {/* Background Color Selector */}
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground mb-2">Background</p>
          <div className="flex flex-wrap gap-2">
            {statusBackgroundColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedBg(color)}
                className={`h-8 w-8 rounded-full transition-all ${
                  selectedBg === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Font Style Options */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <Button
            variant={isBold ? 'default' : 'outline'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsBold(!isBold)}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={isItalic ? 'default' : 'outline'}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsItalic(!isItalic)}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <Button
            variant={isImageMode ? 'default' : 'outline'}
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setIsImageMode(!isImageMode)}
          >
            <Camera className="h-3.5 w-3.5" />
            Photo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setIsImageMode(true)}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Gallery
          </Button>
        </div>

        {/* Send Button */}
        <div className="px-4 pb-4 flex justify-end">
          <Button
            onClick={handleSend}
            disabled={!textContent.trim() && !isImageMode}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Post Status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ==================== Status Privacy Dialog ====================
interface StatusPrivacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StatusPrivacyDialog({ open, onOpenChange }: StatusPrivacyDialogProps) {
  const { statusPrivacy, setStatusPrivacy } = useStatusStore();
  const [selected, setSelected] = useState(statusPrivacy);

  useEffect(() => {
    setSelected(statusPrivacy);
  }, [statusPrivacy]);

  const options = [
    { value: 'everyone' as const, label: 'Everyone', desc: 'All your contacts can see your status' },
    { value: 'contacts' as const, label: 'My Contacts', desc: 'Only contacts can see your status' },
    { value: 'none' as const, label: 'Nobody', desc: 'No one can see your status' },
  ];

  const handleSave = () => {
    setStatusPrivacy(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Status Privacy
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelected(option.value)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selected === option.value ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    selected === option.value ? 'border-primary' : 'border-muted-foreground/30'
                  }`}
                >
                  {selected === option.value && (
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <Button size="sm" onClick={handleSave}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ==================== Status Item Component ====================
interface StatusItemRowProps {
  status: StatusItem;
  isViewed: boolean;
  onClick: () => void;
}

function StatusItemRow({ status, isViewed, onClick }: StatusItemRowProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent/50 transition-colors"
    >
      <div className="relative shrink-0">
        <div
          className={`rounded-full p-[2.5px] ${
            isViewed
              ? 'bg-muted-foreground/30'
              : 'bg-primary'
          }`}
        >
          <Avatar className="h-12 w-12 border-2 border-background">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {getInitials(status.userName)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{status.userName}</p>
        <p className="text-xs text-muted-foreground truncate">
          {formatTimeAgo(status.createdAt)}
        </p>
      </div>
    </motion.button>
  );
}

// ==================== Main StatusView ====================
export default function StatusView() {
  const { myStatuses, contactStatuses, viewedStatuses, setMyStatuses, setContactStatuses, setViewedStatuses } = useStatusStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUserId, setViewerUserId] = useState<string | null>(null);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);

  // Initialize mock data
  useEffect(() => {
    if (myStatuses.length === 0 && contactStatuses.length === 0) {
      setMyStatuses(mockMyStatuses);
      setContactStatuses(mockContactStatuses.filter((s) => !s.seenBy.includes('demo-user-1')));
      setViewedStatuses(mockContactStatuses.filter((s) => s.seenBy.includes('demo-user-1')));
    }
  }, [myStatuses.length, contactStatuses.length, viewedStatuses.length, setMyStatuses, setContactStatuses, setViewedStatuses]);

  // Group contact statuses by user
  const groupedByUser = useMemo(() => {
    const map = new Map<string, StatusItem[]>();
    contactStatuses.forEach((s) => {
      const existing = map.get(s.userId) || [];
      map.set(s.userId, [...existing, s]);
    });
    return map;
  }, [contactStatuses]);

  const groupedViewedByUser = useMemo(() => {
    const map = new Map<string, StatusItem[]>();
    viewedStatuses.forEach((s) => {
      const existing = map.get(s.userId) || [];
      map.set(s.userId, [...existing, s]);
    });
    return map;
  }, [viewedStatuses]);

  const openViewer = (userId: string, index = 0) => {
    setViewerUserId(userId);
    setViewerStartIndex(index);
    setViewerOpen(true);
  };

  const handleMyStatusClick = () => {
    if (myStatuses.length > 0) {
      openViewer('demo-user-1');
    } else {
      setCreateOpen(true);
    }
  };

  // Get all statuses for the viewer
  const viewerStatuses = useMemo(() => {
    if (!viewerUserId) return [];
    if (viewerUserId === 'demo-user-1') return myStatuses;
    const unviewed = groupedByUser.get(viewerUserId) || [];
    const viewed = groupedViewedByUser.get(viewerUserId) || [];
    return [...unviewed, ...viewed];
  }, [viewerUserId, myStatuses, groupedByUser, groupedViewedByUser]);

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">Status</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setPrivacyOpen(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Status privacy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        {/* My Status Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleMyStatusClick}
          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors"
        >
          <div className="relative shrink-0">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                AM
              </AvatarFallback>
            </Avatar>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCreateOpen(true);
              }}
              className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm border-2 border-background"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">My Status</p>
            <p className="text-xs text-muted-foreground">
              {myStatuses.length > 0
                ? `${myStatuses.length} update${myStatuses.length > 1 ? 's' : ''} · Tap to view`
                : 'Tap to add status update'}
            </p>
          </div>
        </motion.button>

        <Separator />

        {/* Recent Updates */}
        {groupedByUser.size > 0 && (
          <div>
            <p className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent updates
            </p>
            {Array.from(groupedByUser.entries()).map(([userId, statuses]) => (
              <StatusItemRow
                key={userId}
                status={statuses[0]}
                isViewed={false}
                onClick={() => openViewer(userId)}
              />
            ))}
          </div>
        )}

        {/* Viewed Updates */}
        {groupedViewedByUser.size > 0 && (
          <>
            <Separator />
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Viewed updates
              </p>
              {Array.from(groupedViewedByUser.entries()).map(([userId, statuses]) => (
                <StatusItemRow
                  key={userId}
                  status={statuses[0]}
                  isViewed={true}
                  onClick={() => openViewer(userId)}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {groupedByUser.size === 0 && groupedViewedByUser.size === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No recent status updates</p>
            <p className="text-xs text-muted-foreground mt-1">
              Updates from your contacts will appear here
            </p>
          </div>
        )}

        <div className="h-4" />
      </ScrollArea>

      {/* Create Status Dialog */}
      <CreateStatusDialog open={createOpen} onOpenChange={setCreateOpen} />

      {/* Status Privacy Dialog */}
      <StatusPrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />

      {/* Status Viewer Overlay */}
      <AnimatePresence>
        {viewerOpen && (
          <StatusViewer
            statuses={viewerStatuses}
            startIndex={viewerStartIndex}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
