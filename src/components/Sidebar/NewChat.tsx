import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useAuthState } from '@/context/auth.context';
import { io, Socket } from 'socket.io-client';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define proper types for messages
interface Message {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: number;
}

interface ChatComponentProps {
  agentId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ agentId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { auth } = useAuthState();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!auth.token || !agentId) {
      setError('Missing authentication token or agent ID');
      return;
    }

    try {
      // Initialize socket connection with better error handling
      const socket = io('https://agentexperience.up.railway.app', {
        path: '/socket.io', // Standard Socket.IO path
        auth: {
          token: auth.token,
          agentId: agentId
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        transports: ['websocket', 'polling'],
        forceNew: true,
        timeout: 10000
      });

      // Connection event handlers with improved error handling
      socket.on('connect', () => {
        console.log('Connected to chat server');
        setConnected(true);
        setError(null);
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setError('Failed to connect to chat server');
        setConnected(false);
      });

      socket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
        setConnected(false);
        if (reason === 'io server disconnect') {
          setError('Server disconnected the connection');
        }
      });

      // Message handling with proper typing
      socket.on('message', (newMessage: Message) => {
        try {
          setMessages(prev => [...prev, {
            ...newMessage,
            id: newMessage.id || Date.now().toString(),
            timestamp: newMessage.timestamp || Date.now()
          }]);
        } catch (error) {
          console.error('Error processing message:', error);
          setError('Error processing incoming message');
        }
      });

      socketRef.current = socket;

      // Cleanup on component unmount
      return () => {
        if (socketRef.current?.connected) {
          socketRef.current.disconnect();
        }
      };
    } catch (error) {
      console.error('Error setting up socket connection:', error);
      setError('Failed to initialize chat connection');
    }
  }, [agentId, auth.token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !socketRef.current?.connected) {
      return;
    }

    try {
      const messageData: Partial<Message> = {
        id: Date.now().toString(),
        sender: 'user',
        content: inputMessage.trim(),
        timestamp: Date.now()
      };

      // Emit message with acknowledgment
      socketRef.current.emit('message', messageData, (error: any) => {
        if (error) {
          console.error('Error sending message:', error);
          setError('Failed to send message');
          return;
        }
      });

      // Add user message to local state
      setMessages(prev => [...prev, messageData as Message]);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-screen max-h-[600px] flex flex-col">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={!connected}
          />
          <Button 
            type="submit" 
            disabled={!connected || !inputMessage.trim()}
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;