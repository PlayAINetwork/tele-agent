import { useState, useEffect, useMemo } from "react";
import DYNAMICICONS from "@/assets/DynamicIcon";
import { ICONS, IMAGES } from "@/assets";

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
  const [isServerError, setIsServerError] = useState(false);
  const [isShowingErrorMessage, setIsShowingErrorMessage] = useState(false);

  const channels: any = {
    1: {
      type: "live",
      url: "https://player.twitch.tv/?channel=theagentexperience&parent=localhost&parent=dev.podcastslanding-fe.pages.dev&parent=podcastslanding-fe.pages.dev&parent=agentexperience.live",
      title: "rogue live",
    },
    2: {
      type: "rec",
      url: "https://playai-botcast.s3.us-east-2.amazonaws.com/Rogue+Live+with+CZ+and+Saylor.mkv",
      title: "rogue recording",
    },
    3: {
      type: "rec",
      url: "https://playai-lambda.s3.amazonaws.com/8e807889d07ce61ef692bce58ccf029097d4652496c06b020c017417ecc2b2d8.mp4",
      title: "rogue recording",
    },
  };

  useEffect(() => {
    console.log(isServerError)
    const checkServerStatus = async () => {
      if (channel === 1) {
        try {
          const response = await fetch('https://rogue-paywall.playai.network');
          if (response.status === 502) {
            setIsServerError(true);
            setIsShowingErrorMessage(true);
            // Switch to channel 2 after 5 seconds
            setTimeout(() => {
              setChannel(2);
              setIsShowingErrorMessage(false);
              setIsServerError(false);
            }, 5000);
          } else {
            setIsServerError(false);
            setIsShowingErrorMessage(false);
          }
        } catch (error) {
          setIsServerError(true);
          setIsShowingErrorMessage(true);
          // Switch to channel 2 after 5 seconds
          setTimeout(() => {
            setChannel(2);
            setIsShowingErrorMessage(false);
            setIsServerError(false);
          }, 5000);
        }
      }
    };

    checkServerStatus();
  }, [channel]);

  useEffect(() => {
    setPower(true);
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

    if (channel === 1 && isShowingErrorMessage) {
      return (
        <div className="w-full h-full relative">
          <img src={IMAGES.disbg} alt="" className="w-full h-full" />
          <div className="absolute top-0 h-full w-full flex items-center">
            <div className="bg-primary py-6 w-full">
              <p className="text-md uppercase py-[3px] text-center text-[#010101]">
                <span className="">
                  rogue_is_not_live_right_now.
                  <br />
                  continue_listening_previous_podcasts.
                  <br />
                  <br />
                  Redirecting_to_next_channel_in_5_secs.
                </span>
              </p>
            </div>
          </div>
        </div>
      );
    }

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
      </div>
    );
  };

  // Rest of the component remains the same...
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="relative w-full h-full">
        <div className="h-full grid grid-rows-[30px_1fr_40px] gap-0">
          <div className="w-full uppercase top-0">
            <div className="w-full px-2 py-1 gap-2 text-[#000000] bg-primary flex items-center">
              <DYNAMICICONS.Arrow w={10} />
              {currentChannel?.title}
            </div>
          </div>
          <div className="relative">
            <div className={cn("relative w-full h-full overflow-hidden transition-all duration-700")}>
              <div className="absolute inset-0 opacity-50" />
              <div className="absolute inset-0 overflow-hidden">
                {staticEffect ? <StaticNoiseEffect /> : renderContent()}
              </div>
              <div className="absolute -inset-full rotate-45 bg-gradient-to-t from-transparent via-white/5 to-transparent transform translate-x-full animate-[shine_10s_ease-in-out_infinite]" />
            </div>
          </div>
          <div className="flex font-[500] items-center justify-between py-0 border-t border-primary">
            <div className="flex gap-0 h-full text-sm">
              <div className="bg-primary px-3 gap-3 flex items-center">
                {currentChannel?.type === "live" ? (
                  <div className="flex text-black gap-1 items-center">
                    <img src={ICONS.icon_live} alt="" className="w-[16px]" />
                    LIVE
                  </div>
                ) : (
                  <div className="flex text-black gap-1 items-center">
                    <img src={ICONS.icon_reco} alt="" className="w-[16px]" />
                    REC
                  </div>
                )}
              </div>
              <button
                className="border-primary border-r px-3"
                onClick={handleNextChannel}
                disabled={!power || channel === Object.keys(channels).length}
              >
                <img src={ICONS.icon_next} alt="" className="w-[16px]" />
              </button>
              <button
                className="border-primary border-r px-3"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!power}
              >
                {isPlaying ? (
                  <div className="flex gap-2 items-center text-primary">
                    <img src={ICONS.icon_play} alt="" className="w-[16px]" />
                    PLAY
                  </div>
                ) : (
                  <div className="flex gap-2 items-center text-primary">
                    <img src={ICONS.icon_stop} alt="" className="w-[16px]" />
                    STOP
                  </div>
                )}
              </button>
              <button
                className="border-primary border-r px-3"
                onClick={handlePrevChannel}
                disabled={!power || channel === 1}
              >
                <img src={ICONS.icon_pre} alt="" className="w-[16px]" />
              </button>
              <button
                className="border-primary border-r px-3"
                onClick={() => setIsMuted(!isMuted)}
                disabled={!power}
              >
                {isMuted ? (
                  <img src={ICONS.icon_mute} alt="" className="w-[20px]" />
                ) : (
                  <img src={ICONS.icon_sound} alt="" className="w-[20px]" />
                )}
              </button>
            </div>
            <div className="h-full flex">
              <div className="h-full flex items-center gap-2 text-primary uppercase px-3 border-l border-primary">
                <DYNAMICICONS.Arrow color="#89FC96" w={15} />
                not live right now
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvConsole;