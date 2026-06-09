'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Globe, Send, Check, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function ContactUs({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
        <h1 className="text-lg font-semibold">Contact Us</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"
            >
              <MessageCircle className="h-7 w-7 text-primary" />
            </motion.div>
            <h2 className="text-xl font-bold">Get in Touch</h2>
            <p className="text-sm text-muted-foreground mt-1">We would love to hear from you</p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">support@zaxo.eu.cc</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Website</p>
                <p className="text-sm font-medium text-primary">zaxo.eu.cc</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Contact Form */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Thank you for reaching out. We will get back to you as soon as possible.
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-semibold">Send a Message</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-10"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-10"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Subject</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help?"
                    className="h-10"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us more..."
                    rows={4}
                    className="w-full rounded-xl bg-muted/50 border-none px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gap-2 h-11">
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </form>
          )}

          {/* Social Links */}
          <Separator className="my-6" />
          <div className="text-center pb-4">
            <p className="text-xs text-muted-foreground mb-2">Follow us</p>
            <div className="flex items-center justify-center gap-3">
              {['Twitter', 'GitHub', 'Discord'].map((platform) => (
                <div
                  key={platform}
                  className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                >
                  {platform[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
