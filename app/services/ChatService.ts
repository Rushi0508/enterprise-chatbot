import { openai } from "@/lib/openai";
import { ChatSession, Message } from "@/app/types/chat";
import { AzureOpenAI } from "openai";
import fs from "fs";
import path from "path";

export class ChatService {
    private static instance: ChatService;
    private openai: AzureOpenAI;
    private sessions: Map<string, ChatSession>;
    private readonly MAX_RETRIES = 3;
    private readonly MAX_MESSAGES = 5;
    private readonly SYSTEM_PROMPT: Message = {
        id: "system",
        role: "system",
        content: "", // Will be populated from file
        timestamp: new Date(),
    };

    private constructor() {
        this.openai = openai;
        this.sessions = new Map<string, ChatSession>();
        const promptPath = path.join(process.cwd(), "app", "prompts", "worklog-assistant.md");
        const promptContent = fs.readFileSync(promptPath, "utf-8");
        this.SYSTEM_PROMPT.content = promptContent;
    }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    public getSession(sessionId: string): ChatSession {
        let session = this.sessions.get(sessionId);
        if (!session) {
            session = {
                id: sessionId,
                messages: [],
            };
            this.sessions.set(sessionId, session);
        }
        return session;
    }

    public addMessageToSession(session: ChatSession, message: Message): void {
        session.messages.push(message);
        this.truncateHistory(session);
    }

    private truncateHistory(session: ChatSession): void {
        if (session.messages.length > this.MAX_MESSAGES * 2) {
            session.messages = session.messages.slice(-this.MAX_MESSAGES * 2);
        }
    }

    private convertToOpenAIMessages(messages: Message[]) {
        return [
            this.SYSTEM_PROMPT,
            ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            })),
        ];
    }

    public async generateResponse(session: ChatSession): Promise<Message> {
        let retries = 0;
        let response;

        while (retries < this.MAX_RETRIES) {
            try {
                response = await this.openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: this.convertToOpenAIMessages(session.messages),
                    temperature: 0.7,
                });
                break;
            } catch (error) {
                retries++;
                if (retries === this.MAX_RETRIES) {
                    throw error;
                }
                await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retries) * 1000));
            }
        }

        if (!response?.choices[0]?.message?.content) {
            throw new Error("Invalid response from OpenAI");
        }

        const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response.choices[0].message.content,
            role: "assistant",
            timestamp: new Date(),
        };

        return assistantMessage;
    }

    public validateMessage(message: string): boolean {
        return Boolean(message?.trim());
    }
}
