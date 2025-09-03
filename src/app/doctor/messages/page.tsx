
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

type Message = { from: 'patient' | 'doctor'; text: string };
type Conversation = {
    name: string;
    avatar: string;
    messages: Message[];
};
type Conversations = Record<string, Conversation>;

export default function DoctorMessagesPage() {
    const [conversations, setConversations] = useState<Conversations>({});
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/doctor/messages');
            if (!res.ok) throw new Error('Failed to fetch conversations');
            const data = await res.json();
            setConversations(data);
            if (Object.keys(data).length > 0 && !selectedConversation) {
                setSelectedConversation(Object.keys(data)[0]);
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
        }
    }, [conversations, selectedConversation]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConversation && !sending) {
            setSending(true);
            const newMsg: Message = { from: 'doctor', text: newMessage.trim() };

            try {
                // Optimistically update UI
                const updatedConvo = {
                    ...conversations[selectedConversation],
                    messages: [...conversations[selectedConversation].messages, newMsg]
                };
                setConversations(prev => ({
                    ...prev,
                    [selectedConversation]: updatedConvo
                }));
                setNewMessage('');

                const response = await fetch('/api/doctor/messages/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        conversationId: selectedConversation,
                        message: newMsg,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to send message.');
                }
                
                await fetchConversations(); // Re-fetch to confirm state
                
            } catch (error: any) {
                toast({
                    variant: 'destructive',
                    title: 'Error sending message',
                    description: error.message,
                });
                 // Revert optimistic update on error
                fetchConversations();
            } finally {
                setSending(false);
            }
        }
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="ml-4 text-lg">Loading Conversations...</p>
            </div>
        )
    }

    return (
        <Card className="glass-pane w-full h-[calc(100vh-8rem)] flex overflow-hidden">
            {/* Conversation List */}
            <div className="w-1/3 border-r border-primary/20">
                <div className="p-4 border-b border-primary/20">
                    <h2 className="font-headline text-xl">Conversations</h2>
                </div>
                <ScrollArea className="h-full">
                    {Object.entries(conversations).map(([id, convo]) => (
                        <div key={id}
                            onClick={() => setSelectedConversation(id)}
                            className={cn(
                                "flex items-center gap-4 p-4 cursor-pointer hover:bg-primary/10 transition-colors",
                                selectedConversation === id && "bg-primary/20"
                            )}>
                            <Avatar className="w-12 h-12 border-2 border-primary/50">
                                <AvatarImage src={convo.avatar} />
                                <AvatarFallback>{convo.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow overflow-hidden">
                                <p className="font-semibold truncate">{convo.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{convo.messages.slice(-1)[0].text}</p>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Message Area */}
            <div className="w-2/3 flex flex-col">
                {selectedConversation && conversations[selectedConversation] ? (
                    <>
                        <div className="p-4 border-b border-primary/20 flex items-center gap-4">
                             <Avatar className="w-10 h-10 border-2 border-primary/50">
                                <AvatarImage src={conversations[selectedConversation].avatar} />
                                <AvatarFallback>{conversations[selectedConversation].name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-headline text-lg">{conversations[selectedConversation].name}</h3>
                        </div>
                        
                        <ScrollArea className="flex-grow p-6">
                           <div className="space-y-4" ref={scrollAreaRef}>
                            {conversations[selectedConversation].messages.map((msg, index) => (
                                <div key={index} className={cn(
                                    "flex items-end gap-2",
                                    msg.from === 'doctor' ? "justify-end" : "justify-start"
                                )}>
                                    {msg.from === 'patient' && (
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={conversations[selectedConversation].avatar} />
                                            <AvatarFallback>{conversations[selectedConversation].name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn(
                                        "max-w-xs md:max-w-md p-3 rounded-lg",
                                        msg.from === 'doctor' ? "bg-primary text-primary-foreground" : "glass-pane"
                                    )}>
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t border-primary/20">
                            <form onSubmit={handleSendMessage} className="relative">
                                <Input 
                                    placeholder="Type your message..." 
                                    className="pr-12 h-12 glass-pane focus:neon-border" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    disabled={sending}
                                />
                                <Button type="submit" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 btn-gradient" disabled={sending || !newMessage.trim()}>
                                    {sending ? <Loader2 className="animate-spin" /> : <Send />}
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <p>Select a conversation to start messaging.</p>
                  </div>
                )}
            </div>
        </Card>
    );
}
