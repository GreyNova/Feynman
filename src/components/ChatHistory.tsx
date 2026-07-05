import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory = ({ messages }: ChatHistoryProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-black/20 backdrop-blur-3xl border-l border-white/10">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/20">
        <h2 className="text-lg font-semibold tracking-wide text-white/90">Meeting Chat</h2>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-2">
              <span className="text-xl">💬</span>
            </div>
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs">Start talking to Kiro to see the transcript here.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                message.role === "user" ? "ml-auto items-end" : "items-start"
              )}
            >
              <span className="text-[11px] font-medium text-white/40 mb-1 px-1 uppercase tracking-wider">
                {message.role === "user" ? "You" : "Kiro"}
              </span>
              <div
                className={cn(
                  "p-4 rounded-2xl shadow-sm text-sm leading-relaxed backdrop-blur-md",
                  message.role === "user"
                    ? "bg-primary/20 text-white border border-primary/30 rounded-tr-sm"
                    : "bg-white/5 text-white/90 border border-white/10 rounded-tl-sm"
                )}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
