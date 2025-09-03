
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Appointment } from '../appointments/page';

interface ChartData {
    name: string;
    count: number;
}

export default function AnalyticsPage() {
    const [serviceData, setServiceData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/admin/appointments');
                if (!res.ok) throw new Error('Failed to fetch appointment data');
                const appointments: Appointment[] = await res.json();
                
                const serviceCounts = appointments.reduce((acc, apt) => {
                    acc[apt.service] = (acc[apt.service] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                const chartData = Object.entries(serviceCounts).map(([name, count]) => ({
                    name,
                    count
                }));
                
                setServiceData(chartData);

            } catch (err: any) {
                toast({
                    variant: 'destructive',
                    title: 'Error fetching analytics',
                    description: err.message,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchAnalyticsData();
    }, [toast]);

    return (
        <div className="grid gap-6">
            <Card className="glass-pane">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Analytics & Reports</CardTitle>
                    <CardDescription>Live insights into clinic performance and trends.</CardDescription>
                </CardHeader>
            </Card>

            <Card className="glass-pane">
                <CardHeader>
                    <CardTitle>Service Popularity</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                         <div className="flex items-center justify-center h-[300px]">
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        </div>
                    ) : serviceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={serviceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                      backgroundColor: 'hsl(var(--background) / 0.8)',
                                      borderColor: 'hsl(var(--border))'
                                    }}
                                    cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-muted-foreground text-center h-[300px] flex items-center justify-center">No appointment data available to display analytics.</p>
                    )}
                </CardContent>
            </Card>
             <Card className="glass-pane">
                <CardHeader>
                    <CardTitle>Doctor Load</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Doctor load chart coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
