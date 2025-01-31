"use client";

import { useState } from "react";
import { Message, ChatResponse, ErrorResponse } from "@/app/types/chat";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";

export default function Chat() {
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: input,
                    sessionId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorData = data as ErrorResponse;
                throw new Error(errorData.error || "Failed to send message");
            }

            const chatResponse = data as ChatResponse;
            setMessages(chatResponse.session.messages);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-[80vh] w-full border rounded-2xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
            <ChatHeader />

            {error && <div className="p-4 mb-4 text-red-500 bg-red-100 rounded-lg">{error}</div>}

            <ChatMessages messages={messages} isTyping={isTyping} />

            <ChatInput input={input} setInput={setInput} onSubmit={handleSubmit} />
        </div>
    );
}
