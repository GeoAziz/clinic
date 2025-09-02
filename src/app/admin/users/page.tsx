import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminDb } from '@/lib/firebase/admin';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
};

async function getUsers(): Promise<User[]> {
    if (!adminDb) {
        console.error("Firebase Admin DB is not initialized.");
        return [];
    }
    try {
        const usersSnapshot = await adminDb.collection('users').get();
        const users = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.displayName || data.fullName || 'N/A',
                email: data.email,
                role: data.role,
                status: 'Active', // Placeholder
                lastLogin: 'N/A', // Placeholder
            };
        });
        return users;
    } catch(error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

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


export default async function UserManagementPage() {
    const users = await getUsers();
    const patients = users.filter(user => user.role === 'patient');
    const staff = users.filter(user => user.role !== 'patient');

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
