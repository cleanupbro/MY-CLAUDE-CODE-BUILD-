import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SubmissionType } from '../types';
import { PRICING_KNOWLEDGE_BASE } from '../lib/knowledgeBase';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AdminChatBotProps {
    adminEmail: string;
    activeFilter: SubmissionType | 'All';
}

const AdminChatBot: React.FC<AdminChatBotProps> = ({ adminEmail, activeFilter }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Create context for the AI
    const adminName = adminEmail.split('@')[0] || 'Admin';
    const context = `CONTEXT: The user is ${adminName}. They are currently viewing the "${activeFilter}" submissions filter in the admin dashboard.`;
    const messageWithContext = `${context}\n\nUSER QUESTION: ${input}`;

    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));
      
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
            systemInstruction: `You are 'BroBot', a highly intelligent internal business consultant for Clean Up Bros. You are powered by Gemini 3 Pro.
            
            YOUR KNOWLEDGE BASE (PRICING & RULES):
            ${PRICING_KNOWLEDGE_BASE}
            
            Your goal is to help with complex business strategy, drafting sensitive client communications, and analyzing lead trends using the Pricing Rules above.
            Be professional, concise, and highly actionable.`,
        },
        history,
      });

      const response = await chat.sendMessage({ message: messageWithContext });

      const modelMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);

    } catch (e) {
      console.error("Chatbot error:", e);
      setError("Sorry, I'm having trouble connecting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-lg shadow-lg border">
      <div className="p-4 border-b bg-brand-navy text-white rounded-t-lg">
        <h3 className="text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            BroBot v3 (Pro)
        </h3>
        <p className="text-xs text-gray-300">Powered by Gemini 3 Pro - Ask about pricing, strategy, or leads.</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-prose p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-brand-gold text-brand-navy' : 'bg-white border border-gray-200 text-gray-800'}`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start mb-4">
                <div className="max-w-prose p-3 rounded-lg bg-white border border-gray-200">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        )}
        {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center mb-4">
                {error}
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask BroBot anything..."
            className="input flex-grow"
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className="btn-primary" disabled={isLoading || !input.trim()}>
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChatBot;