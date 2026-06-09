'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicy({ onClose }: { onClose: () => void }) {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, such as your name, email address, phone number, and profile information when you create an account. We also collect information about your use of the Service, including device information, IP address, and log data. Messages and calls are end-to-end encrypted and cannot be read by Zaxo. We practice data minimization — we only collect what is necessary to provide the Service.',
    },
    {
      title: '2. How We Use Information',
      content: 'We use the information we collect to provide, maintain, and improve the Service, send you technical notices and support messages, respond to your comments and questions, monitor and analyze trends and usage, detect and prevent fraud and abuse, and facilitate contests and promotions. We do not use your personal data for advertising purposes or sell it to third parties.',
    },
    {
      title: '3. Information Sharing',
      content: 'We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating the Service (such as Cloudflare R2 for file storage and Firebase for push notifications), when required by law, to protect our rights, or with your explicit consent. All third-party service providers are bound by data protection agreements.',
    },
    {
      title: '4. Data Storage & Security',
      content: 'Your data is stored securely using industry-standard encryption and security measures. Messages and calls are protected with end-to-end encryption (E2EE), meaning only you and the intended recipient can access the content. We use Cloudflare R2 for media storage and Firebase for infrastructure services. We regularly audit our security practices and implement the latest protections.',
    },
    {
      title: '5. Your Rights',
      content: 'You have the right to access, update, or delete your personal information at any time. You can export your data from the Settings menu. You may also request deletion of your account and all associated data. We will respond to such requests within 30 days. If you believe your data has been processed unlawfully, you have the right to lodge a complaint with a supervisory authority.',
    },
    {
      title: '6. Cookies',
      content: 'We use cookies and similar technologies to provide and improve the Service. Essential cookies are necessary for the Service to function properly. Analytics cookies help us understand how you use the Service. You can manage your cookie preferences through your browser settings. We do not use tracking cookies from third-party advertisers.',
    },
    {
      title: '7. Third-Party Services',
      content: 'The Service may contain links to third-party websites or services that are not owned or controlled by Zaxo Technologies. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. We encourage you to read the privacy policies of any third-party services you access.',
    },
    {
      title: '8. Children\'s Privacy',
      content: 'The Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete such information immediately. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.',
    },
    {
      title: '9. Changes to This Policy',
      content: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.',
    },
    {
      title: '10. Contact',
      content: 'If you have any questions about this Privacy Policy, please contact us at support@zaxo.eu.cc or visit our website at zaxo.eu.cc. We are committed to addressing any concerns you may have about your privacy and the handling of your personal data.',
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
        <h1 className="text-lg font-semibold">Privacy Policy</h1>
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
              <Shield className="h-7 w-7 text-primary" />
            </motion.div>
            <h2 className="text-xl font-bold">Privacy Policy</h2>
            <p className="text-xs text-muted-foreground mt-1">Last updated: June 9, 2025</p>
            <p className="text-xs text-primary font-medium mt-0.5">zaxo.eu.cc</p>
          </div>

          {/* Key highlights */}
          <div className="bg-primary/5 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-xs font-medium text-primary">Your Privacy Highlights</p>
            <div className="flex items-start gap-2">
              <span className="text-primary text-xs">•</span>
              <p className="text-xs text-muted-foreground">End-to-end encryption for all messages and calls</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary text-xs">•</span>
              <p className="text-xs text-muted-foreground">Data minimization — we only collect what is necessary</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary text-xs">•</span>
              <p className="text-xs text-muted-foreground">No selling of personal data to third parties</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary text-xs">•</span>
              <p className="text-xs text-muted-foreground">Secure storage with Cloudflare R2 and Firebase</p>
            </div>
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
