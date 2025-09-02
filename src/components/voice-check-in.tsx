
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function VoiceCheckIn() {
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState('Tap orb to start voice check-in');
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setStatusText('Listening for your name...');
        };
        recognition.onend = () => {
          setIsListening(false);
          setStatusText('Tap orb to start voice check-in');
        };
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setStatusText(`Verifying: ${transcript}...`);
          setTimeout(() => {
            toast({ title: 'Check-in Confirmed!', description: `Welcome, ${transcript}.` });
            setStatusText('Check-in Complete!');
          }, 1500);
        };
        recognition.onerror = () => {
            setStatusText('Voice not recognized. Please try again.');
        }
        recognitionRef.current = recognition;
      } else {
        setStatusText('Voice recognition not supported by browser.');
      }
    }
  }, [toast]);

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <Card className="glass-pane flex h-full flex-col items-center justify-center p-8">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl">Voice Check-In</CardTitle>
        <CardDescription>{statusText}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow items-center justify-center">
        <button
          onClick={handleMicClick}
          className={cn(
            'relative flex h-48 w-48 items-center justify-center rounded-full border-2 border-primary transition-all duration-300',
            isListening ? 'animate-pulse-glow bg-primary/20 neon-border-primary' : 'bg-primary/5'
          )}
          aria-label="Start Voice Check-in"
        >
          <div className={cn('absolute inset-0 rounded-full', isListening && 'animate-ping bg-primary/30')} />
          <Mic className={cn('h-20 w-20 text-primary transition-all', isListening && 'scale-110 neon-glow-primary')} />
        </button>
      </CardContent>
    </Card>
  );
}
