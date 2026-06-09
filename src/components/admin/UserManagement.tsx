'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Ban,
  Shield,
  KeyRound,
  LogOut,
  Download,
  Bell,
  ChevronLeft,
  ChevronRight,
  X,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { mockAdminUsers } from '@/lib/mock-data';

type FilterType = 'all' | 'online' | 'suspended' | 'banned';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [detailUser, setDetailUser] = useState<(typeof mockAdminUsers)[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'displayName' | 'lastSeen' | 'createdAt'>('displayName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const pageSize = 8;

  const filteredUsers = useMemo(() => {
    let users = [...mockAdminUsers];

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      users = users.filter(
        (u) =>
          u.displayName.toLowerCase().includes(q) ||
          u.zaxoNumber.includes(q) ||
          u.phoneNumber.includes(q)
      );
    }

    // Filter by type
    if (filter === 'online') users = users.filter((u) => u.isOnline);
    if (filter === 'suspended') users = users.filter((u) => u.isSuspended);
    if (filter === 'banned') users = users.filter((u) => u.isBanned);

    // Sort
    users.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return users;
  }, [searchQuery, filter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const pagedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelect = (id: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === pagedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(pagedUsers.map((u) => u.id)));
    }
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const getStatusBadge = (user: (typeof mockAdminUsers)[0]) => {
    if (user.isBanned) return <Badge variant="destructive">Banned</Badge>;
    if (user.isSuspended) return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Suspended</Badge>;
    if (user.isOnline) return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Online</Badge>;
    return <Badge variant="secondary">Offline</Badge>;
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">User Management</h2>
          <p className="text-muted-foreground text-sm">{filteredUsers.length} users total</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search by name, Zaxo number, or phone..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'online', 'suspended', 'banned'] as FilterType[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSort(sortField)}
          className="gap-1.5"
        >
          <Filter className="size-3.5" />
          {sortField === 'displayName' ? 'Name' : sortField === 'lastSeen' ? 'Last Seen' : 'Created'} {sortDir === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      {/* Bulk Operations Toolbar */}
      {selectedUsers.size > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center justify-between py-3">
            <span className="text-sm font-medium">{selectedUsers.size} user(s) selected</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="size-3.5" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Bell className="size-3.5" />
                Send Notification
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUsers(new Set())}
                className="gap-1.5"
              >
                <X className="size-3.5" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={pagedUsers.length > 0 && selectedUsers.size === pagedUsers.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('displayName')}
                >
                  User
                </TableHead>
                <TableHead>Zaxo Number</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  className="cursor-pointer select-none hidden sm:table-cell"
                  onClick={() => handleSort('lastSeen')}
                >
                  Last Seen
                </TableHead>
                <TableHead className="w-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer"
                  onClick={() => setDetailUser(user)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedUsers.has(user.id)}
                      onCheckedChange={() => toggleSelect(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="size-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(user.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card ${
                            user.isOnline ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <span className="font-medium">{user.displayName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{user.zaxoNumber}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {user.phoneNumber}
                  </TableCell>
                  <TableCell>{getStatusBadge(user)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                    {user.lastSeen}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="size-8 p-0">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDetailUser(user)}>
                          <Eye className="mr-2 size-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-amber-600">
                          <Shield className="mr-2 size-4" /> Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Ban className="mr-2 size-4" /> Ban
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <KeyRound className="mr-2 size-4" /> Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <LogOut className="mr-2 size-4" /> Terminate Sessions
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {pagedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredUsers.length)} of{' '}
          {filteredUsers.length}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={currentPage === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(p)}
              className="size-8 p-0"
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!detailUser} onOpenChange={(open) => !open && setDetailUser(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {detailUser && (
            <>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>View and manage user account</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Profile Section */}
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {getInitials(detailUser.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{detailUser.displayName}</h3>
                    <p className="text-muted-foreground font-mono text-sm">{detailUser.zaxoNumber}</p>
                    <div className="mt-1">{getStatusBadge(detailUser)}</div>
                  </div>
                </div>

                <Separator />

                {/* Profile Info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Phone</p>
                    <p className="font-medium">{detailUser.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Last Seen</p>
                    <p className="font-medium">{detailUser.lastSeen}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Created</p>
                    <p className="font-medium">{detailUser.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Zaxo Number</p>
                    <p className="font-mono font-medium">{detailUser.zaxoNumber}</p>
                  </div>
                </div>

                <Separator />

                {/* Zaxo Number Assignment History */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Zaxo Number History</h4>
                  <div className="space-y-2">
                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-mono">{detailUser.zaxoNumber}</span>
                        <Badge variant="outline" className="text-xs">Current</Badge>
                      </div>
                      <p className="text-muted-foreground text-xs mt-1">Assigned on {detailUser.createdAt}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Session Info */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Session & Reports</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Sessions</span>
                      <span className="font-medium">{detailUser.isOnline ? '1' : '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reports Filed Against</span>
                      <span className="font-medium">{detailUser.isBanned ? '3' : detailUser.isSuspended ? '1' : '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account Status</span>
                      {getStatusBadge(detailUser)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Quick Actions */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailUser.isSuspended ? (
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <UserCheck className="size-3.5" /> Reinstate
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="gap-1.5 text-amber-600">
                        <Shield className="size-3.5" /> Suspend
                      </Button>
                    )}
                    {detailUser.isBanned ? (
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <UserX className="size-3.5" /> Unban
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="gap-1.5 text-red-600">
                        <Ban className="size-3.5" /> Ban
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <KeyRound className="size-3.5" /> Force Password Reset
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
