'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function TermsAndConditions({ onClose }: { onClose: () => void }) {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing or using Zaxo Messenger ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use the Service. These terms apply to all visitors, users, and others who access or use the Service. Zaxo Technologies reserves the right to update or modify these terms at any time without prior notice.',
    },
    {
      title: '2. User Accounts',
      content: 'To use certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 13 years old to create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. Zaxo Technologies reserves the right to suspend or terminate accounts that violate these terms.',
    },
    {
      title: '3. Acceptable Use',
      content: 'You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service. Prohibited activities include, but are not limited to: transmitting harmful or offensive content, impersonating others, spamming, distributing malware, violating intellectual property rights, harassing other users, and attempting to gain unauthorized access to any part of the Service or its related systems.',
    },
    {
      title: '4. Privacy',
      content: 'Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information when you use our Service. By using Zaxo Messenger, you consent to the collection and use of information in accordance with our Privacy Policy. We implement end-to-end encryption for messages and calls, and we do not sell your personal data to third parties.',
    },
    {
      title: '5. Intellectual Property',
      content: 'The Service and its original content, features, and functionality are owned by Zaxo Technologies and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain ownership of any content you submit, post, or display on or through the Service. By submitting content, you grant Zaxo Technologies a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute such content solely for the purpose of providing the Service.',
    },
    {
      title: '6. Termination',
      content: 'We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease. All provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.',
    },
    {
      title: '7. Disclaimers',
      content: 'The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Zaxo Technologies makes no warranties, expressed or implied, and hereby disclaims all warranties, including without limitation, implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will function uninterrupted, secure, or error-free.',
    },
    {
      title: '8. Limitation of Liability',
      content: 'In no event shall Zaxo Technologies, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.',
    },
    {
      title: '9. Changes to Terms',
      content: 'We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Continued use of the Service after any such changes constitutes acceptance of the new Terms.',
    },
    {
      title: '10. Contact',
      content: 'If you have any questions about these Terms, please contact us at support@zaxo.eu.cc or visit our website at zaxo.eu.cc.',
    },
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
        <h1 className="text-lg font-semibold">Terms & Conditions</h1>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3"
            >
              <FileText className="h-7 w-7 text-primary" />
            </motion.div>
            <h2 className="text-xl font-bold">Terms of Service</h2>
            <p className="text-xs text-muted-foreground mt-1">Last updated: June 9, 2025</p>
            <p className="text-xs text-primary font-medium mt-0.5">zaxo.eu.cc</p>
          </div>

          {/* Sections */}
          <div className="space-y-5">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.03 }}
              >
                <h3 className="text-sm font-semibold mb-1.5">{section.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{section.content}</p>
                {i < sections.length - 1 && <Separator className="mt-4" />}
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pb-4">
            <p className="text-[10px] text-muted-foreground">Zaxo Technologies — zaxo.eu.cc</p>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
