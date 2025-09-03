
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Appointment } from '../appointments/page';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';


interface ChartData {
    name: string;
    count: number;
}

const chartConfig = {
  count: {
    label: "Appointments",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function AnalyticsPage() {
    const [serviceData, setServiceData] = useState<ChartData[]>([]);
    const [doctorLoadData, setDoctorLoadData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/admin/appointments');
                if (!res.ok) throw new Error('Failed to fetch appointment data');
                const appointments: Appointment[] = await res.json();
                
                // Process service popularity data
                const serviceCounts = appointments.reduce((acc, apt) => {
                    acc[apt.service] = (acc[apt.service] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                const serviceChartData = Object.entries(serviceCounts).map(([name, count]) => ({
                    name,
                    count
                }));
                setServiceData(serviceChartData);

                // Process doctor load data
                const doctorCounts = appointments.reduce((acc, apt) => {
                    acc[apt.doctorName] = (acc[apt.doctorName] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                const doctorChartData = Object.entries(doctorCounts).map(([name, count]) => ({
                    name,
                    count
                }));
                setDoctorLoadData(doctorChartData);


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

             <div className="grid md:grid-cols-2 gap-6">
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
                           <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                                <BarChart accessibilityLayer data={serviceData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                                </BarChart>
                            </ChartContainer>
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
                        {loading ? (
                            <div className="flex items-center justify-center h-[300px]">
                                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                            </div>
                        ) : doctorLoadData.length > 0 ? (
                            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                                <BarChart accessibilityLayer data={doctorLoadData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.split(' ').pop()} // Show last name
                                    />
                                    <YAxis />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                     <Legend />
                                    <Bar dataKey="count" fill="var(--color-count)" radius={4} name="Appointments" />
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <p className="text-muted-foreground text-center h-[300px] flex items-center justify-center">No doctor data available to display analytics.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
