import { Loader } from "./Loader";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function LoadingWrapper({ isLoading, children }: LoadingWrapperProps) {
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0b14]">
        {/* Ambient background glow */}
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6754e7]/10 blur-[120px]" />
          <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a78bfa]/8 blur-[100px]" />
          <div className="absolute right-1/3 bottom-1/3 h-[300px] w-[300px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#5cc8aa]/8 blur-[100px]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Futuristic orb loader */}
          <div className="relative h-24 w-24">
            {/* Outer ring */}
            <div className="absolute inset-0 animate-spin rounded-full border border-[#6754e7]/20 border-t-[#8b7cf6] border-r-[#a78bfa]" style={{ animationDuration: "1.5s" }} />
            {/* Middle ring */}
            <div className="absolute inset-2 animate-spin rounded-full border border-[#5cc8aa]/20 border-b-[#5cc8aa] border-l-[#7dd3fc]" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
            {/* Inner ring */}
            <div className="absolute inset-4 animate-spin rounded-full border border-[#a78bfa]/30 border-t-[#c4b5fd]" style={{ animationDuration: "1s" }} />
            {/* Core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-4 w-4 animate-pulse rounded-full bg-gradient-to-br from-[#8b7cf6] to-[#5cc8aa] shadow-[0_0_20px_rgba(139,124,246,0.6)]" />
            </div>
            {/* Glow */}
            <div className="absolute inset-0 animate-ping rounded-full bg-[#6754e7]/10" style={{ animationDuration: "2s" }} />
          </div>

          {/* Brand mark */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#8b7cf6]" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#a78bfa]">
                CostCalc
              </span>
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#5cc8aa]" />
            </div>
            <p className="text-sm font-medium text-[#6b6773]">
              Initializing intelligent estimator
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-[3px] w-48 overflow-hidden rounded-full bg-[#1d1a25]">
            <div className="h-full animate-progress rounded-full bg-gradient-to-r from-[#6754e7] via-[#a78bfa] to-[#5cc8aa]" />
          </div>
        </div>

        {/* CSS for progress animation */}
        <style>{`
          @keyframes progress {
            0% { width: 0%; margin-left: 0; }
            50% { width: 70%; margin-left: 15%; }
            100% { width: 0%; margin-left: 100%; }
          }
          .animate-progress {
            animation: progress 1.2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
