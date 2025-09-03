
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Appointment } from '@/app/doctor/appointments/page';
import { useState } from 'react';


interface AddConsultationNotesDialogProps {
  appointment: Omit<Appointment, 'patient'> & { patient?: string, patientName?: string } | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddConsultationNotesDialog({ appointment, isOpen, onOpenChange }: AddConsultationNotesDialogProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    console.log(`Saving notes for appointment ${appointment?.id}: ${notes}`);
    toast({
      title: 'Notes Saved!',
      description: `Consultation notes for ${appointment?.patientName} have been saved.`,
    });
    onOpenChange(false);
    setNotes('');
  };
  
  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-pane">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Add Consultation Notes</DialogTitle>
          <DialogDescription>
            For appointment with <span className="font-semibold text-primary">{appointment.patientName}</span> on {appointment.date} at {appointment.time}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="notes">Consultation Notes</Label>
          <Textarea 
            id="notes" 
            className="mt-2 min-h-[200px] glass-pane focus:neon-border" 
            placeholder="Enter consultation details, observations, and next steps..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Notes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
