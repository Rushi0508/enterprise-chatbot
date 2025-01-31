import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/app/types/chat";
import { ChatService } from "@/app/services/ChatService";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, sessionId } = body;
        const chatService = ChatService.getInstance();

        // Validate input
        if (!chatService.validateMessage(message)) {
            return NextResponse.json({ error: "Message cannot be empty", code: 400 }, { status: 400 });
        }

        // Get or create session
        const session = chatService.getSession(sessionId);

        // Create and add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            content: message,
            role: "user",
            timestamp: new Date(),
        };
        chatService.addMessageToSession(session, userMessage);

        // Generate and add assistant response
        const assistantMessage = await chatService.generateResponse(session);
        chatService.addMessageToSession(session, assistantMessage);

        return NextResponse.json({
            message: assistantMessage,
            session,
        });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            {
                error: "Failed to process your request. Please try again later.",
                code: error.status || 500,
            },
            { status: error.status || 500 }
        );
    }
}
