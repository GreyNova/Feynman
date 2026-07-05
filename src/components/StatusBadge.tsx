import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  isConnected: boolean;
}

const StatusBadge = ({ isConnected }: StatusBadgeProps) => {
  return (
    <div
      className={cn(
        "px-4 py-1.5 rounded-full text-xs font-medium tracking-wider",
        "border transition-all duration-300",
        isConnected
          ? "bg-status-connected/10 border-status-connected/30 text-status-connected"
          : "bg-secondary border-border text-muted-foreground"
      )}
    >
      {isConnected ? "CONNECTED" : "DISCONNECTED"}
    </div>
  );
};

export default StatusBadge;
