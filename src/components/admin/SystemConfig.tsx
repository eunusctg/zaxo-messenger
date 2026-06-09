'use client';

import React, { useState } from 'react';
import {
  Server,
  KeyRound,
  ToggleLeft,
  Smartphone,
  Scale,
  Wrench,
  RefreshCw,
  Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function SystemConfig() {
  const { toast } = useToast();
  const [apiEndpoint, setApiEndpoint] = useState('https://api.zaxo.io/v2');
  const [rateLimit, setRateLimit] = useState('1000');
  const [apiThrottling, setApiThrottling] = useState(true);
  const [lastRotation, setLastRotation] = useState('2026-05-15');
  const [enableCalling, setEnableCalling] = useState(true);
  const [enableQR, setEnableQR] = useState(true);
  const [enableGroupVideo, setEnableGroupVideo] = useState(false);
  const [enableChannels, setEnableChannels] = useState(true);
  const [currentVersion, setCurrentVersion] = useState('2.4.1');
  const [minVersion, setMinVersion] = useState('2.0.0');
  const [forceUpdate, setForceUpdate] = useState(false);
  const [terms, setTerms] = useState('Terms of Service for Zaxo Messenger...\n\n1. Acceptance of Terms\nBy using Zaxo Messenger, you agree to these terms.\n\n2. User Conduct\nUsers must not engage in harassment, spam, or illegal activities.\n\n3. Privacy\nWe respect your privacy. See our Privacy Policy for details.');
  const [privacyPolicy, setPrivacyPolicy] = useState('Privacy Policy for Zaxo Messenger...\n\n1. Data Collection\nWe collect minimal data necessary to provide our services.\n\n2. Data Usage\nYour data is used solely to operate and improve Zaxo Messenger.\n\n3. Data Sharing\nWe do not sell or share your personal data with third parties.');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('We are currently performing scheduled maintenance. Please check back in a few minutes.');

  const handleSave = (section: string) => {
    toast({
      title: 'Configuration Saved',
      description: `${section} configuration has been saved successfully.`,
    });
  };

  const handleRotateKey = () => {
    const now = new Date().toISOString().split('T')[0];
    setLastRotation(now);
    toast({
      title: 'Key Rotated',
      description: 'Encryption key has been rotated successfully.',
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">System Configuration</h2>
        <p className="text-muted-foreground text-sm">Manage server settings, feature flags, and system policies</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Server & API */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Server className="size-4" />
              Server & API
            </CardTitle>
            <CardDescription>API endpoint and rate limiting configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Endpoint URL</label>
              <Input
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rate Limiting (RPM)</label>
              <Input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">API Throttling</p>
                <p className="text-muted-foreground text-xs">Enable automatic throttling under high load</p>
              </div>
              <Switch checked={apiThrottling} onCheckedChange={setApiThrottling} />
            </div>
            <Button size="sm" onClick={() => handleSave('Server & API')} className="gap-1.5">
              <Save className="size-3.5" /> Save
            </Button>
          </CardContent>
        </Card>

        {/* Encryption */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="size-4" />
              Encryption
            </CardTitle>
            <CardDescription>End-to-end encryption key management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Key Rotation Status</p>
                <p className="text-muted-foreground text-xs">Automatic key rotation schedule</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Rotation</span>
                <span className="font-medium">{lastRotation}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Next Scheduled</span>
                <span className="font-medium">2026-07-15</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Rotation Period</span>
                <span className="font-medium">60 days</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRotateKey} className="gap-1.5">
              <RefreshCw className="size-3.5" /> Rotate Key Now
            </Button>
          </CardContent>
        </Card>

        {/* Feature Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ToggleLeft className="size-4" />
              Feature Flags
            </CardTitle>
            <CardDescription>Toggle platform features on or off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable Calling</p>
                <p className="text-muted-foreground text-xs">Audio and video calling features</p>
              </div>
              <Switch checked={enableCalling} onCheckedChange={setEnableCalling} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable QR System</p>
                <p className="text-muted-foreground text-xs">QR code scanning and sharing</p>
              </div>
              <Switch checked={enableQR} onCheckedChange={setEnableQR} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable Group Video</p>
                <p className="text-muted-foreground text-xs">Multi-participant video calls</p>
              </div>
              <Switch checked={enableGroupVideo} onCheckedChange={setEnableGroupVideo} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable Channels</p>
                <p className="text-muted-foreground text-xs">Broadcast channels for announcements</p>
              </div>
              <Switch checked={enableChannels} onCheckedChange={setEnableChannels} />
            </div>
            <Button size="sm" onClick={() => handleSave('Feature Flags')} className="gap-1.5">
              <Save className="size-3.5" /> Save
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Smartphone className="size-4" />
              App Version
            </CardTitle>
            <CardDescription>Version management and update controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Version</label>
              <Input
                value={currentVersion}
                onChange={(e) => setCurrentVersion(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Required Version</label>
              <Input
                value={minVersion}
                onChange={(e) => setMinVersion(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Force Update</p>
                <p className="text-muted-foreground text-xs">Require users to update before using the app</p>
              </div>
              <Switch checked={forceUpdate} onCheckedChange={setForceUpdate} />
            </div>
            <Button size="sm" onClick={() => handleSave('App Version')} className="gap-1.5">
              <Save className="size-3.5" /> Save
            </Button>
          </CardContent>
        </Card>

        {/* Legal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Scale className="size-4" />
              Legal
            </CardTitle>
            <CardDescription>Terms of service and privacy policy management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Terms of Service</label>
                <Textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  rows={8}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Privacy Policy</label>
                <Textarea
                  value={privacyPolicy}
                  onChange={(e) => setPrivacyPolicy(e.target.value)}
                  rows={8}
                  className="text-sm"
                />
              </div>
            </div>
            <Button size="sm" onClick={() => handleSave('Legal')} className="gap-1.5">
              <Save className="size-3.5" /> Save Legal Documents
            </Button>
          </CardContent>
        </Card>

        {/* Maintenance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="size-4" />
              Maintenance
            </CardTitle>
            <CardDescription>Control maintenance mode and messaging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Maintenance Mode</p>
                <p className="text-muted-foreground text-xs">Temporarily disable the app for maintenance</p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>
            {maintenanceMode && (
              <div className="bg-amber-500/10 border-amber-500/20 rounded-lg border p-3">
                <p className="text-amber-600 text-sm font-medium">⚠ Maintenance mode is active. Users cannot access the app.</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Maintenance Message</label>
              <Textarea
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                rows={3}
                className="text-sm"
              />
            </div>
            <Button size="sm" onClick={() => handleSave('Maintenance')} className="gap-1.5">
              <Save className="size-3.5" /> Save
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
