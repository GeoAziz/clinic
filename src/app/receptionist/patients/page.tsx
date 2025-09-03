
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { UserDetailsDialog } from "@/components/admin/user-details-dialog";
import { EditUserDialog } from "@/components/admin/edit-user-dialog";

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    createdAt: string;
};

const UserTable = ({ users, onUserSelect }: { users: User[], onUserSelect: (user: User, action: 'view' | 'edit') => void }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Email</TableHead>
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
                    </TableCell>
                    <TableCell>
                         <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
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
                                <DropdownMenuItem onSelect={() => onUserSelect(user, 'edit')}>Edit Profile</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

export default function ReceptionistPatientPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            // Filter for patients only
            setUsers(data.filter((u: User) => u.role === 'patient'));
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
    
    const handleUserSelect = (user: User, action: 'view' | 'edit') => {
        setSelectedUser(user);
        if (action === 'view') setIsDetailsOpen(true);
        if (action === 'edit') setIsEditOpen(true);
    }

    if (loading) return <div>Loading patients...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Card className="glass-pane w-full">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="font-headline text-3xl">Patient Registration</CardTitle>
                            <CardDescription>Manage and register new patients.</CardDescription>
                        </div>
                        <CreateUserDialog onUserCreated={onUserChanged} />
                    </div>
                </CardHeader>
                <CardContent>
                     <UserTable users={users} onUserSelect={handleUserSelect} />
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
                </>
            )}
        </>
    );
}
