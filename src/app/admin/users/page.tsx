"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
};


// ...existing code...

// Removed duplicate default export function AdminUsersPage

const UserTable = ({ users }: { users: User[] }) => (
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
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


async function getUsers(): Promise<User[]> {
    // Replace this mock with your actual data fetching logic
    return [
        {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "patient",
            status: "Active",
            lastLogin: "2024-06-01",
        },
        {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "staff",
            status: "Online",
            lastLogin: "2024-06-02",
        },
    ];
}


// ...existing code...

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
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
        }
        fetchUsers();
    }, []);

    const patients = users.filter((user: User) => user.role === 'patient');
    const staff = users.filter((user: User) => user.role !== 'patient');

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="font-headline text-3xl">User Management</CardTitle>
                        <CardDescription>Manage all users in the Zizo_HealthVerse system.</CardDescription>
                    </div>
                    <Button className="btn-gradient animate-pulse-glow">Add New User</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="patients">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="patients">Patients</TabsTrigger>
                        <TabsTrigger value="staff">Staff</TabsTrigger>
                    </TabsList>
                    <TabsContent value="patients">
                        <Card className="glass-pane mt-4">
                            <CardContent className="p-0">
                                <UserTable users={patients} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="staff">
                         <Card className="glass-pane mt-4">
                            <CardContent className="p-0">
                                <UserTable users={staff} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
