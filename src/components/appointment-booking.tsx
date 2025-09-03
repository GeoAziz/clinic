
'use client';

import { useState, useActionState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from '@/hooks/use-toast';
import { Stethoscope, User, CalendarDays, Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { createAppointment } from '@/app/actions';

interface Service {
    id: number;
    name: string;
    icon: LucideIcon;
}

interface Doctor {
    id: number;
    name: string;
    specialty: string;
    avatar: string;
    serviceIds: number[];
}


const services: Service[] = [
  { id: 1, name: 'Consultation', icon: Stethoscope },
  { id: 2, name: 'Dental', icon: User },
  { id: 3, name: 'Lab Test', icon: User },
];

const allDoctors: Doctor[] = [
  { id: 1, name: 'Dr. Evelyn Reed', specialty: 'Cybernetics', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', serviceIds: [1, 2] },
  { id: 2, name: 'Dr. Kenji Tanaka', specialty: 'Genetics', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', serviceIds: [1, 3] },
  { id: 3, name: 'Dr. Anya Sharma', specialty: 'Neurology', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', serviceIds: [1, 3] },
];

const timeSlots = [ '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00' ];

const initialState = {
  message: '',
  error: null,
};


export default function AppointmentBooking() {
  const [state, formAction] = useActionState(createAppointment, initialState);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handledStateRef = useRef(false);

  const handleServiceSelection = (service: Service) => {
    setSelectedService(service);
    setSelectedDoctor(null); // Reset doctor selection when service changes
  }
  
  const handleDoctorSelection = (doctor: Doctor) => {
      setSelectedDoctor(doctor);
  }

  const handleNextStep = () => {
    if (step === 1 && !selectedService) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a service.' });
        return;
    }
    if (step === 2 && !selectedDoctor) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a doctor.' });
        return;
    }
    if (step === 3 && (!date || !selectedTime)) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a date and time.' });
        return;
    }
    setStep(s => s + 1);
  };

  const handlePrevStep = () => setStep(s => s - 1);
  
  const handleBooking = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    handledStateRef.current = false; // Reset for the new submission
    
    if (!selectedService || !selectedDoctor || !date || !selectedTime) {
      toast({ variant: 'destructive', title: 'Error', description: 'Missing appointment details.' });
      setIsSubmitting(false);
      return;
    }
    
    const formData = new FormData(formRef.current!);
    formAction(formData);
  };
  
    // Effect to handle server action result
  useEffect(() => {
    if (state.message && !handledStateRef.current) {
      setIsSubmitting(false);
       handledStateRef.current = true; // Mark state as handled
      if (state.message.includes('successfully')) {
        toast({
          title: '🚀 Appointment Confirmed!',
          description: 'See you soon.',
        });
        setStep(1);
        setSelectedService(null);
        setSelectedDoctor(null);
        setDate(new Date());
        setSelectedTime(null);
        formRef.current?.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Booking Failed',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  const availableDoctors = selectedService
    ? allDoctors.filter(doctor => doctor.serviceIds.includes(selectedService.id))
    : [];

  return (
    <Card className="glass-pane w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              Book an Appointment
            </CardTitle>
            <div className="text-sm text-muted-foreground">Step {step} of 4</div>
        </div>
        <div className="w-full bg-primary/20 h-1 rounded-full mt-2">
            <div className="bg-primary h-1 rounded-full transition-all duration-300" style={{width: `${(step/4)*100}%`}}></div>
        </div>
      </CardHeader>
      <form ref={formRef}>
      {selectedService && <input type="hidden" name="service" value={selectedService.name} />}
      {selectedDoctor && <input type="hidden" name="doctorId" value={`doc_${selectedDoctor.id}`} />}
      {selectedDoctor && <input type="hidden" name="doctorName" value={selectedDoctor.name} />}
      {date && <input type="hidden" name="date" value={date.toISOString().split('T')[0]} />}
      {selectedTime && <input type="hidden" name="time" value={selectedTime} />}
      <input type="hidden" name="patientId" value="p_1" />
      <input type="hidden" name="patientName" value="John Doe (Booked)" />

      <CardContent className="min-h-[400px]">
        {step === 1 && (
            <div>
                <h3 className="mb-4 text-xl font-semibold text-center font-headline">1. Choose Service</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.map(service => (
                        <Card key={service.id} onClick={() => handleServiceSelection(service)}
                            className={cn('glass-pane text-center p-6 cursor-pointer group hover:neon-border transition-all', selectedService?.id === service.id && 'neon-border')}>
                            <div className="flex justify-center mb-4">
                                <service.icon className="h-12 w-12 text-primary group-hover:neon-glow-primary transition-all"/>
                            </div>
                            <h4 className="text-lg font-bold font-headline">{service.name}</h4>
                        </Card>
                    ))}
                </div>
            </div>
        )}
        {step === 2 && (
            <div>
                <h3 className="mb-4 text-xl font-semibold text-center font-headline">2. Select Doctor</h3>
                {availableDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {availableDoctors.map(doctor => (
                            <Card key={doctor.id} onClick={() => handleDoctorSelection(doctor)}
                                className={cn('glass-pane p-4 cursor-pointer group hover:neon-border transition-all flex flex-col items-center text-center', selectedDoctor?.id === doctor.id && 'neon-border')}>
                                <Avatar className="w-20 h-20 mb-4 border-2 border-primary/50 group-hover:border-accent">
                                    <AvatarImage src={doctor.avatar} />
                                    <AvatarFallback>{doctor.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <h4 className="font-bold font-headline">{doctor.name}</h4>
                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">No doctors available for the selected service. Please go back and choose another service.</p>
                )}
            </div>
        )}
        {step === 3 && (
            <div className="grid md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="mb-4 text-xl font-semibold text-center font-headline">3. Pick Date</h3>
                    <div className="flex justify-center">
                        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md glass-pane"
                        classNames={{ day_selected: 'bg-primary text-primary-foreground neon-glow-primary', day_today: 'text-accent neon-glow-accent' }}/>
                    </div>
                </div>
                <div>
                    <h3 className="mb-4 text-xl font-semibold text-center font-headline">4. Pick Time</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map(time => (
                            <Button key={time} type="button" variant={selectedTime === time ? 'default' : 'outline'} onClick={() => setSelectedTime(time)}
                                    className={cn('neon-border', selectedTime === time && 'animate-pulse-glow')}>
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        )}
        {step === 4 && (
            <div>
                 <h3 className="mb-4 text-xl font-semibold text-center font-headline">5. Confirmation</h3>
                 <Card className="glass-pane p-6">
                    <CardTitle className="font-headline text-2xl mb-4">Appointment Details</CardTitle>
                    <div className="space-y-3 text-muted-foreground">
                        <p><strong>Service:</strong> {selectedService?.name}</p>
                        <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
                        <p><strong>Date:</strong> {date?.toDateString()}</p>
                        <p><strong>Time:</strong> {selectedTime}</p>
                    </div>
                 </Card>
            </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && (
            <Button variant="outline" onClick={handlePrevStep} className="neon-border" type="button">
                <ArrowLeft className="mr-2"/>
                Back
            </Button>
        )}
        <div className="flex-grow"></div>
        {step < 4 && (
            <Button onClick={handleNextStep} className="btn-gradient animate-pulse-glow" type="button">
                Next
                <ArrowRight className="ml-2"/>
            </Button>
        )}
        {step === 4 && (
             <Button onClick={handleBooking} className="btn-gradient animate-pulse-glow" disabled={isSubmitting} type="submit">
                {isSubmitting ? <Loader2 className="mr-2 animate-spin" /> : <Check className="mr-2"/>}
                Confirm Booking
            </Button>
        )}
      </CardFooter>
    </form>
    </Card>
  );
}
