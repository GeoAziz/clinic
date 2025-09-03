
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type LabResult = { 
  id: string;
  patientName: string;
  testName: string;
  date: string;
  status: 'Requires Review' | 'Completed' | 'Pending';
};

const labResults: LabResult[] = [
    { id: 'lab_1', patientName: 'John Doe', testName: 'Complete Blood Count', date: '2024-10-28', status: 'Requires Review' },
    { id: 'lab_2', patientName: 'Jane Smith', testName: 'Lipid Panel', date: '2024-10-28', status: 'Completed' },
    { id: 'lab_3', patientName: 'Sam Wilson', testName: 'Thyroid Panel', date: '2024-10-27', status: 'Completed' },
    { id: 'lab_4', patientName: 'Bucky Barnes', testName: 'Glucose Tolerance Test', date: '2024-10-26', status: 'Pending' },
];

export default function DoctorLabsPage() {
    const [results, setResults] = useState<LabResult[]>(labResults);
    const [sortConfig, setSortConfig] = useState<{ key: keyof LabResult, direction: 'asc' | 'desc' } | null>(null);

    const sortedResults = [...results].sort((a, b) => {
        if (!sortConfig) return 0;
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const requestSort = (key: keyof LabResult) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof LabResult) => {
      if (!sortConfig || sortConfig.key !== key) return null;
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    
    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Lab Results</CardTitle>
                <CardDescription>Review and manage patient lab results.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                              <Button variant="ghost" onClick={() => requestSort('patientName')}>
                                Patient {getSortIndicator('patientName')}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" onClick={() => requestSort('testName')}>
                                Test Name {getSortIndicator('testName')}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" onClick={() => requestSort('date')}>
                                Date {getSortIndicator('date')}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button variant="ghost" onClick={() => requestSort('status')}>
                                Status {getSortIndicator('status')}
                              </Button>
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedResults.map(result => (
                            <TableRow key={result.id}>
                                <TableCell className="font-medium">{result.patientName}</TableCell>
                                <TableCell>{result.testName}</TableCell>
                                <TableCell>{result.date}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        result.status === 'Requires Review' ? 'destructive' :
                                        result.status === 'Completed' ? 'default' :
                                        'secondary'
                                    } className={result.status === 'Completed' ? 'bg-green-500/20 text-green-300 border-green-500/50' : ''}>
                                        {result.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">View Report</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
