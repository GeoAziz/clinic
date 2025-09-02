
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Activity, Bell } from 'lucide-react';

const chartData = [
  { day: 'Mon', patients: 32 },
  { day: 'Tue', patients: 45 },
  { day: 'Wed', patients: 64 },
  { day: 'Thu', patients: 58 },
  { day: 'Fri', patients: 72 },
  { day: 'Sat', patients: 25 },
];

const staff = [
  { name: 'Dr. Evelyn Reed', role: 'Doctor', status: 'Online' },
  { name: 'Dr. Kenji Tanaka', role: 'Doctor', status: 'Offline' },
  { name: 'Nurse RX-8', role: 'Nurse', status: 'Online' },
  { name: 'Admin Unit 734', role: 'Admin', status: 'Online' },
];

export default function AdminDashboardPreview() {
  return (
    <Card className="glass-pane w-full">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Admin Mission Control</CardTitle>
        <CardDescription>Live overview of clinic operations. This is a visual preview.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass-pane">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">+12% from last cycle</p>
            </CardContent>
          </Card>
          <Card className="glass-pane">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">All Systems Nominal</div>
              <p className="text-xs text-muted-foreground">Last check: 2 minutes ago</p>
            </CardContent>
          </Card>
          <Card className="glass-pane">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">3</div>
              <p className="text-xs text-muted-foreground">High priority triage cases</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="glass-pane">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Weekly Patient Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                  <XAxis dataKey="day" stroke="hsl(var(--foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background) / 0.8)',
                      borderColor: 'hsl(var(--border))'
                    }}
                    cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                  />
                  <Bar dataKey="patients" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="glass-pane">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Staff Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.name}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <Badge variant={member.status === 'Online' ? 'default' : 'secondary'}
                               className={member.status === 'Online' ? 'bg-green-500/20 text-green-300 border-green-500/50' : ''}>
                          {member.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
