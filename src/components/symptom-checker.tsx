
'use client';

import { useState, useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Bot, User, CornerDownLeft, Loader2, Calendar, Phone } from 'lucide-react';
import { checkSymptoms } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AISymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import Link from 'next/link';

const initialState = {
  error: null,
  data: null,
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="icon" className="absolute bottom-2 right-2">
      {pending ? <Loader2 className="animate-spin" /> : <CornerDownLeft />}
    </Button>
  );
};

const VoiceButton = ({ setText, isListening, setIsListening }: { setText: (text: string) => void, isListening: boolean, setIsListening: (isListening: boolean) => void }) => {
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setText(transcript);
        };
        recognitionRef.current = recognition;
      }
    }
  }, [setIsListening, setText]);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };
  
  if (!recognitionRef.current) return null;

  return (
    <Button type="button" onClick={handleMicClick} size="icon" variant="ghost" className={cn("absolute bottom-2 right-12", isListening && "text-destructive animate-pulse")}>
      <Mic />
    </Button>
  );
};


export default function SymptomChecker() {
  const [state, formAction] = useActionState(checkSymptoms, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    if (state.data) {
      formRef.current?.reset();
      setSymptoms('');
    }
  }, [state, toast]);
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSymptoms(e.target.value);
  };
  
  const setTranscript = (transcript: string) => {
    setSymptoms(transcript);
  }
  
  const resultData = state.data as AISymptomCheckerOutput & { symptoms: string } | null;

  return (
    <Card className="glass-pane neon-border-accent w-full">
      <CardHeader>
        <CardTitle className="font-headline text-3xl flex items-center gap-2">
          <Bot className="h-8 w-8 text-accent" />
          AI Nurse Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-96 space-y-4 overflow-y-auto rounded-lg border bg-background/30 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Bot size={20} />
              </div>
              <div className="glass-pane rounded-lg border-accent/50 p-3">
                <p className="font-semibold text-accent">AI Nurse</p>
                <p className="text-sm">Hello, please describe your symptoms. You can type or use the microphone icon.</p>
              </div>
            </div>

            {resultData && (
                <>
                <div className="flex items-start gap-3 justify-end">
                    <div className="glass-pane rounded-lg p-3 text-right">
                        <p className="font-semibold">You</p>
                        <p className="text-sm">{resultData.symptoms}</p>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <User size={20} />
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Bot size={20} />
                    </div>
                    <div className="space-y-2">
                        <div className="glass-pane rounded-lg border-accent/50 p-3">
                            <p className="font-semibold text-accent">AI Nurse Analysis</p>
                            <p className="text-sm">
                                <strong>Pre-Diagnosis:</strong> {resultData.preDiagnosis}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <strong>Triage Score:</strong>
                                <div className="relative w-24 h-4 bg-muted rounded-full overflow-hidden">
                                    <div className="absolute h-full bg-destructive transition-all" style={{width: `${resultData.triageScore * 10}%`}}></div>
                                </div>
                                <span className="font-bold text-lg">{resultData.triageScore}/10</span>
                            </div>
                        </div>
                        {resultData.triageScore >= 7 ? (
                             <Button variant="destructive" className="animate-pulse" asChild>
                                <a href="tel:+1-555-765-4321">
                                    <Phone className="mr-2" /> Emergency - Call Now
                                </a>
                            </Button>
                        ) : (
                            <Button className="btn-gradient" asChild>
                                <Link href="/book">
                                    <Calendar className="mr-2"/> Book an Appointment
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
                </>
            )}
          </div>
          <form action={(formData) => {
            formData.set('symptoms', symptoms); // Ensure the latest state is in formData
            formAction(formData);
          }} ref={formRef}>
            <div className="relative">
              <Textarea
                name="symptoms"
                value={symptoms}
                onChange={handleTextareaChange}
                placeholder="e.g., I have a headache, fever, and a sore throat..."
                className="pr-24"
                rows={3}
              />
              <VoiceButton setText={setTranscript} isListening={isListening} setIsListening={setIsListening} />
              <SubmitButton />
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
