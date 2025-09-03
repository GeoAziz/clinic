
'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const conversations = {
  p_1: {
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    messages: [
      { from: 'patient', text: 'Thanks for the quick response, doctor!' },
      { from: 'doctor', text: 'You\'re welcome. Please follow the prescription and let me know if you have any questions.' },
    ],
  },
  p_2: {
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    messages: [
      { from: 'patient', text: 'Hi Dr. Reed, I wanted to follow up on my lab results.' },
    ],
  },
};

type ConversationId = keyof typeof conversations;

export default function DoctorMessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState<ConversationId>('p_1');
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            console.log(`Sending message to ${selectedConversation}: ${newMessage}`);
            // Here you would typically update the state and call an API
            setNewMessage('');
        }
    };
    
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
                            onClick={() => setSelectedConversation(id as ConversationId)}
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
                {selectedConversation && (
                    <>
                        <div className="p-4 border-b border-primary/20 flex items-center gap-4">
                             <Avatar className="w-10 h-10 border-2 border-primary/50">
                                <AvatarImage src={conversations[selectedConversation].avatar} />
                                <AvatarFallback>{conversations[selectedConversation].name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-headline text-lg">{conversations[selectedConversation].name}</h3>
                        </div>
                        
                        <ScrollArea className="flex-grow p-6 space-y-4">
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
                        </ScrollArea>

                        <div className="p-4 border-t border-primary/20">
                            <form onSubmit={handleSendMessage} className="relative">
                                <Input 
                                    placeholder="Type your message..." 
                                    className="pr-12 h-12 glass-pane focus:neon-border" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button type="submit" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 btn-gradient">
                                    <Send />
                                </Button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
}
