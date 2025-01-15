// import React, { useState, useEffect, useRef } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Send } from 'lucide-react';
// import { useAuthState } from '@/context/auth.context';

// const ChatComponent = ({ agentId }:{agentId:any}) => {
//   const [messages, setMessages] = useState<any>([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [connected, setConnected] = useState(false);
//   const websocketRef :any= useRef(null);
//   const messagesEndRef:any = useRef(null);
//   const { auth } = useAuthState();

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     // Connect to WebSocket
//     const connectWebSocket = () => {
//         const wsUrl = `wss://agentexperience.up.railway.app/agent/chat/${agentId}?token=${auth.token}`;
//         const ws = new WebSocket(wsUrl);

//       ws.onopen = () => {
//         console.log('Connected to WebSocket');
//         setConnected(true);
//       };

//       ws.onmessage = (event) => {
//         const newMessage = JSON.parse(event.data);
//         setMessages(prev => [...prev, newMessage]);
//       };

//       ws.onclose = () => {
//         console.log('Disconnected from WebSocket');
//         setConnected(false);
//         // Attempt to reconnect after 3 seconds
//         setTimeout(connectWebSocket, 3000);
//       };

//       ws.onerror = (error) => {
//         console.error('WebSocket error:', error);
//       };

//       websocketRef.current = ws;
//     };

//     connectWebSocket();

//     // Cleanup on component unmount
//     return () => {
//       if (websocketRef.current) {
//         websocketRef.current.close();
//       }
//     };
//   }, [agentId]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim() || !websocketRef.current) return;

//     websocketRef.current.send(JSON.stringify({
//       type: 'message',
//       content: inputMessage
//     }));

//     setInputMessage('');
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto h-screen max-h-[600px] flex flex-col">
  
//         {/* <ScrollArea className="flex-1 p-4 border rounded-md"> */}
//           <div className="space-y-4">
//             {messages?.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`max-w-[80%] p-3 rounded-lg ${
//                     msg.sender === 'user'
//                       ? 'bg-blue-500 text-white'
//                       : 'bg-gray-100 text-gray-900'
//                   }`}
//                 >
//                   {msg.content}
//                 </div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//         {/* </ScrollArea> */}
        
//         <form onSubmit={sendMessage} className="flex gap-2">
//           <Input
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             placeholder="Type your message..."
//             className="flex-1"
//           />
//           <Button type="submit" disabled={!connected}>
//             <Send className="h-4 w-4" />
//           </Button>
//         </form>
//     </div>
//   );
// };

// export default ChatComponent;