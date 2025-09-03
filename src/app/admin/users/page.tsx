
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { UserDetailsDialog } from "@/components/admin/user-details-dialog";


type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    createdAt: string;
};

const UserTable = ({ users, onViewDetails }: { users: User[], onViewDetails: (user: User) => void }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {users.map(user => (
                <TableRow key={user.id}>
                    <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                        <Badge variant={user.status === 'Active' || user.status === 'Online' ? 'default' : 'secondary'}
                            className={user.status === 'Active' || user.status === 'Online' ? 'bg-green-500/20 text-green-300 border-green-500/50' : ''}>
                            {user.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => onViewDetails(user)}>
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);


export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || 'Error fetching users');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    const onUserCreated = () => {
        // Re-fetch users list after a new user is created
        fetchUsers();
    }

    const patients = users.filter((user: User) => user.role === 'patient');
    const staff = users.filter((user: User) => ['doctor', 'receptionist'].includes(user.role));
    const admins = users.filter((user: User) => user.role === 'admin');

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setDetailsDialogOpen(true);
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Card className="glass-pane w-full">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="font-headline text-3xl">User Management</CardTitle>
                            <CardDescription>Manage all users in the Zizo_HealthVerse system.</CardDescription>
                        </div>
                        <CreateUserDialog onUserCreated={onUserCreated} />
                    </div>
                </CardHeader>
            <CardContent>
                <Tabs defaultValue="patients">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="patients">Patients</TabsTrigger>
                        <TabsTrigger value="staff">Staff</TabsTrigger>
                        <TabsTrigger value="admins">Admins</TabsTrigger>
                    </TabsList>
                    <TabsContent value="patients">
                        <Card className="glass-pane mt-4">
                            <CardContent className="p-0">
                                <UserTable 
                                    users={patients}
                                    onViewDetails={(user) => {
                                        setSelectedUser(user);
                                        setDetailsDialogOpen(true);
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="staff">
                         <Card className="glass-pane mt-4">
                            <CardContent className="p-0">
                                <UserTable 
                                    users={staff}
                                    onViewDetails={(user) => {
                                        setSelectedUser(user);
                                        setDetailsDialogOpen(true);
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="admins">
                         <Card className="glass-pane mt-4">
                            <CardContent className="p-0">
                                <UserTable 
                                    users={admins}
                                    onViewDetails={(user) => {
                                        setSelectedUser(user);
                                        setDetailsDialogOpen(true);
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>

        {/* User Details Dialog */}
        <UserDetailsDialog 
            user={selectedUser}
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
        />
        </>
    );
}
