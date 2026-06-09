'use client';

import React, { useState } from 'react';
import {
  Bell,
  Send,
  Mail,
  Eye,
  Plus,
  Copy,
  Trash2,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  title: string;
  target: string;
  status: 'draft' | 'scheduled' | 'sent';
  sentDate: string | null;
  deliveryRate: number;
  sent: number;
  delivered: number;
  failed: number;
}

interface Template {
  id: string;
  name: string;
  type: 'welcome' | 'maintenance' | 'update' | 'security';
  subject: string;
  body: string;
}

const mockCampaigns: Campaign[] = [
  { id: 'c1', title: 'Welcome to Zaxo 2.4', target: 'All Users', status: 'sent', sentDate: '2026-06-08', deliveryRate: 98.5, sent: 128459, delivered: 126532, failed: 1927 },
  { id: 'c2', title: 'Scheduled Maintenance Notice', target: 'All Users', status: 'sent', sentDate: '2026-06-06', deliveryRate: 97.2, sent: 128459, delivered: 124870, failed: 3589 },
  { id: 'c3', title: 'New Feature: Group Video', target: 'Premium Users', status: 'scheduled', sentDate: null, deliveryRate: 0, sent: 0, delivered: 0, failed: 0 },
  { id: 'c4', title: 'Security Update Required', target: 'Android Users', status: 'draft', sentDate: null, deliveryRate: 0, sent: 0, delivered: 0, failed: 0 },
  { id: 'c5', title: 'Holiday Greetings', target: 'All Users', status: 'scheduled', sentDate: null, deliveryRate: 0, sent: 0, delivered: 0, failed: 0 },
];

const mockTemplates: Template[] = [
  { id: 't1', name: 'Welcome Message', type: 'welcome', subject: 'Welcome to Zaxo!', body: 'Hi {{name}}, welcome to Zaxo Messenger! Your Zaxo number is {{zaxo_number}}. Start chatting securely today.' },
  { id: 't2', name: 'Maintenance Notice', type: 'maintenance', subject: 'Scheduled Maintenance', body: 'Dear {{name}}, Zaxo will undergo scheduled maintenance on {{date}} from {{start_time}} to {{end_time}}. Services may be temporarily unavailable.' },
  { id: 't3', name: 'App Update', type: 'update', subject: 'Update Available', body: 'Hi {{name}}, a new version of Zaxo is available! Update now to enjoy the latest features and security improvements.' },
  { id: 't4', name: 'Security Alert', type: 'security', subject: 'Security Alert', body: 'Dear {{name}}, we detected a new login to your account from {{device}}. If this wasn\'t you, please secure your account immediately.' },
];

export default function NotificationManager() {
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newTarget, setNewTarget] = useState('all');
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  const notifStats = [
    { label: 'Total Sent', value: '256,918', icon: Send, color: 'text-primary bg-primary/10' },
    { label: 'Delivery Rate', value: '97.8%', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Open Rate', value: '64.2%', icon: Eye, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Active Campaigns', value: '2', icon: Bell, color: 'text-amber-500 bg-amber-500/10' },
  ];

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Scheduled</Badge>;
      case 'sent':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Sent</Badge>;
    }
  };

  const getTemplateTypeBadge = (type: Template['type']) => {
    const colors: Record<string, string> = {
      welcome: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      maintenance: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      update: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      security: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    return <Badge className={colors[type]}>{type}</Badge>;
  };

  const handleCreate = () => {
    setCreateOpen(false);
    setNewTitle('');
    setNewMessage('');
    setNewTarget('all');
    setScheduled(false);
    setScheduleDate('');
    toast({
      title: 'Campaign Created',
      description: scheduled ? 'Campaign has been scheduled.' : 'Campaign has been saved as draft.',
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Notification Manager</h2>
          <p className="text-muted-foreground text-sm">Create campaigns, manage templates, and track delivery</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5 w-fit">
          <Plus className="size-3.5" /> Create Campaign
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {notifStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="gap-3 py-4">
              <CardContent className="flex items-center gap-3">
                <div className={`flex size-9 items-center justify-center rounded-lg ${stat.color}`}>
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Campaign List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campaigns</CardTitle>
          <CardDescription>Manage your notification campaigns</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Sent Date</TableHead>
                <TableHead className="hidden sm:table-cell">Delivery Rate</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{campaign.target}</TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {campaign.sentDate || '—'}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {campaign.status === 'sent' ? (
                      <div className="flex items-center gap-2">
                        <Progress value={campaign.deliveryRate} className="w-16 h-2" />
                        <span className="text-xs font-medium">{campaign.deliveryRate}%</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {campaign.status === 'sent' && (
                      <Button variant="ghost" size="sm" className="size-8 p-0">
                        <Eye className="size-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delivery Status Tracking for Sent Campaigns */}
      {mockCampaigns.filter((c) => c.status === 'sent').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery Status</CardTitle>
            <CardDescription>Delivery tracking for sent campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCampaigns
                .filter((c) => c.status === 'sent')
                .map((campaign) => (
                  <div key={campaign.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{campaign.title}</span>
                      <span className="text-muted-foreground text-xs">{campaign.sent!.toLocaleString()} sent</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="size-3" /> Delivered
                          </span>
                          <span>{campaign.delivered.toLocaleString()}</span>
                        </div>
                        <Progress value={(campaign.delivered / campaign.sent) * 100} className="h-2" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="flex items-center gap-1 text-red-500">
                            <XCircle className="size-3" /> Failed
                          </span>
                          <span>{campaign.failed.toLocaleString()}</span>
                        </div>
                        <Progress value={(campaign.failed / campaign.sent) * 100} className="h-2" />
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Templates</CardTitle>
          <CardDescription>Pre-built message templates for common notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {mockTemplates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 space-y-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{template.name}</p>
                    <p className="text-muted-foreground text-xs">{template.subject}</p>
                  </div>
                  {getTemplateTypeBadge(template.type)}
                </div>
                <p className="text-muted-foreground text-xs line-clamp-2">{template.body}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <Copy className="size-3" /> Duplicate
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-xs text-red-600">
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Campaign Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>Create a new notification campaign</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Campaign title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Notification message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Select value={newTarget} onValueChange={setNewTarget}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="specific">Specific Users</SelectItem>
                  <SelectItem value="premium">Premium Users</SelectItem>
                  <SelectItem value="android">Android Users</SelectItem>
                  <SelectItem value="ios">iOS Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Schedule for Later</p>
                  <p className="text-muted-foreground text-xs">Set a date and time to send</p>
                </div>
                <Switch checked={scheduled} onCheckedChange={setScheduled} />
              </div>
              {scheduled && (
                <Input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="gap-1.5">
              <Send className="size-3.5" />
              {scheduled ? 'Schedule' : 'Save Draft'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
