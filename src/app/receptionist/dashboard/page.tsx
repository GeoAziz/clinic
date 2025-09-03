
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarCheck, UserPlus, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Appointment } from '@/app/admin/appointments/page';
import type { User } from '@/app/admin/users/page';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalAppointments: number;
  confirmedAppointments: number;
  pendingAppointments: number;
  newPatientsToday: number;
}

const DashboardSkeleton = () => (
    <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-pane">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Today's Appointments</CardTitle>
                <CalendarCheck className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-44 mt-4" />
            </CardContent>
        </Card>
        <Card className="glass-pane">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Patient Registration</CardTitle>
                <UserPlus className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-48 mt-4" />
            </CardContent>
        </Card>
    </div>
);


export default function ReceptionistDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [appointmentsRes, usersRes] = await Promise.all([
                fetch('/api/admin/appointments'),
                fetch('/api/admin/users')
            ]);

            if (!appointmentsRes.ok || !usersRes.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const appointments: Appointment[] = await appointmentsRes.json();
            const users: User[] = await usersRes.json();

            const today = new Date().toISOString().split('T')[0];

            const todaysAppointments = appointments.filter(apt => apt.date === today);
            const newPatients = users.filter(user => user.role === 'patient' && user.createdAt.startsWith(today));
            
            setStats({
                totalAppointments: todaysAppointments.length,
                confirmedAppointments: todaysAppointments.filter(apt => apt.status === 'Confirmed').length,
                pendingAppointments: todaysAppointments.filter(apt => apt.status === 'Pending').length,
                newPatientsToday: newPatients.length
            });

        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not fetch dashboard data.'
            });
        } finally {
            setLoading(false);
        }
    };
    fetchDashboardData();
  }, [toast]);


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

        {loading ? <DashboardSkeleton /> : stats && (
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-pane">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Today's Appointments</CardTitle>
                        <CalendarCheck className="h-6 w-6 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalAppointments}</p>
                        <p className="text-sm text-muted-foreground">
                            {stats.confirmedAppointments} confirmed, {stats.pendingAppointments} pending.
                        </p>
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
                       <p className="text-3xl font-bold">{stats.newPatientsToday}</p>
                       <p className="text-sm text-muted-foreground">new patients registered today.</p>
                        <Button asChild className="mt-4" variant="secondary">
                            <Link href="/receptionist/patients">Register New Patient</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )}
    </div>
  );
}
