
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const patients = [
  { id: 'p_1', name: 'John Doe', age: 34, lastVisit: '2024-10-28', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'p_2', name: 'Jane Smith', age: 45, lastVisit: '2024-10-20', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
  { id: 'p_3', name: 'Sam Wilson', age: 28, lastVisit: '2024-09-15', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
];

export default function DoctorPatientsPage() {
    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">My Patients</CardTitle>
                <CardDescription>A list of patients under your care.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Last Visit</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patients.map(p => (
                            <TableRow key={p.id}>
                                <TableCell className="flex items-center gap-4">
                                     <Avatar className="w-10 h-10 border-2 border-primary/50">
                                        <AvatarImage src={p.avatar} />
                                        <AvatarFallback>{p.name.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{p.name}</span>
                                </TableCell>
                                <TableCell>{p.age}</TableCell>
                                <TableCell>{p.lastVisit}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">View Chart</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
