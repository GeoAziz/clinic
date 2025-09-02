
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Consultation', count: 45 },
  { name: 'Dental', count: 32 },
  { name: 'Lab Test', count: 56 },
  { name: 'Surgery', count: 12 },
  { name: 'Pediatrics', count: 28 },
];

export default function AnalyticsPage() {
    return (
        <div className="grid gap-6">
            <Card className="glass-pane">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Analytics & Reports</CardTitle>
                    <CardDescription>Insights into clinic performance and trends.</CardDescription>
                </CardHeader>
            </Card>

            <Card className="glass-pane">
                <CardHeader>
                    <CardTitle>Service Popularity</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
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
