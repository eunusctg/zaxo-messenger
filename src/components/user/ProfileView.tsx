'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Scan,
  Shield,
  Bell,
  Moon,
  Sun,
  Monitor,
  Lock,
  User,
  ChevronRight,
  Copy,
  Check,
  Edit3,
  Settings,
  Eye,
  Key,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useAppStore } from '@/stores';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  rightElement?: React.ReactNode;
  onClick?: () => void;
}

function SettingItem({ icon, label, value, rightElement, onClick }: SettingItemProps) {
  const hasInteractiveRight = rightElement !== undefined;
  return (
    <div
      onClick={hasInteractiveRight ? undefined : onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors text-left ${hasInteractiveRight ? '' : 'cursor-pointer'}`}
    >
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium">{label}</span>
        {value && (
          <p className="text-xs text-muted-foreground truncate">{value}</p>
        )}
      </div>
      {rightElement || (
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
    </div>
  );
}

export default function ProfileView() {
  const { currentUser } = useAuthStore();
  const { setTab } = useAppStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [lastSeenVisible, setLastSeenVisible] = useState(true);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const handleCopyNumber = async () => {
    if (!currentUser) return;
    try {
      await navigator.clipboard.writeText(currentUser.zaxoNumber);
    } catch {
      // fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    // In a real app, this would update via API
  };

  const handleSaveBio = () => {
    setIsEditingBio(false);
    // In a real app, this would update via API
  };

  const themeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4 text-primary" />;
      case 'dark': return <Moon className="h-4 w-4 text-primary" />;
      case 'system': return <Monitor className="h-4 w-4 text-primary" />;
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex h-full flex-col bg-background">
      <ScrollArea className="flex-1">
        {/* Profile header */}
        <div className="flex flex-col items-center pt-6 pb-4 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                {getInitials(currentUser.displayName)}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Display name (editable) */}
          <div className="mt-3 flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-8 text-center text-base font-semibold w-48"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                />
                <Button size="sm" variant="ghost" onClick={handleSaveName}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <h2 className="text-xl font-bold">{displayName}</h2>
                <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Zaxo number */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-primary font-mono font-semibold">
              {currentUser.zaxoNumber}
            </span>
            <button
              onClick={handleCopyNumber}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Status badge */}
          <Badge variant="secondary" className="mt-2 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
            {currentUser.status}
          </Badge>

          {/* Bio (editable) */}
          <div className="mt-3 w-full max-w-xs text-center">
            {isEditingBio ? (
              <div className="flex items-center gap-2">
                <Input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="h-8 text-center text-sm"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveBio()}
                />
                <Button size="sm" variant="ghost" onClick={handleSaveBio}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingBio(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                {bio}
                <Edit3 className="h-3 w-3 opacity-50" />
              </button>
            )}
          </div>

          {/* QR buttons */}
          <div className="flex items-center gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setTab('qr')}
            >
              <QrCode className="h-4 w-4 mr-1.5" />
              QR Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setTab('qr')}
            >
              <Scan className="h-4 w-4 mr-1.5" />
              Scan
            </Button>
          </div>
        </div>

        <Separator />

        {/* Settings sections */}
        <div className="py-2">
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Privacy
            </span>
          </div>

          <SettingItem
            icon={<Eye className="h-4 w-4 text-primary" />}
            label="Last seen"
            value={lastSeenVisible ? 'Everyone' : 'Nobody'}
            rightElement={
              <Switch
                checked={lastSeenVisible}
                onCheckedChange={setLastSeenVisible}
              />
            }
          />

          <SettingItem
            icon={<Shield className="h-4 w-4 text-primary" />}
            label="Privacy"
            value="Profile photo, About, Groups"
            onClick={() => {}}
          />
        </div>

        <Separator />

        <div className="py-2">
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Notifications
            </span>
          </div>

          <SettingItem
            icon={<Bell className="h-4 w-4 text-primary" />}
            label="Notifications"
            value="Message, Group, Call notifications"
            onClick={() => {}}
          />
        </div>

        <Separator />

        <div className="py-2">
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Appearance
            </span>
          </div>

          <SettingItem
            icon={themeIcon()}
            label="Theme"
            value={theme.charAt(0).toUpperCase() + theme.slice(1)}
            rightElement={
              <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`p-1.5 rounded-full transition-all ${
                      theme === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t === 'light' ? <Sun className="h-3.5 w-3.5" /> : t === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            }
          />
        </div>

        <Separator />

        <div className="py-2">
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Security
            </span>
          </div>

          <SettingItem
            icon={<Lock className="h-4 w-4 text-primary" />}
            label="Two-Factor Authentication"
            value={twoFAEnabled ? 'Enabled' : 'Disabled'}
            rightElement={
              <Switch
                checked={twoFAEnabled}
                onCheckedChange={setTwoFAEnabled}
              />
            }
          />

          <SettingItem
            icon={<Key className="h-4 w-4 text-primary" />}
            label="Security"
            value="Active sessions, Linked devices"
            onClick={() => {}}
          />
        </div>

        <Separator />

        <div className="py-2">
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Account
            </span>
          </div>

          <SettingItem
            icon={<User className="h-4 w-4 text-primary" />}
            label="Account"
            value="Profile, Phone number, Zaxo number"
            onClick={() => {}}
          />

          <SettingItem
            icon={<Settings className="h-4 w-4 text-primary" />}
            label="Settings"
            value="All settings"
            onClick={() => {}}
          />
        </div>

        {/* App version */}
        <div className="px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">Zaxo Messenger v1.0.0</p>
        </div>
      </ScrollArea>
    </div>
  );
}
