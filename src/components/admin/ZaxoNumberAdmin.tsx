'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Hash,
  Star,
  Crown,
  UserCheck,
  MoreHorizontal,
  Lock,
  Unlock,
  ArrowRightLeft,
  Phone,
  CheckCircle2,
  XCircle,
  Settings2,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface ZaxoNumber {
  id: string;
  number: string;
  status: 'available' | 'assigned' | 'reserved';
  assignedTo: string | null;
  isPremium: boolean;
  assignedAt: string | null;
}

const mockZaxoNumbers: ZaxoNumber[] = [
  { id: 'zn1', number: '482-719-356', status: 'assigned', assignedTo: 'Alex Morgan', isPremium: false, assignedAt: '2025-08-15' },
  { id: 'zn2', number: '291-834-567', status: 'assigned', assignedTo: 'Sarah Chen', isPremium: false, assignedAt: '2025-09-02' },
  { id: 'zn3', number: '738-456-129', status: 'assigned', assignedTo: 'Marcus Johnson', isPremium: false, assignedAt: '2025-10-18' },
  { id: 'zn4', number: '564-893-712', status: 'assigned', assignedTo: 'Elena Rodriguez', isPremium: true, assignedAt: '2025-11-05' },
  { id: 'zn5', number: '847-261-935', status: 'available', assignedTo: null, isPremium: false, assignedAt: null },
  { id: 'zn6', number: '193-678-452', status: 'assigned', assignedTo: 'Aisha Patel', isPremium: false, assignedAt: '2025-12-01' },
  { id: 'zn7', number: '625-914-387', status: 'reserved', assignedTo: null, isPremium: false, assignedAt: null },
  { id: 'zn8', number: '381-547-629', status: 'assigned', assignedTo: 'Yuki Tanaka', isPremium: true, assignedAt: '2026-01-10' },
  { id: 'zn9', number: '914-372-851', status: 'available', assignedTo: null, isPremium: true, assignedAt: null },
  { id: 'zn10', number: '457-683-129', status: 'available', assignedTo: null, isPremium: false, assignedAt: null },
  { id: 'zn11', number: '100-000-001', status: 'reserved', assignedTo: null, isPremium: true, assignedAt: null },
  { id: 'zn12', number: '100-000-002', status: 'reserved', assignedTo: null, isPremium: true, assignedAt: null },
  { id: 'zn13', number: '222-333-444', status: 'available', assignedTo: null, isPremium: false, assignedAt: null },
  { id: 'zn14', number: '555-666-777', status: 'assigned', assignedTo: 'Priya Sharma', isPremium: true, assignedAt: '2026-04-08' },
  { id: 'zn15', number: '888-999-000', status: 'available', assignedTo: null, isPremium: true, assignedAt: null },
];

