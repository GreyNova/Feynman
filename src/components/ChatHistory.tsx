import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatHistoryProps {
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
}

const ChatHistory = ({ messages, isOpen, onClose }: ChatHistoryProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-card border-l border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Chat History</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-65px)]">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start talking to Kiro!
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-xl max-w-[85%]",
                  message.role === "user"
                    ? "bg-primary/20 ml-auto text-foreground"
                    : "bg-secondary text-foreground"
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
