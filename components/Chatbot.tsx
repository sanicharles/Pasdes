
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';
import { ChatbotIcon, SendIcon } from '../icons';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    sender: 'bot',
                    text: 'Halo! Saya asisten AI. Ada yang bisa saya bantu tentang produk atau komunitas Wanita Tangguh?',
                },
            ]);
        }
    }, [isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: input,
            });
            const botMessage: ChatMessage = { sender: 'bot', text: response.text as string };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error fetching from Gemini API:', error);
            const errorMessage: ChatMessage = {
                sender: 'bot',
                text: 'Maaf, sepertinya ada masalah. Coba tanyakan lagi nanti.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-brand-gold text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200"
                    aria-label="Buka obrolan"
                >
                    <ChatbotIcon className="w-8 h-8"/>
                </button>
            </div>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-brand-white rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up">
                    <header className="bg-brand-green text-white p-4 rounded-t-2xl flex justify-between items-center">
                        <h3 className="font-bold text-lg">Asisten AI</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">&times;</button>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto bg-brand-pink/30">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                                <div className={`px-4 py-2 rounded-2xl max-w-xs ${
                                    msg.sender === 'user' 
                                    ? 'bg-brand-gold text-white rounded-br-none' 
                                    : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start mb-3">
                                <div className="px-4 py-2 rounded-2xl bg-white text-gray-900 rounded-bl-none shadow-sm">
                                    <span className="animate-pulse">Mengetik...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-brand-pink">
                        <div className="flex items-center bg-white border border-brand-pink rounded-full shadow-sm">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ketik pertanyaanmu..."
                                className="w-full px-4 py-2 bg-transparent focus:outline-none"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="bg-brand-green text-white p-2 rounded-full m-1 disabled:bg-gray-400 hover:bg-brand-dark transition-colors"
                                disabled={isLoading || !input.trim()}
                                aria-label="Kirim pesan"
                            >
                                <SendIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;