export default function ZaxoNumberAdmin() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [algorithmConfig, setAlgorithmConfig] = useState('random');
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<ZaxoNumber | null>(null);

  const stats = useMemo(() => {
    const total = mockZaxoNumbers.length;
    const assigned = mockZaxoNumbers.filter((n) => n.status === 'assigned').length;
    const available = mockZaxoNumbers.filter((n) => n.status === 'available').length;
    const premium = mockZaxoNumbers.filter((n) => n.isPremium).length;
    return { total, assigned, available, premium };
  }, []);

  const filteredNumbers = useMemo(() => {
    let numbers = [...mockZaxoNumbers];
    if (searchQuery) {
      numbers = numbers.filter(
        (n) =>
          n.number.includes(searchQuery) ||
          (n.assignedTo && n.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    switch (activeTab) {
      case 'available':
        numbers = numbers.filter((n) => n.status === 'available');
        break;
      case 'assigned':
        numbers = numbers.filter((n) => n.status === 'assigned');
        break;
      case 'premium':
        numbers = numbers.filter((n) => n.isPremium);
        break;
      case 'reserved':
        numbers = numbers.filter((n) => n.status === 'reserved');
        break;
    }
    return numbers;
  }, [searchQuery, activeTab]);

  const handleLookup = () => {
    const found = mockZaxoNumbers.find((n) => n.number === lookupQuery);
    setLookupResult(found || null);
  };

  const getStatusBadge = (number: ZaxoNumber) => {
    switch (number.status) {
      case 'assigned':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Assigned</Badge>;
      case 'available':
        return <Badge variant="secondary">Available</Badge>;
      case 'reserved':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Reserved</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Zaxo Number Administration</h2>
        <p className="text-muted-foreground text-sm">Manage Zaxo number pool, assignments, and reservations</p>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="gap-3 py-4">
          <CardContent className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
              <Hash className="size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Numbers</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-3 py-4">
          <CardContent className="flex items-center gap-3">
            <div className="bg-emerald-500/10 text-emerald-500 flex size-9 items-center justify-center rounded-lg">
              <UserCheck className="size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Assigned</p>
              <p className="text-xl font-bold">{stats.assigned}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-3 py-4">
          <CardContent className="flex items-center gap-3">
            <div className="bg-blue-500/10 text-blue-500 flex size-9 items-center justify-center rounded-lg">
              <CheckCircle2 className="size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Available</p>
              <p className="text-xl font-bold">{stats.available}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gap-3 py-4">
          <CardContent className="flex items-center gap-3">
            <div className="bg-amber-500/10 text-amber-500 flex size-9 items-center justify-center rounded-lg">
              <Star className="size-4" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Premium</p>
              <p className="text-xl font-bold">{stats.premium}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="reserved">Reserved</TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search numbers..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead className="hidden lg:table-cell">Assigned At</TableHead>
                    <TableHead className="w-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNumbers.map((num) => (
                    <TableRow key={num.id}>
                      <TableCell className="font-mono font-medium">{num.number}</TableCell>
                      <TableCell>{getStatusBadge(num)}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {num.assignedTo || '—'}
                      </TableCell>
                      <TableCell>
                        {num.isPremium ? (
                          <Crown className="size-4 text-amber-500" />
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {num.assignedAt || '—'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="size-8 p-0">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!num.isPremium && (
                              <DropdownMenuItem>
                                <Star className="mr-2 size-4" /> Mark as Premium
                              </DropdownMenuItem>
                            )}
                            {num.status === 'available' && (
                              <DropdownMenuItem>
                                <Lock className="mr-2 size-4" /> Reserve Number
                              </DropdownMenuItem>
                            )}
                            {num.status === 'reserved' && (
                              <DropdownMenuItem>
                                <Unlock className="mr-2 size-4" /> Release Number
                              </DropdownMenuItem>
                            )}
                            {num.status === 'assigned' && (
                              <DropdownMenuItem>
                                <ArrowRightLeft className="mr-2 size-4" /> Reassign
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredNumbers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                        No numbers found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Row: Assignment Config & Lookup */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Assignment Algorithm Config */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings2 className="size-4" />
              Assignment Algorithm
            </CardTitle>
            <CardDescription>Configure how Zaxo numbers are assigned to new users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Algorithm</label>
              <Select value={algorithmConfig} onValueChange={setAlgorithmConfig}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">Random Assignment</SelectItem>
                  <SelectItem value="sequential">Sequential Assignment</SelectItem>
                  <SelectItem value="premium">Premium-based Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <p className="font-medium">How it works:</p>
              {algorithmConfig === 'random' && (
                <p className="text-muted-foreground">Assigns a random available number from the pool. Best for even distribution.</p>
              )}
              {algorithmConfig === 'sequential' && (
                <p className="text-muted-foreground">Assigns the next available number in sequence. Easier to track allocation patterns.</p>
              )}
              {algorithmConfig === 'premium' && (
                <p className="text-muted-foreground">Premium users get premium numbers first. Regular users get standard numbers.</p>
              )}
            </div>
            <Button size="sm">Apply Configuration</Button>
          </CardContent>
        </Card>

        {/* Number Lookup Tool */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="size-4" />
              Number Lookup
            </CardTitle>
            <CardDescription>Search for a specific Zaxo number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter number (e.g., 482-719-356)"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="flex-1 font-mono"
              />
              <Button onClick={handleLookup} size="sm">
                <Search className="size-4" />
              </Button>
            </div>
            {lookupResult && (
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold">{lookupResult.number}</span>
                  {getStatusBadge(lookupResult)}
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Assigned To</p>
                    <p className="font-medium">{lookupResult.assignedTo || 'Unassigned'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Premium</p>
                    <p className="font-medium">{lookupResult.isPremium ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Assigned Date</p>
                    <p className="font-medium">{lookupResult.assignedAt || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
            {lookupQuery && lookupResult === null && (
              <div className="text-muted-foreground text-sm flex items-center gap-2">
                <XCircle className="size-4 text-red-500" />
                Number not found in the pool.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
