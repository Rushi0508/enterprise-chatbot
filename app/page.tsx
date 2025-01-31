"use client";

import { useState } from "react";
import { BotMessageSquare, X } from "lucide-react";
import Chat from "./components/Chat";

export default function Home() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <main className="min-h-screen p-4">
            <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4">
                {isChatOpen && (
                    <div className="w-[400px] 2xl:w-[500px] mb-4">
                        <Chat />
                    </div>
                )}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {isChatOpen ? <X size={24} /> : <BotMessageSquare size={24} />}
                </button>
            </div>
        </main>
    );
}
