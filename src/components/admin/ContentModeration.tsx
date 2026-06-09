'use client';

import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Eye,
  XCircle,
  Trash2,
  Bell,
  Ban,
  Clock,
  Plus,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockReports } from '@/lib/mock-data';

const moderationStats = [
  { label: 'Pending Reports', value: 3, icon: AlertTriangle, color: 'text-amber-500 bg-amber-500/10' },
  { label: 'Resolved Today', value: 7, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
  { label: 'Auto-filtered', value: 142, icon: Filter, color: 'text-blue-500 bg-blue-500/10' },
  { label: 'Manual Actions', value: 23, icon: Shield, color: 'text-purple-500 bg-purple-500/10' },
];

const recentActions = [
  { action: 'Removed message', target: 'msg-789', admin: 'System Admin', time: '2 min ago' },
  { action: 'Warned user', target: 'Liam O\'Brien', admin: 'Ops Manager', time: '15 min ago' },
  { action: 'Dismissed report', target: 'r6', admin: 'System Admin', time: '1 hour ago' },
  { action: 'Banned user', target: 'Unknown User', admin: 'System Admin', time: '2 hours ago' },
  { action: 'Reviewed content', target: 'msg-456', admin: 'Ops Manager', time: '3 hours ago' },
  { action: 'Auto-filtered spam', target: '12 messages', admin: 'System', time: '4 hours ago' },
  { action: 'Updated NSFW threshold', target: '0.85', admin: 'System Admin', time: '5 hours ago' },
  { action: 'Released warning', target: 'Sarah Chen', admin: 'Ops Manager', time: '6 hours ago' },
  { action: 'Auto-filtered spam', target: '8 messages', admin: 'System', time: '7 hours ago' },
  { action: 'Added keyword filter', target: 'casino', admin: 'System Admin', time: '8 hours ago' },
];

export default function ContentModeration() {
  const [activeTab, setActiveTab] = useState('pending');
  const [spamEnabled, setSpamEnabled] = useState(true);
  const [spamSensitivity, setSpamSensitivity] = useState([70]);
  const [nsfwEnabled, setNsfwEnabled] = useState(true);
  const [nsfwThreshold, setNsfwThreshold] = useState([85]);
  const [violenceEnabled, setViolenceEnabled] = useState(true);
  const [customKeywords, setCustomKeywords] = useState<string[]>(['casino', 'lottery', 'free money']);
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = () => {
    if (newKeyword.trim() && !customKeywords.includes(newKeyword.trim().toLowerCase())) {
      setCustomKeywords([...customKeywords, newKeyword.trim().toLowerCase()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (kw: string) => {
    setCustomKeywords(customKeywords.filter((k) => k !== kw));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'reviewed':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      default:
        return '';
    }
  };

  const getReasonBadge = (reason: string) => {
    const colors: Record<string, string> = {
      Spam: 'bg-red-500/10 text-red-600 border-red-500/20',
      Harassment: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      NSFW: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
      'Inappropriate content': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    };
    return colors[reason] || 'bg-muted text-muted-foreground';
  };

  const filteredReports = mockReports.filter((r) => {
    if (activeTab === 'pending') return r.status === 'pending';
    if (activeTab === 'reviewed') return r.status === 'reviewed';
    if (activeTab === 'resolved') return r.status === 'resolved';
    return true;
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Content Moderation</h2>
        <p className="text-muted-foreground text-sm">Review reports, manage auto-filters, and enforce community guidelines</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {moderationStats.map((stat) => {
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

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Reports Section */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="reviewed">Under Review</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="auto-filter">Auto-filter Rules</TabsTrigger>
            </TabsList>

            {['pending', 'reviewed', 'resolved'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
                {filteredReports.length === 0 && (
                  <Card>
                    <CardContent className="text-muted-foreground py-8 text-center">
                      No reports in this category.
                    </CardContent>
                  </Card>
                )}
                {filteredReports.map((report) => (
                  <Card key={report.id} className="gap-3 py-4">
                    <CardContent className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {report.reporterName.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              <span className="text-muted-foreground">Reporter:</span> {report.reporterName}
                            </p>
                            <p className="text-muted-foreground text-xs flex items-center gap-1">
                              <Clock className="size-3" /> {report.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getReasonBadge(report.reason)}>{report.reason}</Badge>
                          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Target:</span>{' '}
                          <span className="font-medium">{report.targetName}</span>
                          <Badge variant="outline" className="ml-2 text-xs">{report.targetType}</Badge>
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">{report.description}</p>
                      </div>

                      {tab === 'pending' && (
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Eye className="size-3.5" /> Review
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <XCircle className="size-3.5" /> Dismiss
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1.5 text-red-600">
                            <Trash2 className="size-3.5" /> Remove Content
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1.5 text-amber-600">
                            <Bell className="size-3.5" /> Warn User
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1.5 text-red-600">
                            <Ban className="size-3.5" /> Ban User
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}

            {/* Auto-filter Rules Tab */}
            <TabsContent value="auto-filter" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Auto-filter Rules Configuration</CardTitle>
                  <CardDescription>Configure automatic content filtering rules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Spam Detection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Spam Detection</p>
                        <p className="text-muted-foreground text-xs">Automatically detect and filter spam messages</p>
                      </div>
                      <Switch checked={spamEnabled} onCheckedChange={setSpamEnabled} />
                    </div>
                    {spamEnabled && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Sensitivity</span>
                          <span className="font-medium">{spamSensitivity[0]}%</span>
                        </div>
                        <Slider
                          value={spamSensitivity}
                          onValueChange={setSpamSensitivity}
                          min={10}
                          max={100}
                          step={5}
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* NSFW Filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">NSFW Filter</p>
                        <p className="text-muted-foreground text-xs">Filter explicit and adult content</p>
                      </div>
                      <Switch checked={nsfwEnabled} onCheckedChange={setNsfwEnabled} />
                    </div>
                    {nsfwEnabled && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Confidence Threshold</span>
                          <span className="font-medium">{nsfwThreshold[0]}%</span>
                        </div>
                        <Slider
                          value={nsfwThreshold}
                          onValueChange={setNsfwThreshold}
                          min={50}
                          max={100}
                          step={5}
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Violence Detection */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Violence Detection</p>
                      <p className="text-muted-foreground text-xs">Detect and filter violent content</p>
                    </div>
                    <Switch checked={violenceEnabled} onCheckedChange={setViolenceEnabled} />
                  </div>

                  <Separator />

                  {/* Custom Keyword Filter */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Custom Keyword Filter</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add keyword..."
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={addKeyword} className="gap-1.5">
                        <Plus className="size-3.5" /> Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {customKeywords.map((kw) => (
                        <Badge key={kw} variant="secondary" className="gap-1.5 py-1">
                          {kw}
                          <button
                            onClick={() => removeKeyword(kw)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button size="sm" className="mt-2">Save Filter Rules</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Moderation Action Log */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Actions</CardTitle>
              <CardDescription>Last 10 moderation actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActions.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{item.action}</p>
                      <p className="text-muted-foreground text-xs truncate">{item.target}</p>
                      <p className="text-muted-foreground text-xs">{item.admin} · {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
