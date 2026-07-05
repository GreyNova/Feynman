import { cn } from "@/lib/utils";

interface FeynmanOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
}

const FeynmanOrb = ({ isListening, isSpeaking }: FeynmanOrbProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ring */}
      <div
        className={cn(
          "absolute w-72 h-72 rounded-full border border-primary/20",
          "animate-pulse-ring-outer"
        )}
      />
      
      {/* Middle ring */}
      <div
        className={cn(
          "absolute w-60 h-60 rounded-full border border-primary/30",
          "animate-pulse-ring"
        )}
      />
      
      {/* Inner ring */}
      <div
        className={cn(
          "absolute w-52 h-52 rounded-full border-2 border-primary/40",
          isListening && "border-accent/60"
        )}
      />
      
      {/* Main orb */}
      <div
        className={cn(
          "relative w-44 h-44 rounded-full animate-float overflow-hidden",
          "bg-gradient-to-br from-orb-inner via-primary to-orb-outer",
          isListening ? "animate-listening-pulse" : "animate-glow-pulse",
          isSpeaking && "scale-105"
        )}
        style={{
          boxShadow: isListening 
            ? "0 0 80px 30px hsl(174 72% 46% / 0.5)" 
            : "0 0 60px 20px hsl(217 91% 60% / 0.4)",
          background: "radial-gradient(circle at 30% 30%, hsl(199 89% 58%), hsl(217 91% 50%) 50%, hsl(217 91% 35%))"
        }}
      >
        {/* Highlight */}
        <div 
          className="absolute top-6 left-8 w-16 h-12 rounded-full bg-white/20 blur-xl"
        />

        {/* Wave Animation when Speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 z-10 backdrop-blur-[2px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-1.5 bg-white/90 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                style={{
                  height: "12px",
                  animation: `waveform 0.6s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeynmanOrb;
