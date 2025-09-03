
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LabReportDialog } from '@/components/doctor/lab-report-dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type LabResult = { 
  id: string;
  patientName: string;
  testName: string;
  date: string;
  status: 'Requires Review' | 'Completed' | 'Pending';
  report: string;
};

export default function DoctorLabsPage() {
    const [results, setResults] = useState<LabResult[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [sortConfig, setSortConfig] = useState<{ key: keyof LabResult, direction: 'asc' | 'desc' } | null>(null);
    const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
    const [isReportOpen, setIsReportOpen] = useState(false);

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/doctor/labs');
                if (!response.ok) {
                    throw new Error('Failed to fetch lab results');
                }
                const data = await response.json();
                setResults(data);
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not fetch lab results data.'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLabs();
    }, [toast]);

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

    const handleViewReport = (result: LabResult) => {
        setSelectedResult(result);
        setIsReportOpen(true);
    };
    
    return (
        <>
            <Card className="glass-pane w-full">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Lab Results</CardTitle>
                    <CardDescription>Review and manage patient lab results.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                            <p className="ml-4 text-lg">Loading Lab Results...</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                           No lab results found for your patients.
                       </div>
                    ) : (
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
                                        <Button variant="outline" size="sm" onClick={() => handleViewReport(result)}>View Report</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
            {selectedResult && (
                <LabReportDialog 
                    result={selectedResult}
                    isOpen={isReportOpen}
                    onOpenChange={setIsReportOpen}
                />
            )}
        </>
    );
}
