import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
// import { ChevronUp, ChevronDown } from "lucide-react";
import StaticScreen from "./StaticScreen";
import { cn } from "@/lib/utils";
import { IMAGES } from "@/assets";

// Channel content mapping
const channels = {
  1: {
    type: "video",
    url: "https://player.twitch.tv/?channel=theagentexperience&parent=localhost&parent=dev.podcastslanding-fe.pages.dev&parent=podcastslanding-fe.pages.dev&parent=agentexperience.live",
    title: "AGENT NEWS",
  },
  // 2: {
  //   type: "video",
  //   url: "https://www.youtube.com/embed/TQllQlElpz8?autoplay=1&loop=1",
  //   title: "Family Guy",
  // },
  // 3: {
  //   type: "video",
  //   url: "https://www.youtube.com/embed/SiW5oTl_inA?autoplay=1&loop=1",
  //   title: "Sports Channel",
  // },
  // 4: {
  //   type: "video",
  //   url: "https://www.youtube.com/embed/HWsUOUR6c2c?autoplay=1&loop=1",
  //   title: "Music Channel",
  // },
};
const TvConsole = () => {
  const [power, setPower] = useState(false);
  const [channel, setChannel] = useState(1);
  const [staticEffect, setStaticEffect] = useState(false);

  useEffect(() => {
    if (power) {
      setChannel(1)
      const timer = setTimeout(() => setStaticEffect(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [channel, power]);

  // const handleChannelChange = (direction: "up" | "down") => {
  //   if (!power) return;
  //   setStaticEffect(true);
  //   if (direction === "up") {
  //     setChannel((prev) =>
  //       prev === Object.keys(channels).length ? 1 : prev + 1
  //     );
  //   } else {
  //     setChannel((prev) =>
  //       prev === 1 ? Object.keys(channels).length : prev - 1
  //     );
  //   }
  // };
  const currentChannel = useMemo(() => {
    //@ts-ignore
    return channels[channel];
  }, [channel]);

  const renderContent = () => {
    if (!power) return null;
    if (staticEffect) {
      return null;
    }
    return (
      <div className={cn("relative w-full h-full")}>
        <iframe
          width="100%"
          height="100%"
          src={currentChannel.url}
          title="YouTube video player"
          allow="accelerometer; autoplay *; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen={true}
        />
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded -md:text-xs">
          CH-{channel}: {currentChannel.title}
        </div>
      </div>
    );
  };

  return (
    <div className="w-10/12 aspect-video bg-accent border-4 rounded-lg relative overflow-hidden grid grid-rows-[1fr_50px] gap-0 -md:grid-rows-[1fr_25px]">
      <div
        className={cn(
          "w-full h-full border-4 border-zinc-900 overflow-hidden transition-all",
          !power ? "bg-black" : "bg-zinc-900"
        )}
      >
        <div
          className={cn(
            "w-full h-full flex items-center justify-center rounded-md overflow-hidden relative"
          )}
        >
          {staticEffect ? <StaticScreen /> : renderContent()}
        </div>
      </div>
      {/* TV Brand */}
      <div className="flex p-2 justify-between items-center">
        <span className="text-zinc-500 font-bold  text-lg -md:text-xs">
          RETRO-90
        </span>
        <div className="w-[30%] h-[20px] rounded-2xl overflow-hidden -md:h-[10px]">
          <img
            src={IMAGES.img_speaker}
            alt="speaker"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex justify-center gap-2 items-center">
          {/* <Button
            variant="outline"
            size="icon"
            className="bg-zinc-500 hover:bg-zinc-400 w-10 h-6 text-white -md:h-4 -md:w-7"
            onClick={() => handleChannelChange("up")}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-zinc-500  hover:bg-zinc-400 w-10 h-6 text-white -md:h-4 -md:w-7"
            onClick={() => handleChannelChange("down")}
          >
            <ChevronDown className="h-4 w-4" />
          </Button> */}

          <Button
            variant="outline"
            size="icon"
            className={`rounded-full w-10 h-10 -md:w-5 -md:h-5 p-0 transition-all duration-700 ${
              power
                ? "bg-red-500 hover:bg-red-600 text-white hover:text-white"
                : "bg-zinc-500 hover:bg-zinc-400 text-white"
            }`}
            onClick={() => setPower(!power)}
          >
            <img src={IMAGES.img_power_btn} alt="power button" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TvConsole;
