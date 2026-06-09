'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Phone, User,
  LayoutDashboard, Users, Hash, Shield, Settings,
  PhoneCall, FileText, Bell, ArrowLeftRight,
  Mail, Lock, Loader2, AlertCircle, UserPlus, Eye, EyeOff, Phone as PhoneIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore, useAuthStore, useChatStore, useCallStore, useStatusStore } from '@/stores';

// User App Components
import ChatList from '@/components/user/ChatList';
import ChatView from '@/components/user/ChatView';
import CallHistory from '@/components/user/CallHistory';
import CallScreen from '@/components/user/CallScreen';
import ProfileView from '@/components/user/ProfileView';
import SettingsView from '@/components/user/SettingsView';

// WhatsApp Feature Components
import StatusView from '@/components/user/StatusView';
import StatusViewer from '@/components/user/StatusViewer';
import ContactsScreen from '@/components/user/ContactsScreen';
import NewGroupScreen from '@/components/user/NewGroupScreen';
import BroadcastScreen from '@/components/user/BroadcastScreen';
import VoiceRecorder from '@/components/user/VoiceRecorder';
import MessageActions from '@/components/user/MessageActions';
import StickerEmojiPicker from '@/components/user/StickerEmojiPicker';
import MediaGallery from '@/components/user/MediaGallery';
import ChatWallpaper from '@/components/user/ChatWallpaper';
import AppLockScreen from '@/components/user/AppLockScreen';
import E2EInfo from '@/components/user/E2EInfo';

// New Pages
import AboutUs from '@/components/user/AboutUs';
import ContactUs from '@/components/user/ContactUs';
import TermsAndConditions from '@/components/user/TermsAndConditions';
import PrivacyPolicy from '@/components/user/PrivacyPolicy';

// Admin App Components
import Dashboard from '@/components/admin/Dashboard';
import UserManagement from '@/components/admin/UserManagement';
import ZaxoNumberAdmin from '@/components/admin/ZaxoNumberAdmin';
import ContentModeration from '@/components/admin/ContentModeration';
import SystemConfig from '@/components/admin/SystemConfig';
import CallingInfra from '@/components/admin/CallingInfra';
import LoggingAudit from '@/components/admin/LoggingAudit';
import NotificationManager from '@/components/admin/NotificationManager';

// ========== User App Bottom Nav Items ==========
const userNavItems = [
  { id: 'chats' as const, icon: MessageCircle, label: 'Chats' },
  { id: 'calls' as const, icon: Phone, label: 'Calls' },
  { id: 'profile' as const, icon: User, label: 'Profile' },
];

// ========== Admin Sidebar Items ==========
const adminNavItems = [
  { id: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'users' as const, icon: Users, label: 'Users' },
  { id: 'zaxo-numbers' as const, icon: Hash, label: 'Zaxo Numbers' },
  { id: 'moderation' as const, icon: Shield, label: 'Moderation' },
  { id: 'config' as const, icon: Settings, label: 'System Config' },
  { id: 'calling' as const, icon: PhoneCall, label: 'Calling Infra' },
  { id: 'logs' as const, icon: FileText, label: 'Audit Logs' },
  { id: 'notifications' as const, icon: Bell, label: 'Notifications' },
];

