'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Phone, QrCode, User,
  LayoutDashboard, Users, Hash, Shield, Settings,
  PhoneCall, FileText, Bell, ArrowLeftRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore, useAuthStore, useChatStore, useCallStore } from '@/stores';
import { mockChats, mockMessages, mockCallHistory } from '@/lib/mock-data';

// User App Components
import ChatList from '@/components/user/ChatList';
import ChatView from '@/components/user/ChatView';
import CallHistory from '@/components/user/CallHistory';
import CallScreen from '@/components/user/CallScreen';
import QRCodeView from '@/components/user/QRCodeView';
import QRScanner from '@/components/user/QRScanner';
import ProfileView from '@/components/user/ProfileView';
import SettingsView from '@/components/user/SettingsView';

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
  { id: 'qr' as const, icon: QrCode, label: 'QR' },
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

// ========== App Switcher ==========
function AppSwitcher() {
  const { currentApp, setApp, setTab } = useAppStore();

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
      <button
        onClick={() => setApp('user')}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
          currentApp === 'user'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Zaxo
      </button>
      <button
        onClick={() => setApp('admin')}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
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

// ========== User App ==========
function UserApp() {
  const { currentTab, setTab } = useAppStore();
  const { activeChat, setActiveChat } = useChatStore();
  const { activeCall } = useCallStore();
  const { currentUser } = useAuthStore();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize mock data
  useEffect(() => {
    const { chats, setChats, setMessages, callHistory, setCallHistory } = useChatStore.getState();
    if (chats.length === 0) {
      setChats(mockChats);
      Object.entries(mockMessages).forEach(([chatId, msgs]) => {
        setMessages(chatId, msgs);
      });
    }
    const callStore = useCallStore.getState();
    if (callStore.callHistory.length === 0) {
      callStore.setCallHistory(mockCallHistory);
    }
  }, []);

  // Determine if we're viewing a chat on mobile
  const isViewingChat = currentTab === 'chats' && activeChat !== null;

  const renderContent = () => {
    if (showSettings) {
      return <SettingsView />;
    }

    if (showQRScanner) {
      return <QRScanner />;
    }

    switch (currentTab) {
      case 'chats':
        return (
          <div className="flex h-full">
            {/* Chat list - hidden on mobile when viewing a chat */}
            <div className={`${isViewingChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-border`}>
              <ChatList />
            </div>
            {/* Chat view */}
            <div className={`${isViewingChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
              <ChatView />
            </div>
          </div>
        );
      case 'calls':
        return <CallHistory />;
      case 'qr':
        return <QRCodeView />;
      case 'profile':
        return <ProfileView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MessageCircle className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Zaxo</span>
        </div>
        <AppSwitcher />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab + (showSettings ? '-settings' : '') + (showQRScanner ? '-scanner' : '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation - hidden on desktop when viewing chats */}
      {!(currentTab === 'chats' && activeChat !== null) && (
        <div className="flex items-center justify-around border-t border-border bg-background px-2 py-1 md:py-2">
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
                className={`flex flex-col items-center gap-0.5 rounded-lg px-4 py-1.5 transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
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
      {isViewingChat && (
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
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-card transition-all duration-200 ${
          sidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Logo */}
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

        {/* Nav items */}
        <nav className="flex-1 space-y-1 p-2">
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
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && !sidebarCollapsed && (
                  <motion.div
                    layoutId="adminNavIndicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
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

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
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

        {/* Content */}
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
            className="relative flex w-64 flex-col bg-card shadow-xl"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Settings className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Zaxo Admin</span>
            </div>
            <nav className="flex-1 space-y-1 p-2">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTab(item.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
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

  return (
    <div className="h-screen w-screen overflow-hidden">
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
