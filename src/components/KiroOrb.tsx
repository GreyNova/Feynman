import { cn } from "@/lib/utils";

interface KiroOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
}

const KiroOrb = ({ isListening, isSpeaking }: KiroOrbProps) => {
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
          "relative w-44 h-44 rounded-full animate-float",
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
      </div>
    </div>
  );
};

export default KiroOrb;