// ========== Login Screen ==========
function LoginScreen({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="h-dvh w-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg"
          >
            <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-foreground"
          >
            Zaxo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground mt-1"
          >
            Secure Messenger
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
                required
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-3 py-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-primary font-semibold hover:underline"
            >
              Create Account
            </button>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-muted-foreground">
            End-to-end encrypted messaging
          </p>
          <p className="text-[10px] text-muted-foreground mt-2">
            zaxo.eu.cc
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ========== Registration Screen ==========
function RegistrationScreen({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { register } = useAuthStore();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!displayName.trim()) {
      setError('Display name is required');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);

    const result = await register({
      displayName: displayName.trim(),
      email: email.trim(),
      password,
      phoneNumber: phoneNumber.trim(),
    });

    if (!result.success) {
      setError(result.error || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="h-dvh w-screen flex items-center justify-center bg-background p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm py-6"
      >
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary flex items-center justify-center mb-3 shadow-lg"
          >
            <UserPlus className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-foreground"
          >
            Create Account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground mt-1"
          >
            Join Zaxo Messenger
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          onSubmit={handleRegister}
          className="space-y-3"
        >
          {/* Display Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="pl-10 h-11"
              required
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11"
              required
              autoComplete="email"
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="Phone number (e.g. +1-555-0102)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="pl-10 h-11"
              required
              autoComplete="tel"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10 h-11"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-3 py-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="text-[10px] text-muted-foreground px-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
            Your Zaxo number will be assigned automatically.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ========== App Switcher ==========
function AppSwitcher() {
  const { currentApp, setApp } = useAppStore();

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
      <button
        onClick={() => setApp('user')}
        className={`rounded-full px-3 sm:px-4 py-1.5 text-sm font-medium transition-all ${
          currentApp === 'user'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Zaxo
      </button>
      <button
        onClick={() => setApp('admin')}
        className={`rounded-full px-3 sm:px-4 py-1.5 text-sm font-medium transition-all ${
          currentApp === 'admin'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Admin
      </button>
    </div>
  );
}

// ========== Settings overlay helpers ==========
function getSettingsSection(overlay: string): string | null {
  if (overlay === 'settings') return 'all';
  if (overlay.startsWith('settings-')) return overlay.replace('settings-', '');
  return null;
}

// ========== User App ==========
function UserApp() {
  const { currentTab, setTab, overlay, setOverlay } = useAppStore();
  const { activeChat, setActiveChat } = useChatStore();
  const { activeCall } = useCallStore();
  const { isAppLocked } = useAuthStore();
  const { setContactStatuses } = useStatusStore();

  const [mediaGalleryMsg, setMediaGalleryMsg] = useState<{ url?: string; type: string; name: string; sender: string; time: string } | null>(null);

  // Determine if we're viewing a chat on mobile
  const isViewingChat = currentTab === 'chats' && activeChat !== null;
  const showBottomNav = !(currentTab === 'chats' && activeChat !== null) && overlay === 'none';

  const settingsSection = getSettingsSection(overlay);

  const renderContent = () => {
    // Settings overlays - full page with back navigation
    if (settingsSection) {
      return (
        <SettingsView
          section={settingsSection}
          onBack={() => setOverlay('none')}
        />
      );
    }

    // Overlay screens take priority
    switch (overlay) {
      case 'contacts':
        return <ContactsScreen onClose={() => setOverlay('none')} />;
      case 'new-group':
        return <NewGroupScreen onClose={() => setOverlay('none')} />;
      case 'new-broadcast':
        return <BroadcastScreen onClose={() => setOverlay('none')} />;
      case 'chat-wallpaper':
        return <ChatWallpaper onClose={() => setOverlay('none')} />;
      case 'e2e-info':
        return <E2EInfo onClose={() => setOverlay('none')} />;
      case 'voice-recorder':
        return (
          <div className="h-full flex flex-col">
            <ChatView onOpenMediaGallery={(m) => setMediaGalleryMsg(m)} />
            <VoiceRecorder
              onCancel={() => setOverlay('none')}
              onSend={() => setOverlay('none')}
            />
          </div>
        );
      case 'about-us':
        return <AboutUs onClose={() => setOverlay('none')} />;
      case 'contact-us':
        return <ContactUs onClose={() => setOverlay('none')} />;
      case 'terms':
        return <TermsAndConditions onClose={() => setOverlay('none')} />;
      case 'privacy-policy':
        return <PrivacyPolicy onClose={() => setOverlay('none')} />;
      default:
        break;
    }

    switch (currentTab) {
      case 'chats':
        return (
          <div className="flex h-full min-h-0">
            <div className={`${isViewingChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col min-h-0 border-r border-border`}>
              <ChatList onNewChat={() => setOverlay('contacts')} />
            </div>
            <div className={`${isViewingChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-h-0`}>
              <ChatView
                onOpenMediaGallery={(m) => setMediaGalleryMsg(m)}
                onOpenWallpaper={() => setOverlay('chat-wallpaper')}
                onOpenE2EInfo={() => setOverlay('e2e-info')}
                onOpenVoiceRecorder={() => setOverlay('voice-recorder')}
              />
            </div>
          </div>
        );
      case 'calls':
        return <CallHistory />;
      case 'profile':
        return <ProfileView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col bg-background overflow-hidden min-h-0">
      {/* App Lock Screen */}
      {isAppLocked && <AppLockScreen />}

      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-3 sm:px-4 py-2 shrink-0 z-10 bg-background">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MessageCircle className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Zaxo</span>
        </div>
        <AppSwitcher />
      </div>

      {/* Main content - scrollable area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab + overlay}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="h-full min-h-0"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      {showBottomNav && (
        <div className="flex items-center justify-around border-t border-border bg-background px-1 py-1 md:py-2 safe-bottom shrink-0">
          {userNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  if (item.id !== 'chats') setActiveChat(null);
                }}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-all min-w-[56px] ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="userNavIndicator"
                    className="h-0.5 w-4 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile back button for chat view */}
      {isViewingChat && overlay === 'none' && (
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveChat(null)}
            className="fixed bottom-4 left-4 z-50 gap-1 rounded-full bg-background/90 px-3 py-2 shadow-lg backdrop-blur-sm border border-border"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Chats
          </Button>
        </div>
      )}

      {/* Call Screen Overlay */}
      {activeCall && <CallScreen />}

      {/* Media Gallery Overlay */}
      {mediaGalleryMsg && (
        <MediaGallery
          media={mediaGalleryMsg}
          onClose={() => setMediaGalleryMsg(null)}
        />
      )}
    </div>
  );
}

// ========== Admin App ==========
function AdminApp() {
  const { currentTab, setTab } = useAppStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <UserManagement />;
      case 'zaxo-numbers': return <ZaxoNumberAdmin />;
      case 'moderation': return <ContentModeration />;
      case 'config': return <SystemConfig />;
      case 'calling': return <CallingInfra />;
      case 'logs': return <LoggingAudit />;
      case 'notifications': return <NotificationManager />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-full bg-background overflow-hidden min-h-0">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-card transition-all duration-200 shrink-0 ${
          sidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Settings className="h-4 w-4 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold text-foreground whitespace-nowrap"
            >
              Zaxo Admin
            </motion.span>
          )}
        </div>
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
                    {item.label}
                  </motion.span>
                )}
                {isActive && !sidebarCollapsed && (
                  <motion.div layoutId="adminNavIndicator" className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-border p-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ArrowLeftRight className={`h-3.5 w-3.5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            {!sidebarCollapsed && 'Collapse'}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <header className="flex items-center justify-between border-b border-border bg-card px-3 sm:px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <AdminMobileNav />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {adminNavItems.find((i) => i.id === currentTab)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>
          <AppSwitcher />
        </header>
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ========== Admin Mobile Nav ==========
function AdminMobileNav() {
  const { currentTab, setTab } = useAppStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="h-8 w-8">
        <Settings className="h-4 w-4" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="relative flex w-64 max-w-[80vw] flex-col bg-card shadow-xl"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Settings className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Zaxo Admin</span>
            </div>
            <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setTab(item.id); setOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </motion.div>
        </div>
      )}
    </>
  );
}

// ========== Main Page ==========
export default function ZaxoApp() {
  const { currentApp } = useAppStore();
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [initialized, setInitialized] = useState(false);

  // Restore session on mount
  useEffect(() => {
    restoreSession().finally(() => setInitialized(true));
  }, []);

  if (!initialized || isLoading) {
    return (
      <div className="h-dvh w-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <MessageCircle className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authScreen === 'register') {
      return <RegistrationScreen onSwitchToLogin={() => setAuthScreen('login')} />;
    }
    return <LoginScreen onSwitchToRegister={() => setAuthScreen('register')} />;
  }

  return (
    <div className="h-dvh w-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentApp}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full"
        >
          {currentApp === 'user' ? <UserApp /> : <AdminApp />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
