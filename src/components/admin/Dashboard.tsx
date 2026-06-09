'use client';

import React from 'react';
import {
  Users,
  Activity,
  MessageSquare,
  Server,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Shield,
  UserCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminStore } from '@/stores';
import { monthlyGrowthData, weeklyGrowthData, geoDistribution, mockAuditLogs } from '@/lib/mock-data';

const statCards = [
  {
    title: 'Total Users',
    key: 'totalUsers' as const,
    icon: Users,
    change: 12.5,
    format: (v: number) => v.toLocaleString(),
    sparkData: [98, 102, 106.5, 110.2, 118, 128.5],
  },
  {
    title: 'Active Today',
    key: 'activeToday' as const,
    icon: Activity,
    change: 8.3,
    format: (v: number) => v.toLocaleString(),
    sparkData: [28, 30, 31, 33, 32, 34.8],
  },
  {
    title: 'Messages Today',
    key: 'totalMessages' as const,
    icon: MessageSquare,
    change: -2.1,
    format: (v: number) => (v / 1000000).toFixed(1) + 'M',
    sparkData: [7.8, 8.1, 8.0, 8.3, 8.2, 8.4],
  },
  {
    title: 'Server Health',
    key: 'serverHealth' as const,
    icon: Server,
    change: 0.2,
    format: (v: number) => v.toFixed(1) + '%',
    sparkData: [99.2, 99.5, 99.3, 99.6, 99.8, 99.7],
  },
];

const recentActivity = [
  { action: 'User suspended', target: 'James Wilson', icon: Shield, time: '8:00 AM', type: 'warning' as const },
  { action: 'User banned', target: "Liam O'Brien", icon: Shield, time: '4:30 PM', type: 'danger' as const },
  { action: 'Feature flag updated', target: 'group_video_calls', icon: UserCheck, time: '10:00 AM', type: 'info' as const },
  { action: 'System config changed', target: 'max_call_duration', icon: Server, time: '2:15 PM', type: 'info' as const },
  { action: 'Content removed', target: 'Message msg-789', icon: Shield, time: '11:00 PM', type: 'warning' as const },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Dashboard() {
  const { stats } = useAdminStore();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, Admin</h1>
          <p className="text-muted-foreground text-sm">{today}</p>
        </div>
        <Badge variant="outline" className="w-fit gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" />
          All systems operational
        </Badge>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const isPositive = card.change >= 0;
          const Icon = card.icon;
          const sparkColor = isPositive ? '#10b981' : '#ef4444';

          return (
            <Card key={card.key} className="gap-4 py-4">
              <CardContent className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                      <Icon className="size-4" />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">{card.title}</span>
                  </div>
                  <div className="text-2xl font-bold">{card.format(stats[card.key])}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {isPositive ? (
                      <TrendingUp className="size-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="size-3 text-red-500" />
                    )}
                    <span className={isPositive ? 'text-emerald-600' : 'text-red-600'}>
                      {isPositive ? '+' : ''}{card.change}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <Sparkline data={card.sparkData} color={sparkColor} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Growth</CardTitle>
            <CardDescription>Monthly user growth trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyGrowthData}>
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v / 1000)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'Users']}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#userGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Message & Call Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Message & Call Volume</CardTitle>
            <CardDescription>Weekly message and call data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'messages' ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString(),
                      name === 'messages' ? 'Messages' : 'Calls',
                    ]}
                  />
                  <Bar dataKey="messages" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="calls" fill="#6ee7b7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Geographic Distribution</CardTitle>
            <CardDescription>Users by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geoDistribution.map((geo) => (
                <div key={geo.region} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-foreground text-sm font-medium">{geo.region}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground text-xs">{geo.users.toLocaleString()}</div>
                    <Badge variant="secondary" className="text-xs">
                      {geo.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue</CardTitle>
            <CardDescription>Current billing period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 text-emerald-500 flex size-10 items-center justify-center rounded-xl">
                <DollarSign className="size-5" />
              </div>
              <div>
                <div className="text-3xl font-bold">${stats.revenue.toLocaleString()}</div>
                <div className="text-muted-foreground text-xs">Monthly recurring revenue</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Premium subscriptions</span>
                <span className="font-medium">$32,450</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Zaxo Number fees</span>
                <span className="font-medium">$8,240</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Enterprise plans</span>
                <span className="font-medium">$5,202</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="size-3 text-emerald-500" />
              <span className="text-emerald-600 font-medium">+15.3%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest admin actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item, i) => {
                const Icon = item.icon;
                const typeColors = {
                  warning: 'text-amber-500 bg-amber-500/10',
                  danger: 'text-red-500 bg-red-500/10',
                  info: 'text-primary bg-primary/10',
                };
                const colorClass = typeColors[item.type];

                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                      <Icon className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{item.action}</div>
                      <div className="text-muted-foreground text-xs truncate">{item.target}</div>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs shrink-0">
                      <Clock className="size-3" />
                      {item.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
