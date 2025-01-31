import ReactMarkdown from "react-markdown";
import { Message } from "@/app/types/chat";

interface MessageBubbleProps {
    message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    isUser ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                }`}
            >
                {isUser ? (
                    <ReactMarkdown className={"text-sm"}>{message.content}</ReactMarkdown>
                ) : (
                    <div className="prose dark:prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
