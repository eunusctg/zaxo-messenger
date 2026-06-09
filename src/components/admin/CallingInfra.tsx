'use client';

import React, { useState } from 'react';
import {
  Radio,
  Wifi,
  Monitor,
  Gauge,
  Route,
  Timer,
  Users,
  PhoneCall,
  Video,
  CircleDot,
  Save,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const servers = [
  { name: 'Signaling Server', status: 'healthy' as const, uptime: '99.99%', icon: Radio, detail: '45ms avg latency' },
  { name: 'TURN Server', status: 'healthy' as const, uptime: '99.95%', icon: Wifi, detail: '1,247 active connections' },
  { name: 'Media Server', status: 'warning' as const, uptime: '99.87%', icon: Monitor, detail: '78% CPU load' },
];

export default function CallingInfra() {
  const { toast } = useToast();
  const [minAudioBitrate, setMinAudioBitrate] = useState('32');
  const [minVideoResolution, setMinVideoResolution] = useState('720p');
  const [maxJitter, setMaxJitter] = useState('50');
  const [maxPacketLoss, setMaxPacketLoss] = useState('2');
  const [maxBandwidth, setMaxBandwidth] = useState('2');
  const [audioCodec, setAudioCodec] = useState('opus');
  const [videoCodec, setVideoCodec] = useState('vp8');
  const [loadBalancing, setLoadBalancing] = useState('least');
  const [maxCallDuration, setMaxCallDuration] = useState('120');
  const [maxGroupParticipants, setMaxGroupParticipants] = useState('8');
  const [maxConcurrentCalls, setMaxConcurrentCalls] = useState('10000');
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [recordingRetention, setRecordingRetention] = useState('30');
  const [autoDelete, setAutoDelete] = useState(true);

  const handleSave = (section: string) => {
    toast({
      title: 'Configuration Saved',
      description: `${section} configuration has been applied successfully.`,
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Calling Infrastructure</h2>
        <p className="text-muted-foreground text-sm">Manage calling servers, quality settings, and recording policies</p>
      </div>

      {/* Server Health Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {servers.map((server) => {
          const Icon = server.icon;
          const isHealthy = server.status === 'healthy';
          const statusColor = isHealthy ? 'text-emerald-500' : 'text-amber-500';
          const statusBg = isHealthy ? 'bg-emerald-500/10' : 'bg-amber-500/10';
          const statusLabel = isHealthy ? 'Healthy' : 'Warning';

          return (
            <Card key={server.name} className="gap-3 py-4">
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${statusBg} ${statusColor} flex size-9 items-center justify-center rounded-lg`}>
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{server.name}</p>
                      <p className="text-muted-foreground text-xs">{server.detail}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CircleDot className={`size-2.5 ${statusColor}`} />
                    <Badge className={`${statusBg} ${statusColor} border-0`}>{statusLabel}</Badge>
                  </div>
                  <div className="text-muted-foreground text-xs">Uptime: {server.uptime}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Quality Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="size-4" />
              Quality Thresholds
            </CardTitle>
            <CardDescription>Minimum quality standards for calls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Audio Bitrate (kbps)</label>
                <Input
                  type="number"
                  value={minAudioBitrate}
                  onChange={(e) => setMinAudioBitrate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Video Resolution</label>
                <Select value={minVideoResolution} onValueChange={setMinVideoResolution}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Jitter (ms)</label>
                <Input
                  type="number"
                  value={maxJitter}
                  onChange={(e) => setMaxJitter(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Packet Loss (%)</label>
                <Input
                  type="number"
                  value={maxPacketLoss}
                  onChange={(e) => setMaxPacketLoss(e.target.value)}
                />
              </div>
            </div>
            <Button size="sm" onClick={() => handleSave('Quality Thresholds')} className="gap-1.5">
              <Save className="size-3.5" /> Save
            </Button>
          </CardContent>
        </Card>

        {/* Bandwidth Config */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wifi className="size-4" />
              Bandwidth & Codecs
            </CardTitle>
            <CardDescription>Bandwidth limits and codec preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Bandwidth Per Call (Mbps)</label>
              <Input
                type="number"
                value={maxBandwidth}
                onChange={(e) => setMaxBandwidth(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Audio Codec</label>
                <Select value={audioCodec} onValueChange={setAudioCodec}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="opus">Opus</SelectItem>
                    <SelectItem value="pcmu">PCMU</SelectItem>
                    <SelectItem value="pcma">PCMA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Video Codec</label>
                <Select value={videoCodec} onValueChange={setVideoCodec}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vp8">VP8</SelectItem>
                    <SelectItem value="vp9">VP9</SelectItem>
                    <SelectItem value="h264">H264</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button size="sm" onClick={() => handleSave('Bandwidth & Codecs')} className="gap-1.5">
              <Save className="size-3.5" /> Save
            </Button>
          </CardContent>
        </Card>

        {/* Call Routing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Route className="size-4" />
              Call Routing
            </CardTitle>
            <CardDescription>Load balancing and routing strategy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Load Balancing Algorithm</label>
              <Select value={loadBalancing} onValueChange={setLoadBalancing}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round-robin">Round Robin</SelectItem>
                  <SelectItem value="least">Least Connections</SelectItem>
                  <SelectItem value="geo">Geo-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              {loadBalancing === 'round-robin' && (
                <p className="text-muted-foreground">Distributes calls evenly across all available servers in rotation.</p>
              )}
              {loadBalancing === 'least' && (
                <p className="text-muted-foreground">Routes calls to the server with the fewest active connections.</p>
              )}
              {loadBalancing === 'geo' && (
                <p className="text-muted-foreground">Routes calls to the nearest server based on user geographic location.</p>
              )}
            </div>
            <Button size="sm" onClick={() => handleSave('Call Routing')} className="gap-1.5">
              <Save className="size-3.5" /> Apply
            </Button>
          </CardContent>
        </Card>

        {/* Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Timer className="size-4" />
              Call Limits
            </CardTitle>
            <CardDescription>Duration and participant limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Call Duration (minutes)</label>
              <Input
                type="number"
                value={maxCallDuration}
                onChange={(e) => setMaxCallDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Group Participants</label>
              <Input
                type="number"
                value={maxGroupParticipants}
                onChange={(e) => setMaxGroupParticipants(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Concurrent Calls</label>
              <Input
                type="number"
                value={maxConcurrentCalls}
                onChange={(e) => setMaxConcurrentCalls(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={() => handleSave('Call Limits')} className="gap-1.5">
              <Save className="size-3.5" /> Save
            </Button>
          </CardContent>
        </Card>

        {/* Recording Policy */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Video className="size-4" />
              Recording Policy
            </CardTitle>
            <CardDescription>Call recording settings and retention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Enable Call Recording</p>
                <p className="text-muted-foreground text-xs">Record calls for compliance and quality assurance</p>
              </div>
              <Switch checked={recordingEnabled} onCheckedChange={setRecordingEnabled} />
            </div>
            {recordingEnabled && (
              <>
                <Separator />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recording Retention (days)</label>
                    <Input
                      type="number"
                      value={recordingRetention}
                      onChange={(e) => setRecordingRetention(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center justify-between w-full rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">Auto-delete Expired</p>
                        <p className="text-muted-foreground text-xs">Automatically delete recordings after retention period</p>
                      </div>
                      <Switch checked={autoDelete} onCheckedChange={setAutoDelete} />
                    </div>
                  </div>
                </div>
              </>
            )}
            <Button size="sm" onClick={() => handleSave('Recording Policy')} className="gap-1.5">
              <Save className="size-3.5" /> Save
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
