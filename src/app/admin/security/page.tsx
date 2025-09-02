
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const logs = [
  { id: 'log_1', user: 'admin@clinic.io', action: 'Logged in', ip: '192.168.1.1', timestamp: '2024-10-28 10:00:00', status: 'Success' },
  { id: 'log_2', user: 'admin@clinic.io', action: 'Viewed User Management', ip: '192.168.1.1', timestamp: '2024-10-28 10:01:15', status: 'Success' },
  { id: 'log_3', user: 'system', action: 'Failed login attempt', ip: '10.0.0.5', timestamp: '2024-10-28 09:30:45', status: 'Failure' },
];

export default function SecurityLogsPage() {
    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Security & Logs</CardTitle>
                <CardDescription>Audit trail of all system activities.</CardDescription>
            </CardHeader>
            <CardContent>
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
                                <TableCell>{log.user}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.ip}</TableCell>
                                <TableCell>{log.timestamp}</TableCell>
                                <TableCell>
                                    <Badge variant={log.status === 'Success' ? 'default' : 'destructive'}
                                           className={log.status === 'Success' ? 'bg-green-500/20 text-green-300 border-green-500/50' : ''}>
                                        {log.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
