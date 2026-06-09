'use client';

import React, { useState } from 'react';
import {
  Search,
  Download,
  Clock,
  User,
  Shield,
  AlertTriangle,
  Info,
  Monitor,
  LogIn,
  Database,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AuditEntry {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  type: 'user' | 'content' | 'system' | 'login' | 'data';
}

const adminActions: AuditEntry[] = [
  { id: 'al1', timestamp: '2026-06-09 08:00', admin: 'System Admin', action: 'User suspended', target: 'James Wilson (625-914-387)', details: 'Violation of community guidelines', ipAddress: '192.168.1.45', type: 'user' },
  { id: 'al2', timestamp: '2026-06-08 16:30', admin: 'System Admin', action: 'User banned', target: "Liam O'Brien (914-372-851)", details: 'Repeated spam violations', ipAddress: '192.168.1.45', type: 'user' },
  { id: 'al3', timestamp: '2026-06-08 10:00', admin: 'Ops Manager', action: 'Feature flag updated', target: 'group_video_calls', details: 'Enabled for all users', ipAddress: '10.0.0.12', type: 'system' },
  { id: 'al4', timestamp: '2026-06-07 14:15', admin: 'System Admin', action: 'System config changed', target: 'max_call_duration', details: 'Changed from 60min to 120min', ipAddress: '192.168.1.45', type: 'system' },
  { id: 'al5', timestamp: '2026-06-07 23:00', admin: 'Ops Manager', action: 'Content removed', target: 'Message msg-789', details: 'NSFW content removed from Family Group', ipAddress: '10.0.0.12', type: 'content' },
  { id: 'al6', timestamp: '2026-06-06 09:30', admin: 'System Admin', action: 'Notification sent', target: 'All users', details: 'Maintenance window announced', ipAddress: '192.168.1.45', type: 'system' },
  { id: 'al7', timestamp: '2026-06-06 08:00', admin: 'System Admin', action: 'User reinstated', target: 'Tom Baker (412-555-789)', details: 'Suspension lifted after review', ipAddress: '192.168.1.45', type: 'user' },
  { id: 'al8', timestamp: '2026-06-05 15:45', admin: 'Ops Manager', action: 'Content flagged', target: 'Image img-342', details: 'Violent content auto-detected, manual review confirmed', ipAddress: '10.0.0.12', type: 'content' },
];

const systemEvents: AuditEntry[] = [
  { id: 'se1', timestamp: '2026-06-09 07:00', admin: 'System', action: 'Backup completed', target: 'Database', details: 'Full backup - 2.3GB', ipAddress: '10.0.0.1', type: 'system' },
  { id: 'se2', timestamp: '2026-06-09 06:00', admin: 'System', action: 'Health check passed', target: 'All servers', details: 'All services operational', ipAddress: '10.0.0.1', type: 'system' },
  { id: 'se3', timestamp: '2026-06-08 23:00', admin: 'System', action: 'Cache cleared', target: 'Redis cluster', details: 'Manual cache flush by admin', ipAddress: '10.0.0.1', type: 'system' },
  { id: 'se4', timestamp: '2026-06-08 12:00', admin: 'System', action: 'SSL certificate renewed', target: 'api.zaxo.io', details: 'Auto-renewal successful', ipAddress: '10.0.0.1', type: 'system' },
  { id: 'se5', timestamp: '2026-06-07 03:00', admin: 'System', action: 'Server scaling', target: 'Media server pool', details: 'Scaled from 3 to 5 instances', ipAddress: '10.0.0.1', type: 'system' },
];

const errorLogs: AuditEntry[] = [
  { id: 'el1', timestamp: '2026-06-09 08:45', admin: 'System', action: 'Critical', target: 'TURN Server', details: 'Connection timeout - 3 retries failed', ipAddress: '10.0.0.2', type: 'system' },
  { id: 'el2', timestamp: '2026-06-09 07:30', admin: 'System', action: 'Warning', target: 'Media Server', details: 'CPU usage exceeded 85% threshold', ipAddress: '10.0.0.3', type: 'system' },
  { id: 'el3', timestamp: '2026-06-08 22:15', admin: 'System', action: 'Info', target: 'API Gateway', details: 'Rate limit reached for IP 203.0.113.45', ipAddress: '10.0.0.1', type: 'system' },
  { id: 'el4', timestamp: '2026-06-08 14:00', admin: 'System', action: 'Warning', target: 'Database', details: 'Slow query detected - 2.3s execution time', ipAddress: '10.0.0.1', type: 'system' },
  { id: 'el5', timestamp: '2026-06-07 19:30', admin: 'System', action: 'Critical', target: 'Push Service', details: 'Notification delivery failure - 500+ pending', ipAddress: '10.0.0.4', type: 'system' },
  { id: 'el6', timestamp: '2026-06-07 10:00', admin: 'System', action: 'Info', target: 'CDN', details: 'Cache hit rate dropped below 90%', ipAddress: '10.0.0.1', type: 'system' },
];

const loginAttempts: AuditEntry[] = [
  { id: 'la1', timestamp: '2026-06-09 08:00', admin: 'System Admin', action: 'Login success', target: 'admin@zaxo.io', details: '2FA verified', ipAddress: '192.168.1.45', type: 'login' },
  { id: 'la2', timestamp: '2026-06-09 07:45', admin: 'Unknown', action: 'Login failed', target: 'admin@zaxo.io', details: 'Invalid password', ipAddress: '203.0.113.42', type: 'login' },
  { id: 'la3', timestamp: '2026-06-09 07:40', admin: 'Unknown', action: 'Login failed', target: 'admin@zaxo.io', details: 'Invalid password', ipAddress: '203.0.113.42', type: 'login' },
  { id: 'la4', timestamp: '2026-06-08 16:25', admin: 'Ops Manager', action: 'Login success', target: 'ops@zaxo.io', details: '2FA verified', ipAddress: '10.0.0.12', type: 'login' },
  { id: 'la5', timestamp: '2026-06-08 09:00', admin: 'System Admin', action: 'Login success', target: 'admin@zaxo.io', details: '2FA verified', ipAddress: '192.168.1.45', type: 'login' },
];

const dataAccess: AuditEntry[] = [
  { id: 'da1', timestamp: '2026-06-09 08:05', admin: 'System Admin', action: 'User data export', target: 'James Wilson', details: 'Full profile export for review', ipAddress: '192.168.1.45', type: 'data' },
  { id: 'da2', timestamp: '2026-06-08 16:35', admin: 'Ops Manager', action: 'Message data access', target: 'Chat #3', details: 'Content review for report r2', ipAddress: '10.0.0.12', type: 'data' },
  { id: 'da3', timestamp: '2026-06-08 10:10', admin: 'System Admin', action: 'Analytics report', target: 'User growth data', details: 'Monthly analytics export', ipAddress: '192.168.1.45', type: 'data' },
  { id: 'da4', timestamp: '2026-06-07 14:20', admin: 'System Admin', action: 'System config read', target: 'Calling infrastructure', details: 'Config audit', ipAddress: '192.168.1.45', type: 'data' },
];

const tabDataMap: Record<string, AuditEntry[]> = {
  'admin-actions': adminActions,
  'system-events': systemEvents,
  'error-logs': errorLogs,
  'login-attempts': loginAttempts,
  'data-access': dataAccess,
};

export default function LoggingAudit() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('admin-actions');
  const [actionFilter, setActionFilter] = useState('all');
  const [adminFilter, setAdminFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentData = tabDataMap[activeTab] || [];

  const filteredData = currentData.filter((entry) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        entry.action.toLowerCase().includes(q) ||
        entry.target.toLowerCase().includes(q) ||
        entry.details.toLowerCase().includes(q) ||
        entry.admin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getActionColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'text-amber-600 bg-amber-500/10';
      case 'content':
        return 'text-red-600 bg-red-500/10';
      case 'system':
        return 'text-blue-600 bg-blue-500/10';
      case 'login':
        return 'text-purple-600 bg-purple-500/10';
      case 'data':
        return 'text-teal-600 bg-teal-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getSeverityBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Info</Badge>;
      default:
        return null;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'user': return User;
      case 'content': return Shield;
      case 'system': return Monitor;
      case 'login': return LogIn;
      case 'data': return Database;
      default: return Clock;
    }
  };

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Audit logs are being exported as CSV.',
    });
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Logging & Audit</h2>
          <p className="text-muted-foreground text-sm">Audit trail, system events, and access logs</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5 w-fit">
          <Download className="size-3.5" /> Export Logs
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search logs..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Action Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="user">User Actions</SelectItem>
            <SelectItem value="content">Content Actions</SelectItem>
            <SelectItem value="system">System Actions</SelectItem>
          </SelectContent>
        </Select>
        <Select value={adminFilter} onValueChange={setAdminFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Admin User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Admins</SelectItem>
            <SelectItem value="system-admin">System Admin</SelectItem>
            <SelectItem value="ops-manager">Ops Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="admin-actions">Admin Actions</TabsTrigger>
          <TabsTrigger value="system-events">System Events</TabsTrigger>
          <TabsTrigger value="error-logs">Error Logs</TabsTrigger>
          <TabsTrigger value="login-attempts">Login Attempts</TabsTrigger>
          <TabsTrigger value="data-access">Data Access</TabsTrigger>
        </TabsList>

        {Object.keys(tabDataMap).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="hidden md:table-cell">Target</TableHead>
                      <TableHead className="hidden lg:table-cell">Details</TableHead>
                      <TableHead className="hidden sm:table-cell">IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((entry) => {
                      const Icon = getActionIcon(entry.type);
                      const actionColor = getActionColor(entry.type);

                      return (
                        <TableRow key={entry.id}>
                          <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="size-3" />
                              {entry.timestamp}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-medium">{entry.admin}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`flex size-6 items-center justify-center rounded ${actionColor}`}>
                                <Icon className="size-3" />
                              </div>
                              <span className="text-sm">{entry.action}</span>
                              {tab === 'error-logs' && getSeverityBadge(entry.action)}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{entry.target}</TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground text-xs max-w-48 truncate">
                            {entry.details}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                            {entry.ipAddress}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                          No logs found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
