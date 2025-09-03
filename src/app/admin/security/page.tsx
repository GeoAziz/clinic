
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw } from "lucide-react";

interface SetupLink {
    id: string;
    userId: string;
    email: string;
    link: string;
    createdAt: string;
    expiresAt: string;
    status: 'active' | 'used' | 'expired' | 'revoked';
}

import { useToast } from "@/hooks/use-toast";

function SecurityLogs() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/security-logs');
            if (!response.ok) throw new Error('Failed to fetch security logs');
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to fetch security logs'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div>
            {loading ? (
                <div className="text-center py-8">Loading security logs...</div>
            ) : logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No security logs found</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell>{log.user || log.email || '-'}</TableCell>
                                <TableCell>{log.action || '-'}</TableCell>
                                <TableCell>{log.ip || '-'}</TableCell>
                                <TableCell>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}</TableCell>
                                <TableCell>
                                    <Badge variant={log.status === 'Success' ? 'default' : 'destructive'}
                                           className={log.status === 'Success' ? 'bg-green-500/20 text-green-300 border-green-500/50' : ''}>
                                        {log.status || '-'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

function SetupLinks() {
    const [setupLinks, setSetupLinks] = useState<SetupLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    const fetchLinks = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/setup-links');
            if (!response.ok) throw new Error('Failed to fetch setup links');
            const data = await response.json();
            setSetupLinks(data);
        } catch (error) {
            console.error('Error fetching setup links:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to fetch setup links'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const copyToClipboard = async (link: string, email: string) => {
        try {
            await navigator.clipboard.writeText(link);
            toast({
                title: '📋 Link Copied!',
                description: `Setup link for ${email} copied to clipboard.`,
                duration: 3000,
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to copy link to clipboard'
            });
        }
    };

    const revokeLink = async (id: string) => {
        try {
            const response = await fetch('/api/admin/setup-links/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (!response.ok) throw new Error('Failed to revoke link');
            toast({
                title: '🔒 Link Revoked',
                description: 'The setup link has been revoked.',
                duration: 3000,
            });
            fetchLinks();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to revoke link'
            });
        }
    };

    const isExpired = (expiresAt: string) => {
        return new Date(expiresAt) < new Date();
    };

    // Filter links by search and status
    const filteredLinks = setupLinks.filter(link => {
        const matchesSearch = link.email.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="rounded-md bg-muted/50 p-4 flex-1 mr-4">
                    <h3 className="font-medium mb-2">Setup Links</h3>
                    <p className="text-sm text-muted-foreground">
                        These are one-time setup links for new users. Links expire after 24 hours.
                    </p>
                </div>
                <Button 
                    onClick={fetchLinks} 
                    variant="outline"
                    size="icon"
                    className="hover:bg-primary hover:text-primary-foreground"
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            <div className="mb-4 flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search by email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded px-2 py-1 w-64"
                />
            </div>

            {loading ? (
                <div className="text-center py-8">Loading setup links...</div>
            ) : filteredLinks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    No setup links found
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User Email</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Expires</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLinks.map((link) => {
                                const expired = isExpired(link.expiresAt);
                                return (
                                    <TableRow key={link.id}>
                                        <TableCell>{link.email}</TableCell>
                                        <TableCell>
                                            {new Date(link.createdAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(link.expiresAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={expired ? 'destructive' : link.status === 'revoked' ? 'secondary' : 'default'}
                                                className={
                                                    expired ? '' : link.status === 'revoked' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50' : 'bg-green-500/20 text-green-300 border-green-500/50'
                                                }
                                            >
                                                {link.status === 'revoked' ? 'Revoked' : expired ? 'Expired' : 'Active'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right flex gap-2 justify-end">
                                            <Button
                                                onClick={() => copyToClipboard(link.link, link.email)}
                                                variant="ghost"
                                                size="sm"
                                                className="hover:bg-primary hover:text-primary-foreground"
                                                disabled={expired || link.status === 'revoked'}
                                            >
                                                <Copy className="h-4 w-4 mr-2" />
                                                Copy Link
                                            </Button>
                                            {link.status === 'active' && !expired && (
                                                <Button
                                                    onClick={() => revokeLink(link.id)}
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Revoke
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export default function SecurityPage() {
    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Security Management</CardTitle>
                <CardDescription>Manage security settings and view audit logs</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="setup-links" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="setup-links">Setup Links</TabsTrigger>
                        <TabsTrigger value="logs">Security Logs</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="setup-links" className="space-y-4">
                        <SetupLinks />
                    </TabsContent>
                    
                    <TabsContent value="logs" className="space-y-4">
                        <SecurityLogs />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
