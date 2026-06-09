'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MessageCircle,
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
  Palette,
  HardDrive,
  HelpCircle,
  Camera,
  Star,
  Zap,
  Users,
  Fingerprint,
  Database,
  Info,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useAppStore, useSettingsStore } from '@/stores';

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
  delay?: number;
}

function SettingItem({ icon, label, value, rightElement, onClick, delay = 0 }: SettingItemProps) {
  const hasInteractiveRight = rightElement !== undefined;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay }}
      onClick={hasInteractiveRight ? undefined : onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors text-left active:bg-accent/70 ${
        hasInteractiveRight ? '' : 'cursor-pointer'
      }`}
    >
      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
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
    </motion.div>
  );
}

export default function ProfileView() {
  const { currentUser } = useAuthStore();
  const { setTab, setOverlay } = useAppStore();
  const { theme } = useSettingsStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [copied, setCopied] = useState(false);

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
  };

  const handleSaveBio = () => {
    setIsEditingBio(false);
  };

  const themeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4 text-primary" />;
      case 'dark': return <Moon className="h-4 w-4 text-primary" />;
      case 'system': return <Monitor className="h-4 w-4 text-primary" />;
    }
  };

  if (!currentUser) return null;

  const settingsSections = [
    {
      title: 'Account',
      icon: <User className="h-4 w-4 text-primary" />,
      overlay: 'settings-account' as const,
      description: 'Profile, Phone, Zaxo number',
    },
    {
      title: 'Privacy',
      icon: <Eye className="h-4 w-4 text-primary" />,
      overlay: 'settings-privacy' as const,
      description: 'Last seen, Profile photo, About',
    },
    {
      title: 'Notifications',
      icon: <Bell className="h-4 w-4 text-primary" />,
      overlay: 'settings-notifications' as const,
      description: 'Message, Group, Call alerts',
    },
    {
      title: 'Appearance',
      icon: <Palette className="h-4 w-4 text-primary" />,
      overlay: 'settings-appearance' as const,
      description: 'Theme, Wallpaper, Font size',
    },
    {
      title: 'Security',
      icon: <Shield className="h-4 w-4 text-primary" />,
      overlay: 'settings-security' as const,
      description: '2FA, App lock, Biometric',
    },
    {
      title: 'Storage & Data',
      icon: <HardDrive className="h-4 w-4 text-primary" />,
      overlay: 'settings-storage' as const,
      description: 'Auto-download, Media quality',
    },
    {
      title: 'Help & Support',
      icon: <HelpCircle className="h-4 w-4 text-primary" />,
      overlay: 'settings-help' as const,
      description: 'FAQ, Contact, Terms',
    },
  ];

  return (
    <div className="flex h-full flex-col bg-background">
      <ScrollArea className="flex-1">
        {/* Profile header */}
        <div className="flex flex-col items-center pt-6 pb-4 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl sm:text-3xl font-bold">
                {getInitials(currentUser.displayName)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
            </button>
          </motion.div>

          {/* Display name (editable) */}
          <div className="mt-3 flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-8 text-center text-base font-semibold w-40 sm:w-48"
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
                <h2 className="text-lg sm:text-xl font-bold">{displayName}</h2>
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

          {/* Quick stats row */}
          <div className="flex items-center gap-4 sm:gap-6 mt-4">
            <button
              onClick={() => setTab('chats')}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Chats</span>
            </button>
            <button
              onClick={() => setTab('calls')}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Calls</span>
            </button>
            <button
              className="flex flex-col items-center gap-1 group"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Zaxo</span>
            </button>
            <button
              className="flex flex-col items-center gap-1 group"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Starred</span>
            </button>
          </div>
        </div>

        <Separator />

        {/* Settings Navigation */}
        <div className="py-2">
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Settings
            </span>
          </div>

          {/* Full Settings Page Link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOverlay('settings')}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent/50 transition-colors cursor-pointer active:bg-accent/70 mx-2 rounded-xl bg-primary/5"
          >
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Settings className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold">All Settings</span>
              <p className="text-xs text-muted-foreground">View all settings in one place</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </motion.div>
        </div>

        <Separator />

        {/* Individual Settings Sections */}
        <div className="py-2">
          {settingsSections.map((section, i) => (
            <SettingItem
              key={section.title}
              icon={section.icon}
              label={section.title}
              value={section.description}
              onClick={() => setOverlay(section.overlay)}
              delay={i * 0.05}
            />
          ))}
        </div>

        <Separator />

        {/* Quick toggles */}
        <div className="py-2">
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Toggles
            </span>
          </div>

          <SettingItem
            icon={themeIcon()}
            label="Theme"
            value={theme.charAt(0).toUpperCase() + theme.slice(1)}
            onClick={() => setOverlay('settings-appearance')}
          />

          <SettingItem
            icon={<Fingerprint className="h-4 w-4 text-primary" />}
            label="App Lock"
            value="Set up app lock"
            onClick={() => setOverlay('settings-security')}
          />
        </div>

        <Separator />

        {/* App version & info */}
        <div className="px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Zaxo Messenger</span>
          </div>
          <p className="text-xs text-muted-foreground">Version 1.0.0 (Build 2025.06)</p>
          <p className="text-[10px] text-muted-foreground mt-1">Made with 💚 by the Zaxo Team</p>
        </div>
      </ScrollArea>
    </div>
  );
}
