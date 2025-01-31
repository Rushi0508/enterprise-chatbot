import { useEffect, useRef } from "react";
import { Message } from "@/app/types/chat";
import { MessageBubble } from "./MessageBubble";

interface ChatMessagesProps {
    messages: Message[];
    isTyping: boolean;
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
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
            <div ref={messagesEndRef} />
        </div>
    );
}
