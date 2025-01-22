import { useState, useEffect, useRef } from "react";

import Hls from "hls.js";

// const formatTime = (seconds: number): string => {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const remainingSeconds = Math.floor(seconds % 60);
//   return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
// };

// Scanlines effect component
// const Scanlines = () => (
//   <div className="absolute inset-0 pointer-events-none">
//     <div
//       className="w-full h-full opacity-20 mix-blend-overlay"
//       style={{
//         backgroundImage: `repeating-linear-gradient(
//           0deg,
//           transparent,
//           transparent 1px,
//           #000 1px,
//           #000 2px
//         )`,
//       }}
//     />
//   </div>
// );

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
}

const VideoPlayer = ({ videoUrl}: VideoPlayerProps) => {
//   const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
//   const [currentTime, setCurrentTime] = useState<number>(0);
//   const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
//   const progressRef = useRef<HTMLDivElement>(null);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);

  const initializeHLS = (videoElement: HTMLVideoElement) => {
    if (hlsInstance) {
      hlsInstance.destroy();
    }

    if (Hls.isSupported() && videoUrl.includes('.m3u8')) {
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(videoUrl);
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
      videoElement.src = videoUrl;
      videoElement.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        if (isPlaying) {
          videoElement.play().catch(console.error);
        }
      });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initialize video player
    if (videoUrl.includes('.m3u8')) {
      initializeHLS(video);
    } else {
      video.src = videoUrl;
    }

    // Event listeners
    // const timeUpdate = () => setCurrentTime(video.currentTime);
    // const durationChange = () => setDuration(video.duration);
    const loadedMetadata = () => {
    //   setDuration(video.duration);
      setIsLoading(false);
    };
    const playHandler = () => setIsPlaying(true);
    const pauseHandler = () => setIsPlaying(false);

    // video.addEventListener("timeupdate", timeUpdate);
    // video.addEventListener("durationchange", durationChange);
    video.addEventListener("loadedmetadata", loadedMetadata);
    video.addEventListener("play", playHandler);
    video.addEventListener("pause", pauseHandler);

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    //   video.removeEventListener("timeupdate", timeUpdate);
    //   video.removeEventListener("durationchange", durationChange);
      video.removeEventListener("loadedmetadata", loadedMetadata);
      video.removeEventListener("play", playHandler);
      video.removeEventListener("pause", pauseHandler);
    };
  }, [videoUrl]);

//   const handlePlayPause = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//     }
//   };

//   const handleMuteUnmute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !videoRef.current.muted;
//       setIsMuted(!isMuted);
//     }
//   };

//   const handleTimeSkip = (seconds: number) => {
//     if (videoRef.current) {
//       const newTime = videoRef.current.currentTime + seconds;
//       videoRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
//     }
//   };

//   const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
//     if (progressRef.current && videoRef.current) {
//       const rect = progressRef.current.getBoundingClientRect();
//       const pos = (event.clientX - rect.left) / rect.width;
//       const seekTime = pos * duration;
//       videoRef.current.currentTime = seekTime;
//       setCurrentTime(seekTime);
//     }
//   };

  return (
    <div className="binaria w-full h-full overflow-hidden ">
      <div className="h-full">
       

        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="h-full w-full"
            controls={true}
            playsInline
            autoPlay={isPlaying}
            // muted={isMuted}
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
          {/* <Scanlines /> */}
        </div>

        <div className="flex font-medium items-center justify-between py-0 border-t border-primary">
        
          <div className="h-full flex">
            <div className="h-full flex items-center gap-2 text-primary uppercase px-3 border-l border-primary">
              {isLoading ? "Loading..." : "Playing"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;