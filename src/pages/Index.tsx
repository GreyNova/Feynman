import { useState } from "react";
import { Briefcase, BookOpen, RefreshCw, Upload, ArrowLeft } from "lucide-react";
import FeynmanOrb from "@/components/FeynmanOrb";
import StatusBadge from "@/components/StatusBadge";
import MicButton from "@/components/MicButton";
import ChatHistory from "@/components/ChatHistory";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const {
    isListening,
    isSpeaking,
    isConnected,
    isProcessing,
    messages,
    transcript,
    toggleListening,
    stopSpeaking,
  } = useVoiceAssistant();

  // Category Selection Screen
  if (!selectedCategory) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        
        <div className="z-10 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Welcome to <span className="text-primary">Feynman AI</span>
          </h1>
          <p className="text-white/60 text-lg max-w-lg mx-auto">
            What would you like to focus on today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-6 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          {/* Category 1: Interview Preparation */}
          <button 
            onClick={() => setSelectedCategory('interview')}
            className="group relative flex flex-col items-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-primary/50 transition-all duration-300 text-center hover:-translate-y-2 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/30">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">1. Interview Prep</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Practice mock interviews, get feedback on your answers, and build confidence.
            </p>
            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary text-sm font-medium">
              Start Session &rarr;
            </div>
          </button>

          {/* Category 2: Study / Upload */}
          <button 
            onClick={() => setSelectedCategory('study')}
            className="group relative flex flex-col items-center p-8 rounded-3xl bg-primary/5 border border-primary/20 backdrop-blur-xl hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 text-center hover:-translate-y-2 shadow-[0_0_40px_rgba(34,197,94,0.1)]"
          >
            <div className="absolute -top-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              Recommended
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/30">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">2. Study Material</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Study your own material. Feynman will teach it back to you.
            </p>
            <div className="mt-auto inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Upload className="w-3.5 h-3.5" />
              Upload feature coming soon
            </div>
          </button>

          {/* Category 3: Revision */}
          <button 
            onClick={() => setSelectedCategory('revision')}
            className="group relative flex flex-col items-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-primary/50 transition-all duration-300 text-center hover:-translate-y-2 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/30">
              <RefreshCw className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">3. Revision</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Quickly review key concepts and test your knowledge before an exam.
            </p>
            <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary text-sm font-medium">
              Start Session &rarr;
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Active Voice Chat Session UI
  return (
    <div className="h-screen w-full flex overflow-hidden bg-background animate-in fade-in duration-500">
      {/* Main Content Area (Left/Center) */}
      <div className="flex-1 flex flex-col relative">
        {/* Header Overlay */}
        <header className="absolute top-0 w-full flex items-center justify-between px-8 py-6 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors backdrop-blur-md"
              title="Back to Menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-status-connected animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-xl font-bold tracking-tight text-white/90 flex items-center gap-1">
                Feynman<span className="text-primary font-medium">AI</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider mr-2 hidden sm:block">
              {selectedCategory === 'interview' ? 'Interview Prep' : selectedCategory === 'study' ? 'Study Mode' : 'Revision Mode'}
            </span>
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
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="w-14 h-14 rounded-full bg-destructive/20 hover:bg-destructive/40 text-destructive flex items-center justify-center transition-all duration-300 animate-in fade-in zoom-in ml-2 border border-destructive/30"
                title="Interrupt / Stop AI"
              >
                <div className="w-5 h-5 bg-destructive rounded-sm" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar (Zoom-like Chat Panel) */}
      <div className="w-[380px] lg:w-[420px] h-full flex-shrink-0 shadow-2xl z-20 hidden md:block border-l border-white/10">
        <ChatHistory messages={messages} />
      </div>
      
      {/* Mobile Chat View */}
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
