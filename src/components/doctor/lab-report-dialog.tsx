
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type LabResult = { 
  id: string;
  patientName: string;
  testName: string;
  date: string;
  status: 'Requires Review' | 'Completed' | 'Pending';
  report: string;
};

interface LabReportDialogProps {
  result: LabResult | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LabReportDialog({ result, isOpen, onOpenChange }: LabReportDialogProps) {
  if (!result) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-pane">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Lab Report: {result.testName}</DialogTitle>
          <DialogDescription>
            Report for <span className="font-semibold text-primary">{result.patientName}</span> generated on {result.date}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <h4 className="font-medium">Status:</h4>
            <Badge variant={
                result.status === 'Requires Review' ? 'destructive' :
                result.status === 'Completed' ? 'default' :
                'secondary'
            } className={result.status === 'Completed' ? 'bg-green-500/20 text-green-300 border-green-500/50' : ''}>
                {result.status}
            </Badge>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Analysis</h4>
            <div className="text-sm text-muted-foreground bg-background/50 p-4 rounded-md border">
              {result.report || 'No report summary available.'}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
          {result.status === 'Requires Review' && (
             <Button variant="secondary">Add to Patient Chart</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
