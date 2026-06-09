'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Phone,
  QrCode,
  Eye,
  Camera,
  Users,
  Ban,
  Bell,
  MessageCircle,
  Volume2,
  Music,
  Moon,
  Sun,
  Monitor,
  Lock,
  Smartphone,
  Link2,
  Shield,
  FileText,
  Info,
  ChevronRight,
  Palette,
  BellRing,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/stores';

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onClick?: () => void;
}

function SettingRow({ icon, label, subtitle, rightElement, onClick }: SettingRowProps) {
  const hasInteractiveRight = rightElement !== undefined;
  return (
    <div
      onClick={hasInteractiveRight ? undefined : onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors text-left ${hasInteractiveRight ? '' : 'cursor-pointer'}`}
    >
      <div className="flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium block">{label}</span>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      {rightElement !== undefined ? (
        rightElement
      ) : (
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      )}
    </div>
  );
}

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <div className="py-2">
      <div className="px-4 py-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function SettingsView() {
  const { currentUser } = useAuthStore();
  const [onBack, setOnBack] = useState<(() => void) | null>(null);

  // Notification toggles
  const [messageNotif, setMessageNotif] = useState(true);
  const [groupNotif, setGroupNotif] = useState(true);
  const [callNotif, setCallNotif] = useState(true);

  // Privacy toggles
  const [lastSeen, setLastSeen] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(true);
  const [aboutVisible, setAboutVisible] = useState(true);

  // Appearance
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [chatWallpaper, setChatWallpaper] = useState('Default');

  // Security
  const [twoFA, setTwoFA] = useState(false);

  const handleBack = () => {
    // This would be connected to a navigation system in a real app
    // For now it's a placeholder
    window.history.back();
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>

      <ScrollArea className="flex-1">
        {/* Account Section */}
        <SettingSection title="Account">
          <SettingRow
            icon={<User className="h-5 w-5 text-primary" />}
            label="Profile"
            subtitle={currentUser?.displayName || 'Your profile'}
          />
          <SettingRow
            icon={<Phone className="h-5 w-5 text-primary" />}
            label="Phone number"
            subtitle="+1-555-0101"
          />
          <SettingRow
            icon={<QrCode className="h-5 w-5 text-primary" />}
            label="Zaxo number"
            subtitle={currentUser?.zaxoNumber || '—'}
          />
        </SettingSection>

        <Separator />

        {/* Privacy Section */}
        <SettingSection title="Privacy">
          <SettingRow
            icon={<Eye className="h-5 w-5 text-primary" />}
            label="Last seen"
            subtitle={lastSeen ? 'Everyone' : 'Nobody'}
            rightElement={
              <Switch checked={lastSeen} onCheckedChange={setLastSeen} />
            }
          />
          <SettingRow
            icon={<Camera className="h-5 w-5 text-primary" />}
            label="Profile photo"
            subtitle={profilePhoto ? 'Everyone' : 'Contacts only'}
            rightElement={
              <Switch checked={profilePhoto} onCheckedChange={setProfilePhoto} />
            }
          />
          <SettingRow
            icon={<Info className="h-5 w-5 text-primary" />}
            label="About"
            subtitle={aboutVisible ? 'Everyone' : 'Nobody'}
            rightElement={
              <Switch checked={aboutVisible} onCheckedChange={setAboutVisible} />
            }
          />
          <SettingRow
            icon={<Users className="h-5 w-5 text-primary" />}
            label="Groups"
            subtitle="Everyone can add you"
          />
          <SettingRow
            icon={<Ban className="h-5 w-5 text-destructive" />}
            label="Blocked contacts"
            subtitle="0 blocked"
          />
        </SettingSection>

        <Separator />

        {/* Notifications Section */}
        <SettingSection title="Notifications">
          <SettingRow
            icon={<MessageCircle className="h-5 w-5 text-primary" />}
            label="Message notifications"
            subtitle="Show previews, sounds"
            rightElement={
              <Switch checked={messageNotif} onCheckedChange={setMessageNotif} />
            }
          />
          <SettingRow
            icon={<Users className="h-5 w-5 text-primary" />}
            label="Group notifications"
            subtitle="Mentions, all messages"
            rightElement={
              <Switch checked={groupNotif} onCheckedChange={setGroupNotif} />
            }
          />
          <SettingRow
            icon={<BellRing className="h-5 w-5 text-primary" />}
            label="Call notifications"
            subtitle="Ring for incoming calls"
            rightElement={
              <Switch checked={callNotif} onCheckedChange={setCallNotif} />
            }
          />
          <SettingRow
            icon={<Volume2 className="h-5 w-5 text-primary" />}
            label="Notification tone"
            subtitle="Default"
          />
        </SettingSection>

        <Separator />

        {/* Appearance Section */}
        <SettingSection title="Appearance">
          <SettingRow
            icon={
              theme === 'light' ? (
                <Sun className="h-5 w-5 text-primary" />
              ) : theme === 'dark' ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Monitor className="h-5 w-5 text-primary" />
              )
            }
            label="Theme"
            subtitle={theme.charAt(0).toUpperCase() + theme.slice(1)}
            rightElement={
              <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`p-1.5 rounded-full transition-all ${
                      theme === t
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t === 'light' ? (
                      <Sun className="h-3.5 w-3.5" />
                    ) : t === 'dark' ? (
                      <Moon className="h-3.5 w-3.5" />
                    ) : (
                      <Monitor className="h-3.5 w-3.5" />
                    )}
                  </button>
                ))}
              </div>
            }
          />
          <SettingRow
            icon={<Palette className="h-5 w-5 text-primary" />}
            label="Chat wallpaper"
            subtitle={chatWallpaper}
            onClick={() => setChatWallpaper(chatWallpaper === 'Default' ? 'Dark' : 'Default')}
          />
        </SettingSection>

        <Separator />

        {/* Security Section */}
        <SettingSection title="Security">
          <SettingRow
            icon={<Lock className="h-5 w-5 text-primary" />}
            label="Two-Factor Authentication"
            subtitle={twoFA ? 'Enabled' : 'Disabled'}
            rightElement={
              <Switch checked={twoFA} onCheckedChange={setTwoFA} />
            }
          />
          <SettingRow
            icon={<Smartphone className="h-5 w-5 text-primary" />}
            label="Active sessions"
            subtitle="2 active sessions"
          />
          <SettingRow
            icon={<Link2 className="h-5 w-5 text-primary" />}
            label="Linked devices"
            subtitle="1 device linked"
          />
        </SettingSection>

        <Separator />

        {/* About Section */}
        <SettingSection title="About">
          <SettingRow
            icon={<Shield className="h-5 w-5 text-primary" />}
            label="Terms of Service"
          />
          <SettingRow
            icon={<FileText className="h-5 w-5 text-primary" />}
            label="Privacy Policy"
          />
          <SettingRow
            icon={<Info className="h-5 w-5 text-primary" />}
            label="App version"
            subtitle="Zaxo Messenger v1.0.0"
            rightElement={
              <span className="text-xs text-muted-foreground">Build 2025.06</span>
            }
          />
        </SettingSection>

        {/* Footer */}
        <div className="px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            Made with 💚 by the Zaxo Team
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}
