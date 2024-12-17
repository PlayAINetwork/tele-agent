import { useState, useEffect, useMemo, useRef } from "react";
import {
  ChevronRight,
  Play,
  Square,
  Volume2,
  VolumeX,
 
  Radio,
  Video,
  Rewind,
  FastForward,
} from "lucide-react";
import Hls from "hls.js";

declare global {
  interface Window {
    Twitch: {
      Player: {
        new (
          node: HTMLElement,
          options: {
            channel: string;
            parent: string[];
            [key: string]: any;
          }
        ): {
          addEventListener: (event: string, callback: () => void) => void;
          removeEventListener: (event: string) => void;
          pause: () => void;
          play: () => void;
          setMuted: (muted: boolean) => void;
        };
        READY: string;
      };
    };
  }
}

const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");
// const formatTime = (seconds: number): string => {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const remainingSeconds = Math.floor(seconds % 60);
//   return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
// };

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
  const [twitchPlayer, setTwitchPlayer] = useState<any>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  // const progressRef = useRef<HTMLDivElement>(null);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);

  const channels: any = {
    1: {
      type: "live",
      url: "https://player.twitch.tv/?channel=theagentexperience&parent=localhost&parent=dev.podcastslanding-fe.pages.dev&parent=podcastslanding-fe.pages.dev&parent=agentexperience.live",
      title: "rogue live",
    },
    2: {
      type: "rec",
      url: "https://assets.podcast.playai.network/master.m3u8",

      // url: "https://playai-lambda.s3.amazonaws.com/8e807889d07ce61ef692bce58ccf029097d4652496c06b020c017417ecc2b2d8.mp4",
      title: "Rogue in conversation with CZ and Saylor.",
    },
    // 3: {
    //   type: "rec",
    //   url: "https://assets.podcast.playai.network/master.m3u8",

    //   // url: "https://playai-lambda.s3.amazonaws.com/8e807889d07ce61ef692bce58ccf029097d4652496c06b020c017417ecc2b2d8.mp4",
    //   title: "rogue recording",
    // },
  };

  const initializeHLS = (videoElement: HTMLVideoElement) => {
    setPower(true)
        setStaticEffect(false);
        console.log(currentTime)

    if (hlsInstance) {
      hlsInstance.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(channels[channel].url);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (isPlaying) {
          videoElement.play().catch(console.error);
        }
      });

      hls.on(Hls.Events.ERROR, ( data:any) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              initializeHLS(videoElement);
              break;
          }
        }
      });

      setHlsInstance(hls);
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = channels[channel].url;
      videoElement.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        if (isPlaying) {
          videoElement.play().catch(console.error);
        }
      });
    }
  };


   const cleanupCurrentChannel = () => {
    if (hlsInstance) {
      hlsInstance.destroy();
      setHlsInstance(null);
    }
    
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
  };
  useEffect(() => {
    if (channel !== 1) {
      const video = videoRef.current;
      if (!video) return;

      // Cleanup previous channel
      cleanupCurrentChannel();
      
      // Initialize new channel
      initializeHLS(video);

      const timeUpdate = () => setCurrentTime(video.currentTime);
      const durationChange = () => setDuration(video.duration);
      const loadedMetadata = () => setDuration(video.duration);
      const playHandler = () => setIsPlaying(true);
      const pauseHandler = () => setIsPlaying(false);

      video.addEventListener("timeupdate", timeUpdate);
      video.addEventListener("durationchange", durationChange);
      video.addEventListener("loadedmetadata", loadedMetadata);
      video.addEventListener("play", playHandler);
      video.addEventListener("pause", pauseHandler);

      return () => {
        video.removeEventListener("timeupdate", timeUpdate);
        video.removeEventListener("durationchange", durationChange);
        video.removeEventListener("loadedmetadata", loadedMetadata);
        video.removeEventListener("play", playHandler);
        video.removeEventListener("pause", pauseHandler);
      };
    }
  }, [channel]);

  // Initialize Twitch player
  useEffect(() => {
    if (channel === 1) {
      const iframe = document.querySelector("iframe") as HTMLIFrameElement;
      if (iframe && window.Twitch) {
        const player = new window.Twitch.Player(iframe, {
          channel: "theagentexperience",
          parent: [
            "localhost",
            "dev.podcastslanding-fe.pages.dev",
            "podcastslanding-fe.pages.dev",
            "agentexperience.live",
          ],
        });

        player.addEventListener(window.Twitch.Player.READY, () => {
          setTwitchPlayer(player);
        });

        return () => {
          if (player) {
            player.removeEventListener(window.Twitch.Player.READY);
          }
        };
      }
    }
  }, [channel]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      const timeUpdate = () => setCurrentTime(video.currentTime);
      const durationChange = () => setDuration(video.duration);
      const loadedMetadata = () => setDuration(video.duration);

      video.addEventListener("timeupdate", timeUpdate);
      video.addEventListener("durationchange", durationChange);
      video.addEventListener("loadedmetadata", loadedMetadata);

      return () => {
        video.removeEventListener("timeupdate", timeUpdate);
        video.removeEventListener("durationchange", durationChange);
        video.removeEventListener("loadedmetadata", loadedMetadata);
      };
    }
  }, [channel]);

  // Initialize video element for recorded content
  useEffect(() => {
    if (channel === 2) {
      const video: any = document.querySelector("video");
      if (video) {
        video.addEventListener("play", () => setIsPlaying(true));
        video.addEventListener("pause", () => setIsPlaying(false));

        return () => {
          video.removeEventListener("play", () => setIsPlaying(true));
          video.removeEventListener("pause", () => setIsPlaying(false));
        };
      }
    }
  }, [channel]);

  // Server status check
  useEffect(() => {
    const checkServerStatus = async () => {
      if (channel === 1) {
        try {
          const response = await fetch("https://rogue-paywall.playai.network");
          if (response.status === 502) {
            setIsServerError(true);
            setIsShowingErrorMessage(true);
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

  const handlePlayPause = () => {
    if (channel === 1 && twitchPlayer) {
      if (isPlaying) {
        twitchPlayer.pause();
      } else {
        twitchPlayer.play();
      }
      setIsPlaying(!isPlaying);
    } else if (channel === 2) {
      const video = document.querySelector("video");
      if (video) {
        if (isPlaying) {
          video.pause();
        } else {
          video.play();
        }
      }
    }
  };

  const handleMuteUnmute = () => {
    if (channel === 1 && twitchPlayer) {
      twitchPlayer.setMuted(!isMuted);
      setIsMuted(!isMuted);
    } else if (channel === 2) {
      const video = document.querySelector("video");
      if (video) {
        video.muted = !video.muted;
        setIsMuted(!isMuted);
      }
    }
  };

  // const handleNextChannel = () => {
  //   const nextChannel = channel + 1;
  //   if (nextChannel <= Object.keys(channels).length) {
  //     // Cleanup current channel before switching
  //     cleanupCurrentChannel();
      
  //     setChannel(nextChannel);
  //     setStaticEffect(true);
      
  //     setTimeout(() => {
  //       setStaticEffect(false);
  //     }, 1000);
  //   }
  // };

  // const handlePrevChannel = () => {
  //   const prevChannel = channel - 1;
  //   if (prevChannel >= 1) {
  //     // Cleanup current channel before switching
  //     cleanupCurrentChannel();
      
  //     setChannel(prevChannel);
  //     setStaticEffect(true);
      
  //     setTimeout(() => {
  //       setStaticEffect(false);
  //     }, 1000);
  //   }
  // };
  const handleTimeSkip = (seconds: number) => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime + seconds;
      videoRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
    }
  };

  // const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
  //   if (progressRef.current && videoRef.current) {
  //     const rect = progressRef.current.getBoundingClientRect();
  //     const pos = (event.clientX - rect.left) / rect.width;
  //     const seekTime = pos * duration;
  //     videoRef.current.currentTime = seekTime;
  //     setCurrentTime(seekTime);
  //   }
  // };

  const currentChannel = useMemo(() => channels[channel], [channel]);

  const renderContent = () => {
    // if (!power) return null;
    // if (staticEffect) return null;

    if (channel === 1 && isShowingErrorMessage) {
      return (
        <div className="w-full h-full relative">
          <div className="absolute top-0 h-full w-full flex items-center">
            <div className="bg-primary py-6 w-full">
              <p className="text-md uppercase py-[3px] text-center text-[#010101]">
                <span>
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

    if (channel === 1) {
      return (
        <div className="relative w-full h-full">
          <iframe
            width="100%"
            height="100%"
            src={currentChannel.url}
            title="TV Content"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen={true}
          />
          <Scanlines />
        </div>
      );
    } else {
      return (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            width="100%"
            height="100%"
            playsInline
            className="h-full w-full"
            src={currentChannel.url}
            controls={true}
            autoPlay={isPlaying}
            muted={isMuted}
          />
          {/* <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
            <div
              ref={progressRef}
              className="w-full h-1 bg-gray-600 cursor-pointer mb-2"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-primary"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-white text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div> */}
          <Scanlines />
        </div>
      );
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="relative w-full h-full">
        <div className="h-full grid grid-rows-[30px_1fr_40px] gap-0">
          <div className="w-full uppercase top-0">
            <div className="w-full px-2 py-1 gap-2 text-[#000000] bg-primary flex items-center">
              <ChevronRight className="w-4 h-4" />
              {currentChannel?.title}
            </div>
          </div>

          <div className="relative">
            <div
              className={cn(
                "relative w-full h-full overflow-hidden transition-all duration-700"
              )}
            >
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
                    <Radio className="w-4 h-4" />
                    LIVE
                  </div>
                ) : (
                  <div className="flex text-black gap-1 items-center">
                    <Video className="w-4 h-4" />
                    REC
                  </div>
                )}
              </div>

              {/* <button
                className="border-primary border-r px-3"
                onClick={handleNextChannel}
                disabled={!power || channel === Object.keys(channels).length}
              >
                <SkipForward className="w-4 h-4 text-primary" />
              </button> */}
              {channel == 2 && (
                <button
                  className="border-primary border-r px-3"
                  onClick={() => handleTimeSkip(-10)}
                  disabled={!power}
                >
                  <Rewind className="w-4 h-4 text-primary" />
                </button>
              )}

              <button
                className="border-primary border-r px-3"
                onClick={handlePlayPause}
                disabled={!power}
              >
                <div className="flex gap-2 items-center text-primary">
                  {isPlaying ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isPlaying ? "STOP" : "PLAY"}
                </div>
              </button>

              {channel == 2 && (
                <button
                  className="border-primary border-r px-3"
                  onClick={() => handleTimeSkip(10)}
                  disabled={!power}
                >
                  <FastForward className="w-4 h-4 text-primary" />
                </button>
              )}

              {/* <button
                className="border-primary border-r px-3"
                onClick={handlePrevChannel}
                disabled={!power || channel === 1}
              >
                <SkipBack className="w-4 h-4 text-primary" />
              </button> */}

              <button
                className="border-primary border-r px-3"
                onClick={handleMuteUnmute}
                disabled={!power}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-primary" />
                ) : (
                  <Volume2 className="w-5 h-5 text-primary" />
                )}
              </button>
            </div>

            <div className="h-full flex">
              <div className="h-full flex items-center gap-2 text-primary uppercase px-3 border-l border-primary">
                <ChevronRight className="w-4 h-4" color="#89FC96" />
                {isServerError
                  ? "not live right now"
                  : isLoading
                    ? "Loading..."
                    : "not live right now"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvConsole;
