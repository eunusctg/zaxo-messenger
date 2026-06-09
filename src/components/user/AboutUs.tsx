'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Phone, Monitor, Users, Lock, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function AboutUs({ onClose }: { onClose: () => void }) {
  const features = [
    { icon: <Lock className="h-5 w-5 text-primary" />, title: 'End-to-End Encryption', desc: 'Every message, call, and file is secured with military-grade encryption. No one, not even Zaxo, can read your conversations.' },
    { icon: <Phone className="h-5 w-5 text-primary" />, title: 'HD Voice & Video Calls', desc: 'Crystal-clear audio and HD video calls with up to 32 participants. AI-powered noise cancellation for pristine call quality.' },
    { icon: <Monitor className="h-5 w-5 text-primary" />, title: 'Cross-Platform', desc: 'Available on iOS, Android, Windows, macOS, and web. Your conversations sync seamlessly across all your devices.' },
    { icon: <ShieldCheck className="h-5 w-5 text-primary" />, title: 'Privacy-First', desc: 'We believe privacy is a fundamental right. No ads, no data selling, no tracking. Your data belongs to you.' },
  ];

  const stats = [
    { value: '128K+', label: 'Active Users' },
    { value: '8M+', label: 'Messages Daily' },
    { value: '99.9%', label: 'Uptime' },
    { value: '150+', label: 'Countries' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col bg-background min-h-0"
    >
      <div className="flex items-center gap-3 border-b px-3 sm:px-4 py-3 shrink-0 bg-background/95 backdrop-blur">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">About Zaxo</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Hero */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg"
            >
              <Globe className="h-10 w-10 text-primary-foreground" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Zaxo Messenger</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Secure, private, and reliable messaging for everyone
            </p>
            <p className="text-xs text-primary font-medium mt-1">zaxo.eu.cc</p>
          </div>

          {/* Mission */}
          <div className="bg-primary/5 rounded-xl p-4 sm:p-5 mb-6">
            <h3 className="text-base font-semibold mb-2">Our Mission</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              At Zaxo, we believe communication should be private, secure, and accessible to everyone. Our mission is to provide a messaging platform that respects your privacy while delivering a powerful, seamless experience. We are committed to building technology that empowers people to connect without compromise.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-card border border-border rounded-xl p-3 text-center"
              >
                <p className="text-lg sm:text-xl font-bold text-primary">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Features */}
          <div className="space-y-4 mb-6">
            <h3 className="text-base font-semibold">Key Features</h3>
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex gap-3"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Team & Company */}
          <div className="space-y-4 mb-6">
            <h3 className="text-base font-semibold">Company</h3>
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Company</span>
                <span className="text-sm font-medium">Zaxo Technologies</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Website</span>
                <span className="text-sm font-medium text-primary">zaxo.eu.cc</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Version</span>
                <span className="text-sm font-medium">1.0.0 (Build 2025.06)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Founded</span>
                <span className="text-sm font-medium">2025</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pb-6">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <Heart className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">Made with care by the Zaxo Team</span>
            </div>
            <p className="text-[10px] text-muted-foreground">zaxo.eu.cc — All rights reserved</p>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
