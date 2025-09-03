
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarCheck, UserPlus } from 'lucide-react';

export default function ReceptionistDashboardPage() {
  return (
    <div className="grid gap-6">
        <Card className="glass-pane">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Welcome, Receptionist</CardTitle>
                <CardDescription>Front desk operations command center.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Manage appointments, check in patients, and register new accounts.</p>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
             <Card className="glass-pane">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Today's Appointments</CardTitle>
                    <CalendarCheck className="h-6 w-6 text-primary" />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">15</p>
                    <p className="text-sm text-muted-foreground">8 confirmed, 2 pending.</p>
                    <Button asChild className="mt-4">
                        <Link href="/receptionist/appointments">Manage Appointments</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="glass-pane">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Patient Registration</CardTitle>
                    <UserPlus className="h-6 w-6 text-accent" />
                </CardHeader>
                <CardContent>
                   <p className="text-3xl font-bold">3</p>
                   <p className="text-sm text-muted-foreground">new patients registered today.</p>
                    <Button asChild className="mt-4" variant="secondary">
                        <Link href="/receptionist/patients">Register New Patient</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
