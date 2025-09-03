
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
import { EditUserDialog } from "@/components/admin/edit-user-dialog";
import { DeactivateUserDialog } from "@/components/admin/deactivate-user-dialog";


export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    createdAt: string;
};

const UserTable = ({ users, onUserSelect }: { users: User[], onUserSelect: (user: User, action: 'view' | 'edit' | 'deactivate') => void }) => (
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
                                <DropdownMenuItem onSelect={() => onUserSelect(user, 'view')}>View Details</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onUserSelect(user, 'edit')}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onUserSelect(user, 'deactivate')} className="text-destructive">Deactivate</DropdownMenuItem>
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
    
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

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

    const onUserChanged = () => {
        fetchUsers();
    }
    
    const handleUserSelect = (user: User, action: 'view' | 'edit' | 'deactivate') => {
        setSelectedUser(user);
        if (action === 'view') setIsDetailsOpen(true);
        if (action === 'edit') setIsEditOpen(true);
        if (action === 'deactivate') setIsDeactivateOpen(true);
    }

    const patients = users.filter((user: User) => user.role === 'patient');
    const staff = users.filter((user: User) => ['doctor', 'nurse', 'receptionist'].includes(user.role));
    const admins = users.filter((user: User) => user.role === 'admin');

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
                        <CreateUserDialog onUserCreated={onUserChanged} />
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
                                    <UserTable users={patients} onUserSelect={handleUserSelect} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="staff">
                            <Card className="glass-pane mt-4">
                                <CardContent className="p-0">
                                    <UserTable users={staff} onUserSelect={handleUserSelect} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="admins">
                            <Card className="glass-pane mt-4">
                                <CardContent className="p-0">
                                    <UserTable users={admins} onUserSelect={handleUserSelect} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {selectedUser && (
                <>
                    <UserDetailsDialog 
                        user={selectedUser}
                        open={isDetailsOpen}
                        onOpenChange={setIsDetailsOpen}
                    />
                    <EditUserDialog
                        user={selectedUser}
                        isOpen={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        onUserUpdated={onUserChanged}
                    />
                    <DeactivateUserDialog
                        user={selectedUser}
                        isOpen={isDeactivateOpen}
                        onOpenChange={setIsDeactivateOpen}
                        onUserDeactivated={onUserChanged}
                    />
                </>
            )}
        </>
    );
}
