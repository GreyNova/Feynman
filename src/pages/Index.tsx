import FeynmanOrb from "@/components/FeynmanOrb";
import StatusBadge from "@/components/StatusBadge";
import MicButton from "@/components/MicButton";
import ChatHistory from "@/components/ChatHistory";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

const Index = () => {
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
    <div className="h-screen w-full flex overflow-hidden bg-background">
      {/* Main Content Area (Left/Center) */}
      <div className="flex-1 flex flex-col relative">
        {/* Header Overlay */}
        <header className="absolute top-0 w-full flex items-center justify-between px-8 py-6 z-10">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-status-connected animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-xl font-bold tracking-tight text-white/90 flex items-center gap-1">
              Feynman<span className="text-primary font-medium">AI</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
            <StatusBadge isConnected={isConnected} />
          </div>
        </header>

        {/* Center Stage (Orb & Status) */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 relative">
          {/* Subtle background glow behind orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-50 pointer-events-none" />
          
          <div className="mb-12 relative z-10 scale-110">
            <FeynmanOrb isListening={isListening} isSpeaking={isSpeaking} />
          </div>

          <div className="text-center space-y-4 relative z-10 mt-8">
            <h2 className="text-3xl font-semibold text-white/90 tracking-tight">
              {isProcessing
                ? "Processing..."
                : isListening
                ? "Listening..."
                : isSpeaking
                ? "Speaking..."
                : "Ready to study?"}
            </h2>
            <p className="text-white/50 max-w-md mx-auto text-lg font-light leading-relaxed h-14">
              {isProcessing
                ? (transcript || "Analyzing your question...")
                : isListening
                ? "Speak clearly, I'm listening to you"
                : isSpeaking
                ? "Listen to my response"
                : "Tap the microphone to start talking with Feynman about your subjects."}
            </p>
          </div>
        </main>

        {/* Mic Controls (Bottom Center) */}
        <div className="absolute bottom-10 w-full flex justify-center z-20">
          <div className="bg-black/30 p-2 rounded-full backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-2">
            <MicButton
              isListening={isListening}
              onClick={toggleListening}
              disabled={isProcessing || isSpeaking}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar (Zoom-like Chat Panel) */}
      <div className="w-[380px] lg:w-[420px] h-full flex-shrink-0 shadow-2xl z-20 hidden md:block">
        <ChatHistory messages={messages} />
      </div>
      
      {/* Mobile Chat View (Overlay or stacked, but for now we prioritize desktop) */}
      <div className="md:hidden absolute bottom-28 w-full px-4 z-10">
         <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 max-h-[30vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {messages.length > 0 ? (
                <div className="space-y-3">
                   {messages.slice(-3).map((m, i) => (
                      <div key={i} className={m.role === 'user' ? 'text-right text-primary text-sm' : 'text-left text-white/80 text-sm'}>
                        {m.content}
                      </div>
                   ))}
                </div>
            ) : (
                <div className="text-center text-white/50 text-sm">Chat transcript will appear here</div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Index;
