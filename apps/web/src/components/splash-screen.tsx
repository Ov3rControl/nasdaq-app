import { Analytics } from "@vercel/analytics/react";

export function SplashScreen() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden splash-vt animate-fade-in">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary retro-border rotate-12 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent retro-border -rotate-12 animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-secondary retro-border rotate-45 animate-pulse animation-delay-500" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-destructive retro-border -rotate-45 animate-pulse animation-delay-700" />
      </div>

      <div className="animate-scale-in">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-primary retro-border-thick retro-shadow-xl flex items-center justify-center">
              <span className="text-primary-foreground font-mono text-4xl font-black">
                N
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-center mb-4 text-foreground font-mono uppercase tracking-wider">
          NASDAQ
        </h1>
        <p className="text-2xl text-center mb-12 font-mono font-bold uppercase tracking-wide bg-accent text-accent-foreground px-6 py-2 retro-border retro-shadow">
          Stock Explorer
        </p>

        <div className="flex space-x-4 justify-center">
          <div className="w-6 h-6 bg-primary retro-border animate-bounce" />
          <div className="w-6 h-6 bg-accent retro-border animate-bounce animation-delay-100" />
          <div className="w-6 h-6 bg-secondary retro-border animate-bounce animation-delay-200" />
        </div>
      </div>
      <Analytics />
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-lg text-foreground font-mono font-bold bg-card px-4 py-2 retro-border retro-shadow">
          Developed by Mohamed Adel
        </p>
      </div>
    </div>
  );
}
