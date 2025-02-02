export interface Message {
    id: string;
    content: string;
    role: "user" | "assistant" | "system";
    timestamp: Date;
}

export interface ChatSession {
    id: string;
    messages: Message[];
}

export interface ChatResponse {
    message: Message;
    session: ChatSession;
}

export interface ErrorResponse {
    error: string;
    code: number;
}
