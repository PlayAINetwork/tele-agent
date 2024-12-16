import { useState, useEffect, useMemo } from "react";

import DYNAMICICONS from "@/assets/DynamicIcon";
import { ICONS } from "@/assets";

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

const Scanlines = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div
      className="w-full h-full opacity-20 mix-blend-overlay"
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 1px,
          #000 1px,
          #000 2px
        )`,
      }}
    />
  </div>
);

const StaticNoiseEffect = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 animate-[flicker_0.01s_infinite]">
      <div className="w-full h-full">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `repeating-radial-gradient(
              circle at 50% 50%,
              #fff 0px,
              #111 1px,
              #111 2px,
              #fff 3px
            )`,
            backgroundSize: "4px 4px",
            animation: "noise 0.2s infinite",
          }}
        />
      </div>
    </div>
    <Scanlines />
  </div>
);

const TvConsole = () => {
  const [power, setPower] = useState(true);
  const [channel, setChannel] = useState(1);
  const [staticEffect, setStaticEffect] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const channels: any = {
    1: {
      type: "live",
      url: "https://player.twitch.tv/?channel=theagentexperience&parent=localhost&parent=dev.podcastslanding-fe.pages.dev&parent=podcastslanding-fe.pages.dev&parent=agentexperience.live",
      title: "rogue live",

    },
    2: {
      type: "rec",
      url: "https://www.dropbox.com/scl/fi/qosd84rv16a5qh33qyeoe/Rogue-Live-with-CZ-and-Saylor.mkv?rlkey=50ec7cedqewivyi138k1wrbos&st=8c5mpph1&dl=0",
      title: "rogue recording",
    },
    
  };

  useEffect(() => {
    setPower(true)
    if (power) {
      setChannel(1);
      setStaticEffect(true);
      const timer = setTimeout(() => setStaticEffect(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [power]);

  const currentChannel = useMemo(() => channels[channel], [channel]);

  const handleNextChannel = () => {
    const nextChannel = channel + 1;
    if (nextChannel <= Object.keys(channels).length) {
      setChannel(nextChannel);
      setStaticEffect(true);
      setTimeout(() => setStaticEffect(false), 1000);
    }
  };

  const handlePrevChannel = () => {
    const prevChannel = channel - 1;
    if (prevChannel >= 1) {
      setChannel(prevChannel);
      setStaticEffect(true);
      setTimeout(() => setStaticEffect(false), 1000);
    }
  };

  const renderContent = () => {
    if (!power) return null;
    if (staticEffect) return null;

    const params = new URLSearchParams(currentChannel.url.split("?")[1]);
    if (!isPlaying) params.append("pause", "true");
    if (isMuted) params.append("muted", "true");

    const updatedUrl = `${currentChannel.url.split("?")[0]}?${params.toString()}`;

    return (
      <div className="relative w-full h-full">
        <iframe
          width="100%"
          height="100%"
          src={updatedUrl}
          title="TV Content"
          allow="accelerometer; autoplay *; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen={true}
        />
        <Scanlines />
        {/* <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-green-400 px-2 py-1 rounded font-mono text-xs border border-green-900/30">
          CH-{channel}
        </div> */}
      </div>
    );
  };

 
  return (
    <div className="relative w-full h-full  overflow-hidden ">
      {/* Main Container */}

      <div className="relative w-full h-full ">
        <div className="h-full grid grid-rows-[40px_1fr_40px] gap-0">
          <div className="w-full  uppercase top-0 ">
            <div className="w-full px-2 py-1 gap-2 text-[#000000]  bg-primary  flex   items-center ">
              <DYNAMICICONS.Arrow w={10} />
             {currentChannel?.title}
            </div>
          </div>
          {/* Screen Bezel */}
          <div className="relative ">
            {/* Screen */}
            <div
              className={cn(
                "relative w-full h-full overflow-hidden transition-all duration-700",
                !power ? "bg-black" : "bg-zinc-900"
              )}
            >
              {/* Screen Effects */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-50" />
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                {staticEffect ? <StaticNoiseEffect /> : renderContent()}
              </div>

              {/* CRT curve effect */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, transparent 50%, rgba(0,0,0,0.3) 100%)",
                }}
              />

              {/* Screen glare */}
              <div className="absolute -inset-full rotate-45 bg-gradient-to-t from-transparent via-white/5 to-transparent transform translate-x-full animate-[shine_10s_ease-in-out_infinite]" />
            </div>
          </div>

          {/* Control Panel */}
          <div className="flex font-[500]  items-center justify-between py-0   border-t border-primary">
            {/* Controls */}
            <div className="flex gap-0 h-full">
              <div className="bg-primary px-3 gap-3 flex items-center">
              {
                    currentChannel?.type === "live" ?
                    <div className="flex text-black gap-1 items-center">
                    <img src={ICONS.icon_live} alt="" />
                    LIVE
                  </div>
                    :
                    <div className="flex text-black gap-1 items-center">
                  
                    <img src={ICONS.icon_reco} alt="" />
                    REC
                  </div>
                  }
               
               
              </div>
              <button
                className="border-primary border-r px-3"
                onClick={handleNextChannel}
                disabled={!power || channel === Object.keys(channels).length}
              >
                <img src={ICONS.icon_next} alt="" />
              </button>
              <button
                className="border-primary border-r px-3"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!power}
              >
                {isPlaying ? (
                  <div className="flex gap-2 items-center text-primary">
                    <img src={ICONS.icon_play} alt="" />
                    PLAY
                  </div>
                ) : (
                  <div className="flex gap-2 items-center text-primary">
                    <img src={ICONS.icon_stop} alt="" />
                    STOP
                  </div>
                )}
              </button>
              <button
                className="border-primary border-r px-3"
                onClick={handlePrevChannel}
                disabled={!power || channel === 1}
              >
                <img src={ICONS.icon_pre} alt="" />
              </button>

              <button
                className="border-primary border-r px-3"
                onClick={() => setIsMuted(!isMuted)}
                disabled={!power}
              >
                {isMuted ? (
                  <img src={ICONS.icon_mute} alt="" />
                ) : (
                  <img src={ICONS.icon_sound} alt="" />
                )}
              </button>
            </div>

            {/* Power Button */}
            <div className="h-full flex">
              <div className=" h-full flex items-center gap-2 text-primary uppercase px-3 border-l border-primary">
                <DYNAMICICONS.Arrow color="#89FC96" />
                not live right now
              </div>
            </div>
            {/* <Button
              variant="outline"
              size="icon"
              className={cn(
                "relative rounded-full w-6 h-6 transition-all duration-500 overflow-hidden",
                power
                  ? "bg-green-600/20 hover:bg-green-600/30"
                  : "bg-zinc-800 hover:bg-zinc-700",
                "border",
                power ? "border-green-500" : "border-zinc-700"
              )}
              onClick={() => setPower(!power)}
            >
              <div
                className={cn(
                  "absolute inset-1 rounded-full transition-all duration-500",
                  power
                    ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                    : "bg-zinc-600"
                )}
              />
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvConsole;
