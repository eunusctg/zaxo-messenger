'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  HardDrive,
  Download,
  Trash2,
  HelpCircle,
  MessageSquare,
  BookOpen,
  ExternalLink,
  Fingerprint,
  Key,
  Check,
  AlertTriangle,
  Zap,
  Globe,
  Wifi,
  Database,
  Image as ImageIcon,
  Video,
  File,
  CircleDot,
  Settings,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSettingsStore, useAuthStore, useAppStore } from '@/stores';

// ========== Shared Components ==========

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}

function SettingRow({ icon, label, subtitle, rightElement, onClick, destructive }: SettingRowProps) {
  const hasInteractiveRight = rightElement !== undefined;
  return (
    <div
      onClick={hasInteractiveRight ? undefined : onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors text-left active:bg-accent/70 ${
        hasInteractiveRight ? '' : 'cursor-pointer'
      } ${destructive ? 'hover:bg-destructive/5' : ''}`}
    >
      <div className="flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium block ${destructive ? 'text-destructive' : ''}`}>{label}</span>
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="py-2"
    >
      <div className="px-4 py-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

function SectionHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 border-b px-3 sm:px-4 py-3 shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={onBack}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
}

// Visibility selector
function VisibilitySelector({
  value,
  onChange,
}: {
  value: 'everyone' | 'contacts' | 'nobody';
  onChange: (v: 'everyone' | 'contacts' | 'nobody') => void;
}) {
  const options: { id: 'everyone' | 'contacts' | 'nobody'; label: string }[] = [
    { id: 'everyone', label: 'Everyone' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'nobody', label: 'Nobody' },
  ];
  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium transition-all ${
            value === opt.id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ========== Privacy Settings ==========
function PrivacySettings({ onBack }: { onBack: () => void }) {
  const {
    lastSeenVisibility, profilePhotoVisibility, aboutVisibility,
    readReceipts, typingIndicators, groupAddPermission, blockedContacts,
    updateSetting,
  } = useSettingsStore();

  return (
    <div className="flex h-full flex-col bg-background">
      <SectionHeader title="Privacy" onBack={onBack} />
      <ScrollArea className="flex-1">
        <SettingSection title="Who can see my personal info">
          <SettingRow
            icon={<Eye className="h-5 w-5 text-primary" />}
            label="Last seen"
            subtitle={lastSeenVisibility === 'everyone' ? 'Everyone' : lastSeenVisibility === 'contacts' ? 'My contacts' : 'Nobody'}
            rightElement={
              <VisibilitySelector value={lastSeenVisibility} onChange={(v) => updateSetting('lastSeenVisibility', v)} />
            }
          />
          <SettingRow
            icon={<Camera className="h-5 w-5 text-primary" />}
            label="Profile photo"
            subtitle={profilePhotoVisibility === 'everyone' ? 'Everyone' : profilePhotoVisibility === 'contacts' ? 'My contacts' : 'Nobody'}
            rightElement={
              <VisibilitySelector value={profilePhotoVisibility} onChange={(v) => updateSetting('profilePhotoVisibility', v)} />
            }
          />
          <SettingRow
            icon={<Info className="h-5 w-5 text-primary" />}
            label="About"
            subtitle={aboutVisibility === 'everyone' ? 'Everyone' : aboutVisibility === 'contacts' ? 'My contacts' : 'Nobody'}
            rightElement={
              <VisibilitySelector value={aboutVisibility} onChange={(v) => updateSetting('aboutVisibility', v)} />
            }
          />
        </SettingSection>

        <Separator />

        <SettingSection title="Messaging">
          <SettingRow
            icon={<Check className="h-5 w-5 text-primary" />}
            label="Read receipts"
            subtitle="Show when you've read messages"
            rightElement={
              <Switch checked={readReceipts} onCheckedChange={(v) => updateSetting('readReceipts', v)} />
            }
          />
          <SettingRow
            icon={<MessageSquare className="h-5 w-5 text-primary" />}
            label="Typing indicators"
            subtitle="Show when you're typing"
            rightElement={
              <Switch checked={typingIndicators} onCheckedChange={(v) => updateSetting('typingIndicators', v)} />
            }
          />
          <SettingRow
            icon={<Users className="h-5 w-5 text-primary" />}
            label="Groups"
            subtitle={`Who can add you: ${groupAddPermission === 'everyone' ? 'Everyone' : groupAddPermission === 'contacts' ? 'My contacts' : 'Nobody'}`}
            rightElement={
              <VisibilitySelector value={groupAddPermission} onChange={(v) => updateSetting('groupAddPermission', v)} />
            }
          />
        </SettingSection>

        <Separator />

        <SettingSection title="Blocked">
          <SettingRow
            icon={<Ban className="h-5 w-5 text-destructive" />}
            label="Blocked contacts"
            subtitle={`${blockedContacts.length} blocked`}
          />
        </SettingSection>

        <Separator />

        <SettingSection title="Security">
          <SettingRow
            icon={<Fingerprint className="h-5 w-5 text-primary" />}
            label="Fingerprint lock"
            subtitle="Require biometric to open Zaxo"
            rightElement={
              <Switch checked={false} disabled />
            }
          />
        </SettingSection>

        <div className="h-8" />
      </ScrollArea>
    </div>
  );
}

// ========== Notification Settings ==========
function NotificationSettings({ onBack }: { onBack: () => void }) {
  const {
    messageNotifications, groupNotifications, callNotifications,
    notificationTone, notificationVibrate, notificationPreview,
    reactionNotifications, updateSetting,
  } = useSettingsStore();
  const [selectedTone, setSelectedTone] = useState(false);

  const tones = ['Default', 'Chime', 'Bell', 'Ping', 'None'];

  return (
    <div className="flex h-full flex-col bg-background">
      <SectionHeader title="Notifications" onBack={onBack} />
      <ScrollArea className="flex-1">
        <SettingSection title="Message notifications">
          <SettingRow
            icon={<MessageCircle className="h-5 w-5 text-primary" />}
            label="Message notifications"
            subtitle="Show notifications for new messages"
            rightElement={
              <Switch checked={messageNotifications} onCheckedChange={(v) => updateSetting('messageNotifications', v)} />
            }
          />
          <SettingRow
            icon={<Users className="h-5 w-5 text-primary" />}
            label="Group notifications"
            subtitle="Show notifications for group messages"
            rightElement={
              <Switch checked={groupNotifications} onCheckedChange={(v) => updateSetting('groupNotifications', v)} />
            }
          />
          <SettingRow
            icon={<Phone className="h-5 w-5 text-primary" />}
            label="Call notifications"
            subtitle="Ring for incoming calls"
            rightElement={
              <Switch checked={callNotifications} onCheckedChange={(v) => updateSetting('callNotifications', v)} />
            }
          />
          <SettingRow
            icon={<Sparkles className="h-5 w-5 text-primary" />}
            label="Reaction notifications"
            subtitle="Notify when someone reacts"
            rightElement={
              <Switch checked={reactionNotifications} onCheckedChange={(v) => updateSetting('reactionNotifications', v)} />
            }
          />
        </SettingSection>

        <Separator />

        <SettingSection title="Notification behavior">
          <SettingRow
            icon={<Volume2 className="h-5 w-5 text-primary" />}
            label="Notification tone"
            subtitle={notificationTone}
            onClick={() => setSelectedTone(!selectedTone)}
          />
          <AnimatePresence>
            {selectedTone && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-2 flex flex-wrap gap-2">
                  {tones.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => { updateSetting('notificationTone', tone); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        notificationTone === tone
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <SettingRow
            icon={<BellRing className="h-5 w-5 text-primary" />}
            label="Vibrate"
            subtitle="Vibrate on notification"
            rightElement={
              <Switch checked={notificationVibrate} onCheckedChange={(v) => updateSetting('notificationVibrate', v)} />
            }
          />
          <SettingRow
            icon={<Eye className="h-5 w-5 text-primary" />}
            label="Show preview"
            subtitle="Show message content in notification"
            rightElement={
              <Switch checked={notificationPreview} onCheckedChange={(v) => updateSetting('notificationPreview', v)} />
            }
          />
        </SettingSection>

        <div className="h-8" />
      </ScrollArea>
    </div>
  );
}

// ========== Appearance Settings ==========
function AppearanceSettings({ onBack }: { onBack: () => void }) {
  const {
    theme, fontSize, chatWallpaper, chatBubbleStyle, enterToSend, updateSetting,
  } = useSettingsStore();
  const [showWallpaperGrid, setShowWallpaperGrid] = useState(false);

  const wallpapers = ['Default', 'Dark', 'Gradient', 'Nature', 'Abstract', 'Minimal', 'Ocean', 'Sunset'];

  return (
    <div className="flex h-full flex-col bg-background">
      <SectionHeader title="Appearance" onBack={onBack} />
      <ScrollArea className="flex-1">
        <SettingSection title="Theme">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              {([
                { id: 'light' as const, icon: Sun, label: 'Light' },
                { id: 'dark' as const, icon: Moon, label: 'Dark' },
                { id: 'system' as const, icon: Monitor, label: 'System' },
              ]).map((t) => {
                const Icon = t.icon;
                return (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateSetting('theme', t.id)}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-xl p-3 sm:p-4 transition-all border-2 ${
                      theme === t.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${theme === t.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-medium ${theme === t.id ? 'text-primary' : 'text-muted-foreground'}`}>
                      {t.label}
                    </span>
                    {theme === t.id && (
                      <motion.div
                        layoutId="themeCheck"
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </SettingSection>

        <Separator />

        <SettingSection title="Font size">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              {([
                { id: 'small' as const, label: 'S', sample: 'Aa' },
                { id: 'medium' as const, label: 'M', sample: 'Aa' },
                { id: 'large' as const, label: 'L', sample: 'Aa' },
              ]).map((f) => (
                <button
                  key={f.id}
                  onClick={() => updateSetting('fontSize', f.id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl p-3 transition-all border-2 ${
                    fontSize === f.id
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <span className={`font-medium ${fontSize === f.id ? 'text-primary' : 'text-muted-foreground'} ${
                    f.id === 'small' ? 'text-xs' : f.id === 'medium' ? 'text-sm' : 'text-base'
                  }`}>
                    {f.sample}
                  </span>
                  <span className={`text-[10px] ${fontSize === f.id ? 'text-primary' : 'text-muted-foreground'}`}>
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </SettingSection>

        <Separator />

        <SettingSection title="Chat">
          <SettingRow
            icon={<Palette className="h-5 w-5 text-primary" />}
            label="Chat wallpaper"
            subtitle={chatWallpaper}
            onClick={() => setShowWallpaperGrid(!showWallpaperGrid)}
          />
          <AnimatePresence>
            {showWallpaperGrid && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-2 grid grid-cols-4 gap-2">
                  {wallpapers.map((wp) => (
                    <button
                      key={wp}
                      onClick={() => { updateSetting('chatWallpaper', wp); }}
                      className={`aspect-[3/4] rounded-lg border-2 transition-all flex items-center justify-center text-[10px] font-medium ${
                        chatWallpaper === wp
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-muted/50 text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      {wp}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <SettingRow
            icon={<MessageCircle className="h-5 w-5 text-primary" />}
            label="Chat bubble style"
            subtitle={chatBubbleStyle === 'rounded' ? 'Rounded' : 'Classic'}
            rightElement={
              <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
                <button
                  onClick={() => updateSetting('chatBubbleStyle', 'rounded')}
                  className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
                    chatBubbleStyle === 'rounded' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  Rounded
                </button>
                <button
                  onClick={() => updateSetting('chatBubbleStyle', 'classic')}
                  className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
                    chatBubbleStyle === 'classic' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  Classic
                </button>
              </div>
            }
          />
          <SettingRow
            icon={<Key className="h-5 w-5 text-primary" />}
            label="Enter sends message"
            subtitle="Press Enter to send, Shift+Enter for new line"
            rightElement={
              <Switch checked={enterToSend} onCheckedChange={(v) => updateSetting('enterToSend', v)} />
            }
          />
        </SettingSection>

        <div className="h-8" />
      </ScrollArea>
    </div>
  );
}

// ========== Security Settings ==========
function SecuritySettings({ onBack }: { onBack: () => void }) {
  const {
    twoFactorAuth, appLock, appLockTimeout, biometricUnlock,
    activeSessions, linkedDevices, updateSetting,
  } = useSettingsStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const timeoutOptions: { id: typeof appLockTimeout; label: string }[] = [
    { id: 'immediately', label: 'Immediately' },
    { id: '1min', label: '1 minute' },
    { id: '5min', label: '5 minutes' },
    { id: '15min', label: '15 minutes' },
    { id: '30min', label: '30 minutes' },
  ];

  return (
    <div className="flex h-full flex-col bg-background">
      <SectionHeader title="Security" onBack={onBack} />
      <ScrollArea className="flex-1">
        <SettingSection title="Authentication">
          <SettingRow
            icon={<Lock className="h-5 w-5 text-primary" />}
            label="Two-Factor Authentication"
            subtitle={twoFactorAuth ? 'Enabled - Extra layer of security' : 'Disabled - Add extra security'}
            rightElement={
              <Switch checked={twoFactorAuth} onCheckedChange={(v) => updateSetting('twoFactorAuth', v)} />
            }
          />
          {twoFactorAuth && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-4 py-2"
            >
              <div className="bg-emerald-500/10 rounded-lg p-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-600">Two-factor authentication is active. Your account is protected.</p>
              </div>
            </motion.div>
          )}
          <SettingRow
            icon={<Smartphone className="h-5 w-5 text-primary" />}
            label="App lock"
            subtitle="Require authentication to open Zaxo"
            rightElement={
              <Switch checked={appLock} onCheckedChange={(v) => updateSetting('appLock', v)} />
            }
          />
          {appLock && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden"
            >
              <div className="px-4 py-2">
                <span className="text-xs text-muted-foreground mb-2 block">Lock timeout</span>
                <div className="flex flex-wrap gap-2">
                  {timeoutOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateSetting('appLockTimeout', opt.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        appLockTimeout === opt.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <SettingRow
            icon={<Fingerprint className="h-5 w-5 text-primary" />}
            label="Biometric unlock"
            subtitle="Use fingerprint or face to unlock"
            rightElement={
              <Switch checked={biometricUnlock} onCheckedChange={(v) => updateSetting('biometricUnlock', v)} />
            }
          />
        </SettingSection>

        <Separator />

        <SettingSection title="Sessions">
          <SettingRow
            icon={<Smartphone className="h-5 w-5 text-primary" />}
            label="Active sessions"
            subtitle={`${activeSessions.length} active session${activeSessions.length !== 1 ? 's' : ''}`}
          />
          <div className="px-4 py-1">
            {activeSessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0"
              >
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.device}</p>
                  <p className="text-[10px] text-muted-foreground">{session.location} · {session.lastActive}</p>
                </div>
                {session.id !== '1' && (
                  <Button variant="ghost" size="sm" className="text-destructive text-xs shrink-0 h-7">
                    Revoke
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </SettingSection>

        <Separator />

        <SettingSection title="Linked devices">
          <SettingRow
            icon={<Link2 className="h-5 w-5 text-primary" />}
            label="Linked devices"
            subtitle={`${linkedDevices.length} device${linkedDevices.length !== 1 ? 's' : ''} linked`}
          />
          <div className="px-4 py-1">
            {linkedDevices.map((device) => (
              <div key={device.id} className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{device.name}</p>
                  <p className="text-[10px] text-muted-foreground">{device.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </SettingSection>

        <div className="h-8" />
      </ScrollArea>
    </div>
  );
}

// ========== Storage & Data Settings ==========
function StorageSettings({ onBack }: { onBack: () => void }) {
  const {
    autoDownloadPhotos, autoDownloadAudio, autoDownloadVideo,
    autoDownloadDocuments, lowDataMode, mediaUploadQuality, updateSetting,
  } = useSettingsStore();

  // Simulated storage data
  const storageUsed = 2.4; // GB
  const storageTotal = 8; // GB
  const storagePercent = (storageUsed / storageTotal) * 100;

  const mediaBreakdown = [
    { label: 'Photos', size: '1.2 GB', color: 'bg-primary', percent: 50 },
    { label: 'Videos', size: '0.8 GB', color: 'bg-blue-500', percent: 33 },
    { label: 'Audio', size: '0.3 GB', color: 'bg-amber-500', percent: 12 },
    { label: 'Documents', size: '0.1 GB', color: 'bg-emerald-500', percent: 5 },
  ];

  return (
    <div className="flex h-full flex-col bg-background">
      <SectionHeader title="Storage & Data" onBack={onBack} />
      <ScrollArea className="flex-1">
        <SettingSection title="Storage usage">
          <div className="px-4 py-3">
            {/* Storage bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>{storageUsed} GB used</span>
                <span>{storageTotal} GB total</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${storagePercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
            {/* Breakdown */}
            <div className="space-y-2">
              {mediaBreakdown.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${item.color} shrink-0`} />
                  <span className="text-xs flex-1">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.size}</span>
                </div>
              ))}
            </div>
          </div>
          <SettingRow
            icon={<Trash2 className="h-5 w-5 text-destructive" />}
            label="Clear cache"
            subtitle="Free up storage space"
          />
        </SettingSection>

        <Separator />

        <SettingSection title="Auto-download media">
          <SettingRow
            icon={<ImageIcon className="h-5 w-5 text-primary" />}
            label="Photos"
            subtitle="Auto-download received photos"
            rightElement={
              <Switch checked={autoDownloadPhotos} onCheckedChange={(v) => updateSetting('autoDownloadPhotos', v)} />
            }
          />
          <SettingRow
            icon={<Video className="h-5 w-5 text-primary" />}
            label="Videos"
            subtitle="Auto-download received videos"
            rightElement={
              <Switch checked={autoDownloadVideo} onCheckedChange={(v) => updateSetting('autoDownloadVideo', v)} />
            }
          />
          <SettingRow
            icon={<Music className="h-5 w-5 text-primary" />}
            label="Audio"
            subtitle="Auto-download received audio"
            rightElement={
              <Switch checked={autoDownloadAudio} onCheckedChange={(v) => updateSetting('autoDownloadAudio', v)} />
            }
          />
          <SettingRow
            icon={<File className="h-5 w-5 text-primary" />}
            label="Documents"
            subtitle="Auto-download received documents"
            rightElement={
              <Switch checked={autoDownloadDocuments} onCheckedChange={(v) => updateSetting('autoDownloadDocuments', v)} />
            }
          />
        </SettingSection>

        <Separator />

        <SettingSection title="Network">
          <SettingRow
            icon={<Wifi className="h-5 w-5 text-primary" />}
            label="Low data mode"
            subtitle="Reduce data usage on cellular"
            rightElement={
              <Switch checked={lowDataMode} onCheckedChange={(v) => updateSetting('lowDataMode', v)} />
            }
          />
          <SettingRow
            icon={<Globe className="h-5 w-5 text-primary" />}
            label="Media upload quality"
            subtitle={`Currently: ${mediaUploadQuality === 'auto' ? 'Auto' : mediaUploadQuality === 'best' ? 'Best quality' : 'Data saver'}`}
          />
          <div className="px-4 py-2">
            <div className="flex gap-2">
              {([
                { id: 'auto' as const, label: 'Auto' },
                { id: 'best' as const, label: 'Best' },
                { id: 'data-saver' as const, label: 'Saver' },
              ]).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateSetting('mediaUploadQuality', opt.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    mediaUploadQuality === opt.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </SettingSection>

        <div className="h-8" />
      </ScrollArea>
    </div>
  );
}

// ========== Account Settings ==========
function AccountSettings({ onBack }: { onBack: () => void }) {
  const { currentUser } = useAuthStore();
  const { displayName, about, phoneNumber, zaxoNumber, updateSetting } = useSettingsStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="flex h-full flex-col bg-background">
      <SectionHeader title="Account" onBack={onBack} />
      <ScrollArea className="flex-1">
        {/* Profile section */}
        <div className="flex flex-col items-center pt-4 pb-3 px-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Camera className="h-3.5 w-3.5 text-primary-foreground" />
            </button>
          </div>
        </div>

        <SettingSection title="Profile information">
          {isEditingName ? (
            <div className="px-4 py-3 flex items-center gap-2">
              <Input
                value={displayName}
                onChange={(e) => updateSetting('displayName', e.target.value)}
                className="h-9 text-sm"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingName(false); }}
              />
              <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={() => setIsEditingName(false)}>
                <Check className="h-4 w-4 text-primary" />
              </Button>
            </div>
          ) : (
            <SettingRow
              icon={<User className="h-5 w-5 text-primary" />}
              label="Display name"
              subtitle={displayName}
              onClick={() => setIsEditingName(true)}
            />
          )}
          {isEditingAbout ? (
            <div className="px-4 py-3 flex items-center gap-2">
              <Input
                value={about}
                onChange={(e) => updateSetting('about', e.target.value)}
                className="h-9 text-sm"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingAbout(false); }}
              />
              <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0" onClick={() => setIsEditingAbout(false)}>
                <Check className="h-4 w-4 text-primary" />
              </Button>
            </div>
          ) : (
            <SettingRow
              icon={<Info className="h-5 w-5 text-primary" />}
              label="About"
              subtitle={about}
              onClick={() => setIsEditingAbout(true)}
            />
          )}
        </SettingSection>

        <Separator />

        <SettingSection title="Phone & Zaxo">
          <SettingRow
            icon={<Phone className="h-5 w-5 text-primary" />}
            label="Phone number"
            subtitle={phoneNumber}
            rightElement={<Lock className="h-3.5 w-3.5 text-muted-foreground" />}
          />
          <SettingRow
            icon={<QrCode className="h-5 w-5 text-primary" />}
            label="Zaxo number"
            subtitle={zaxoNumber}
            rightElement={<Lock className="h-3.5 w-3.5 text-muted-foreground" />}
          />
        </SettingSection>

        <Separator />

        <SettingSection title="Data">
          <SettingRow
            icon={<Database className="h-5 w-5 text-primary" />}
            label="Request account info"
            subtitle="Download a copy of your data"
          />
        </SettingSection>

        <Separator />

        <SettingSection title="Danger zone">
          <SettingRow
            icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
            label="Delete my account"
            subtitle="Permanently delete your account and data"
            destructive
            onClick={() => setShowDeleteConfirm(true)}
          />
        </SettingSection>

        {/* Delete confirmation dialog */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-card rounded-2xl p-6 shadow-2xl border border-border max-w-sm w-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Delete Account?</h3>
                    <p className="text-xs text-muted-foreground">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Your account, messages, calls, and all data will be permanently deleted. This cannot be recovered.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                    Delete
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-8" />
      </ScrollArea>
    </div>
  );
}

// ========== Help & Support Settings ==========
function HelpSettings({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full flex-col bg-background">
      <SectionHeader title="Help & Support" onBack={onBack} />
      <ScrollArea className="flex-1">
        <SettingSection title="Help">
          <SettingRow
            icon={<HelpCircle className="h-5 w-5 text-primary" />}
            label="FAQ"
            subtitle="Frequently asked questions"
          />
          <SettingRow
            icon={<MessageCircle className="h-5 w-5 text-primary" />}
            label="Contact support"
            subtitle="Get help from our team"
          />
          <SettingRow
            icon={<BookOpen className="h-5 w-5 text-primary" />}
            label="User guide"
            subtitle="Learn how to use Zaxo"
          />
        </SettingSection>

        <Separator />

        <SettingSection title="Legal">
          <SettingRow
            icon={<Shield className="h-5 w-5 text-primary" />}
            label="Terms of Service"
            rightElement={<ExternalLink className="h-4 w-4 text-muted-foreground" />}
          />
          <SettingRow
            icon={<FileText className="h-5 w-5 text-primary" />}
            label="Privacy Policy"
            rightElement={<ExternalLink className="h-4 w-4 text-muted-foreground" />}
          />
          <SettingRow
            icon={<Lock className="h-5 w-5 text-primary" />}
            label="Cookie Policy"
            rightElement={<ExternalLink className="h-4 w-4 text-muted-foreground" />}
          />
        </SettingSection>

        <Separator />

        <SettingSection title="About">
          <SettingRow
            icon={<Zap className="h-5 w-5 text-primary" />}
            label="App version"
            subtitle="Zaxo Messenger v1.0.0"
            rightElement={
              <span className="text-xs text-muted-foreground">Build 2025.06</span>
            }
          />
          <SettingRow
            icon={<Globe className="h-5 w-5 text-primary" />}
            label="Open source licenses"
            subtitle="View third-party licenses"
          />
        </SettingSection>

        <div className="px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">Zaxo Messenger</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Made with 💚 by the Zaxo Team</p>
        </div>
      </ScrollArea>
    </div>
  );
}

// ========== All Settings Hub ==========
function AllSettingsHub({ onBack }: { onBack: () => void }) {
  const { setOverlay } = useAppStore();
  const { twoFactorAuth, theme, readReceipts, messageNotifications, appLock } = useSettingsStore();

  const settingsGroups = [
    {
      title: 'Account & Privacy',
      items: [
        {
          icon: <User className="h-5 w-5 text-primary" />,
          label: 'Account',
          subtitle: 'Profile, Phone, Zaxo number',
          overlay: 'settings-account' as const,
          badge: null,
        },
        {
          icon: <Eye className="h-5 w-5 text-primary" />,
          label: 'Privacy',
          subtitle: 'Last seen, Read receipts, Groups',
          overlay: 'settings-privacy' as const,
          badge: readReceipts ? null : 'Off',
        },
      ],
    },
    {
      title: 'Notifications & Appearance',
      items: [
        {
          icon: <Bell className="h-5 w-5 text-primary" />,
          label: 'Notifications',
          subtitle: 'Messages, Groups, Calls',
          overlay: 'settings-notifications' as const,
          badge: messageNotifications ? null : 'Off',
        },
        {
          icon: <Palette className="h-5 w-5 text-primary" />,
          label: 'Appearance',
          subtitle: `Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
          overlay: 'settings-appearance' as const,
          badge: null,
        },
      ],
    },
    {
      title: 'Security & Data',
      items: [
        {
          icon: <Shield className="h-5 w-5 text-primary" />,
          label: 'Security',
          subtitle: twoFactorAuth ? '2FA enabled' : '2FA disabled',
          overlay: 'settings-security' as const,
          badge: twoFactorAuth ? '🔒' : null,
        },
        {
          icon: <HardDrive className="h-5 w-5 text-primary" />,
          label: 'Storage & Data',
          subtitle: '2.4 GB used · Auto-download',
          overlay: 'settings-storage' as const,
          badge: null,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: <HelpCircle className="h-5 w-5 text-primary" />,
          label: 'Help & Support',
          subtitle: 'FAQ, Contact, Terms',
          overlay: 'settings-help' as const,
          badge: null,
        },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col bg-background">
      <SectionHeader title="Settings" onBack={onBack} />
      <ScrollArea className="flex-1">
        {settingsGroups.map((group, gi) => (
          <div key={group.title}>
            <SettingSection title={group.title}>
              {group.items.map((item, ii) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: gi * 0.1 + ii * 0.05 }}
                >
                  <SettingRow
                    icon={item.icon}
                    label={item.label}
                    subtitle={item.subtitle}
                    onClick={() => setOverlay(item.overlay)}
                    rightElement={
                      item.badge ? (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {item.badge}
                        </Badge>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      )
                    }
                  />
                </motion.div>
              ))}
            </SettingSection>
            {gi < settingsGroups.length - 1 && <Separator />}
          </div>
        ))}

        <div className="px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">Zaxo Messenger v1.0.0</p>
        </div>
      </ScrollArea>
    </div>
  );
}

// ========== Main SettingsView Component ==========
export default function SettingsView({
  section,
  onBack,
}: {
  section: string;
  onBack: () => void;
}) {
  const { setOverlay } = useAppStore();

  const handleBack = () => {
    onBack();
  };

  switch (section) {
    case 'privacy':
      return <PrivacySettings onBack={handleBack} />;
    case 'notifications':
      return <NotificationSettings onBack={handleBack} />;
    case 'appearance':
      return <AppearanceSettings onBack={handleBack} />;
    case 'security':
      return <SecuritySettings onBack={handleBack} />;
    case 'storage':
      return <StorageSettings onBack={handleBack} />;
    case 'account':
      return <AccountSettings onBack={handleBack} />;
    case 'help':
      return <HelpSettings onBack={handleBack} />;
    case 'all':
    default:
      return <AllSettingsHub onBack={handleBack} />;
  }
}
