import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

const Scanlines = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="w-full h-full opacity-20 mix-blend-overlay" 
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 1px,
          #000 1px,
          #000 2px
        )`
      }}
    />
  </div>
);

const StaticNoiseEffect = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 animate-[flicker_0.01s_infinite]">
      <div className="w-full h-full">
        <div className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `repeating-radial-gradient(
              circle at 50% 50%,
              #fff 0px,
              #111 1px,
              #111 2px,
              #fff 3px
            )`,
            backgroundSize: '4px 4px',
            animation: 'noise 0.2s infinite'
          }}
        />
      </div>
    </div>
    <Scanlines />
  </div>
);

const TvConsole = () => {
  const [power, setPower] = useState(false);
  const [channel, setChannel] = useState(1);
  const [staticEffect, setStaticEffect] = useState(false);

  const channels:any = {
    1: {
      type: "video",
      url: "https://player.twitch.tv/?channel=theagentexperience&parent=localhost&parent=dev.podcastslanding-fe.pages.dev&parent=podcastslanding-fe.pages.dev&parent=agentexperience.live",
      title: "",
    },
  };

  useEffect(() => {
    if (power) {
      setChannel(1)
      setStaticEffect(true);
      const timer = setTimeout(() => setStaticEffect(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [power]);

  const currentChannel = useMemo(() => channels[channel], [channel]);

  const renderContent = () => {
    if (!power) return null;
    if (staticEffect) return null;
    
    return (
      <div className="relative w-full h-full">
        <iframe
          width="100%"
          height="100%"
          src={currentChannel.url}
          title="TV Content"
          allow="accelerometer; autoplay *; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen={true}
        />
        <Scanlines />
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-green-400 px-2 py-1 rounded font-mono text-xs border border-green-900/30">
          CH-{channel}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-11/12 md:w-9/12 aspect-video bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Outer Case */}
      <div className="absolute inset-0 rounded-xl">
        <div className="absolute inset-0 rounded-[30px] border-[12px] border-zinc-800">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                #fff2,
                transparent 1px,
                transparent 3px
              )`
            }}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="relative h-full p-4 -md:p-3">
        <div className="h-full grid grid-rows-[1fr_40px] gap-2">
          {/* Screen Bezel */}
          <div className="relative rounded-2xl bg-black p-1">
            {/* Screen */}
            <div className={cn(
              "relative w-full h-full rounded-lg overflow-hidden transition-all duration-700",
              !power ? "bg-black" : "bg-zinc-900",
            )}>
              {/* Screen Effects */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-50" />
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                {staticEffect ? <StaticNoiseEffect /> : renderContent()}
              </div>
              
              {/* CRT curve effect */}
              <div className="absolute inset-0 rounded-lg"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, transparent 50%, rgba(0,0,0,0.3) 100%)'
                }}
              />
              
              {/* Screen glare */}
              <div className="absolute -inset-full rotate-45 bg-gradient-to-t from-transparent via-white/5 to-transparent transform translate-x-full animate-[shine_10s_ease-in-out_infinite]" />
            </div>
          </div>

          {/* Control Panel */}
          <div className="flex items-center justify-between px-4 py-1 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
            {/* Brand */}
            <div className="flex-none">
              <span className="font-mono text-green-500 text-xs tracking-wider opacity-60">AGENT·TV</span>
            </div>

            {/* Speaker Grille */}
            <div className="flex-1 h-4 mx-4">
              <div className="w-full h-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/30">
                <div className="w-full h-full grid grid-cols-8 gap-[1px] p-[2px]">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-zinc-800/30 rounded-full" />
                  ))}
                </div>
              </div>
            </div>

            {/* Power Button */}
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "relative rounded-full w-6 h-6 transition-all duration-500 overflow-hidden",
                power ? "bg-green-600/20 hover:bg-green-600/30" : "bg-zinc-800 hover:bg-zinc-700",
                "border",
                power ? "border-green-500" : "border-zinc-700"
              )}
              onClick={() => setPower(!power)}
            >
              <div className={cn(
                "absolute inset-1 rounded-full transition-all duration-500",
                power ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" : "bg-zinc-600"
              )} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvConsole;