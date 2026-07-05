import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const MicButton = ({ isListening, onClick, disabled }: MicButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center",
        "transition-all duration-300 transform hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background",
        isListening
          ? "bg-destructive animate-pulse"
          : "bg-accent animate-button-glow",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{
        boxShadow: isListening 
          ? "0 0 30px 5px hsl(0 84% 60% / 0.5)"
          : "0 0 30px 5px hsl(174 72% 46% / 0.5)"
      }}
    >
      {isListening ? (
        <MicOff className="w-7 h-7 text-white" />
      ) : (
        <Mic className="w-7 h-7 text-accent-foreground" />
      )}
    </button>
  );
};

export default MicButton;
