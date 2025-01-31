"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: "user",
            timestamp: new Date(),
        };

        setMessages([...messages, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                content:
                    "This is a sample response from the AI assistant. You can replace this with actual API calls later.",
                role: "assistant",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-[90vh] w-full max-w-3xl mx-auto border rounded-2xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
            {/* Chat header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-outfit font-semibold text-gray-800 dark:text-gray-100">Chat Assistant</h2>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                message.role === "user"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-700">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                    />
                    <button
                        type="submit"
                        className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}
