import { useState } from "react";
import { MessageSquare } from "lucide-react";
import KiroOrb from "@/components/KiroOrb";
import StatusBadge from "@/components/StatusBadge";
import MicButton from "@/components/MicButton";
import ChatHistory from "@/components/ChatHistory";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const {
    isListening,
    isSpeaking,
    isConnected,
    isProcessing,
    messages,
    transcript,
    toggleListening,
  } = useVoiceAssistant();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-status-connected animate-pulse" />
          <span className="text-xl font-semibold text-foreground">
            Kiro<span className="text-muted-foreground">-AI</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <StatusBadge isConnected={isConnected} />
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        {/* Orb */}
        <div className="mb-16">
          <KiroOrb isListening={isListening} isSpeaking={isSpeaking} />
        </div>

        {/* Status Text */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            {isProcessing
              ? "Processing..."
              : isListening
              ? "Listening..."
              : isSpeaking
              ? "Speaking..."
              : "Ready to study?"}
          </h2>
          <p className="text-muted-foreground max-w-sm">
            {isProcessing
              ? transcript || "Analyzing your question..."
              : isListening
              ? "Speak clearly, I'm listening to you"
              : isSpeaking
              ? "Listen to my response"
              : "Tap the microphone to start talking with Kiro about your subjects."}
          </p>
        </div>
      </main>

      {/* Mic Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <MicButton
          isListening={isListening}
          onClick={toggleListening}
          disabled={isProcessing || isSpeaking}
        />
      </div>

      {/* Chat History Panel */}
      <ChatHistory
        messages={messages}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default Index;
