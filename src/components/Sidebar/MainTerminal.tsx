// import { useState, useEffect, useMemo, useRef } from "react";
// import Hls from "hls.js";
// import { 
//   ChevronRight, 
//   Play, 
//   Square, 
//   Volume2, 
//   VolumeX,
//   SkipForward,
//   SkipBack,
//   Video,
//   Rewind,
//   FastForward
// } from "lucide-react";

// interface Channel {
//   type: "live" | "rec";
//   url: string;
//   title: string;
//   isHLS?: boolean;
// }

// interface Channels {
//   [key: number]: Channel;
// }

// // const cn = (...classes: string[]): string => classes.filter(Boolean).join(" ");

// const formatTime = (seconds: number): string => {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const remainingSeconds = Math.floor(seconds % 60);
//   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
// };

// const Scanlines: React.FC = () => (
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

// const StaticNoiseEffect: React.FC = () => (
//   <div className="absolute inset-0">
//     <div className="absolute inset-0 animate-[flicker_0.01s_infinite]">
//       <div className="w-full h-full">
//         <div
//           className="absolute inset-0 opacity-40"
//           style={{
//             backgroundImage: `repeating-radial-gradient(
//               circle at 50% 50%,
//               #fff 0px,
//               #111 1px,
//               #111 2px,
//               #fff 3px
//             )`,
//             backgroundSize: "4px 4px",
//             animation: "noise 0.2s infinite",
//           }}
//         />
//       </div>
//     </div>
//     <Scanlines />
//   </div>
// );

// const TvConsole: React.FC = () => {
//   const [power, setPower] = useState<boolean>(true);
//   const [channel, setChannel] = useState<number>(2); // Start with HLS channel
//   const [staticEffect, setStaticEffect] = useState<boolean>(false);
//   const [isMuted, setIsMuted] = useState<boolean>(false);
//   const [isPlaying, setIsPlaying] = useState<boolean>(true);
//   const [currentTime, setCurrentTime] = useState<number>(0);
//   const [duration, setDuration] = useState<number>(0);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const hlsRef = useRef<Hls | null>(null);
//   const progressRef = useRef<HTMLDivElement>(null);

//   const channels: Channels = {
//     1: {
//       type: "live",
//       url: "https://player.twitch.tv/?channel=theagentexperience&parent=localhost&parent=dev.podcastslanding-fe.pages.dev&parent=podcastslanding-fe.pages.dev&parent=agentexperience.live",
//       title: "rogue live",
//     },
//     2: {
//       type: "rec",
//       url: "https://assets.podcast.playai.network/master.m3u8",
//       title: "rogue recording",
//       isHLS: true
//     },
//   };

//   useEffect(() => {
//     if (channel === 2 && videoRef.current) {
//       const video = videoRef.current;
      
//       if (Hls.isSupported()) {
//         const hls = new Hls({
//           debug: false,
//           enableWorker: true,
//           lowLatencyMode: true,
//         });
        
//         hlsRef.current = hls;
//         hls.loadSource(channels[2].url);
//         hls.attachMedia(video);
        
//         hls.on(Hls.Events.MANIFEST_PARSED, () => {
//           setIsLoading(false);
//           if (isPlaying) {
//             video.play().catch(console.error);
//           }
//         });

//         hls.on(Hls.Events.ERROR, (event, data) => {
//           if (data.fatal) {
//             switch (data.type) {
//               case Hls.ErrorTypes.NETWORK_ERROR:
//                 hls.startLoad();
//                 break;
//               case Hls.ErrorTypes.MEDIA_ERROR:
//                 hls.recoverMediaError();
//                 break;
//               default:
//                 initHLS();
//                 break;
//             }
//           }
//         });

//         return () => {
//           if (hlsRef.current) {
//             hlsRef.current.destroy();
//             hlsRef.current = null;
//           }
//         };
//       } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
//         video.src = channels[2].url;
//         video.addEventListener('loadedmetadata', () => {
//           setIsLoading(false);
//           if (isPlaying) {
//             video.play().catch(console.error);
//           }
//         });
//       }
//     }
//   }, [channel]);

//   const initHLS = () => {
//     if (hlsRef.current) {
//       hlsRef.current.destroy();
//     }
//     if (videoRef.current) {
//       const hls = new Hls();
//       hlsRef.current = hls;
//       hls.loadSource(channels[2].url);
//       hls.attachMedia(videoRef.current);
//     }
//   };

//   useEffect(() => {
//     if (videoRef.current) {
//       const video = videoRef.current;
      
//       const timeUpdate = () => setCurrentTime(video.currentTime);
//       const durationChange = () => setDuration(video.duration);
//       const loadedMetadata = () => setDuration(video.duration);
      
//       video.addEventListener('timeupdate', timeUpdate);
//       video.addEventListener('durationchange', durationChange);
//       video.addEventListener('loadedmetadata', loadedMetadata);
      
//       return () => {
//         video.removeEventListener('timeupdate', timeUpdate);
//         video.removeEventListener('durationchange', durationChange);
//         video.removeEventListener('loadedmetadata', loadedMetadata);
//       };
//     }
//   }, []);

//   const handlePlayPause = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const handleMuteUnmute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !videoRef.current.muted;
//       setIsMuted(!isMuted);
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

//   const handleTimeSkip = (seconds: number) => {
//     if (videoRef.current) {
//       const newTime = videoRef.current.currentTime + seconds;
//       videoRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
//     }
//   };
//   const handleNextChannel = (): void => {
//     const nextChannel = channel + 1;
//     if (nextChannel <= Object.keys(channels).length) {
//       setChannel(nextChannel);
//       setStaticEffect(true);
//       setTimeout(() => setStaticEffect(false), 1000);
//     }
//   };

//   const handlePrevChannel = (): void => {
//     const prevChannel = channel - 1;
//     if (prevChannel >= 1) {
//       setChannel(prevChannel);
//       setStaticEffect(true);
//       setTimeout(() => setStaticEffect(false), 1000);
//     }
//   };


//   const currentChannel = useMemo(() => channels[channel], [channel]);

//   const renderVideoPlayer = () => (
//     <div className="relative w-full h-full">
//       <video
//         ref={videoRef}
//         className="w-full h-full"
//         playsInline
//         autoPlay={isPlaying}
//         muted={isMuted}
//       />
//       <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
//         <div 
//           ref={progressRef}
//           className="w-full h-1 bg-gray-600 cursor-pointer mb-2"
//           onClick={handleSeek}
//         >
//           <div 
//             className="h-full bg-primary"
//             style={{ width: `${(currentTime / duration) * 100}%` }}
//           />
//         </div>
//         <div className="flex justify-between text-white text-sm">
//           <span>{formatTime(currentTime)}</span>
//           <span>{formatTime(duration)}</span>
//         </div>
//       </div>
//       <Scanlines />
//     </div>
//   );

//   return (
//     <div className="relative w-full h-full overflow-hidden">
//       <div className="relative w-full h-full">
//         <div className="h-full grid grid-rows-[30px_1fr_40px] gap-0">
//           <div className="w-full uppercase top-0">
//             <div className="w-full px-2 py-1 gap-2 text-[#000000] bg-primary flex items-center">
//               <ChevronRight className="w-4 h-4" />
//               {currentChannel?.title}
//             </div>
//           </div>

//           <div className="relative">
//             {staticEffect ? <StaticNoiseEffect /> : renderVideoPlayer()}
//           </div>

//           <div className="flex font-[500] items-center justify-between py-0 border-t border-primary">
//             <div className="flex gap-0 h-full text-sm">
//               <div className="bg-primary px-3 gap-3 flex items-center">
//                 <div className="flex text-black gap-1 items-center">
//                   <Video className="w-4 h-4" />
//                   REC
//                 </div>
//               </div>
//               <button
//                 className="border-primary border-r px-3"
//                 onClick={handleNextChannel}
//                 disabled={!power || channel === Object.keys(channels).length}
//               >
//                 <SkipForward className="w-4 h-4 text-primary" />
//               </button>
//               <button
//                 className="border-primary border-r px-3"
//                 onClick={() => handleTimeSkip(-10)}
//                 disabled={!power}
//               >
//                 <Rewind className="w-4 h-4 text-primary" />
//               </button>

//               <button
//                 className="border-primary border-r px-3"
//                 onClick={handlePlayPause}
//                 disabled={!power}
//               >
//                 <div className="flex gap-2 items-center text-primary">
//                   {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//                   {isPlaying ? "STOP" : "PLAY"}
//                 </div>
//               </button>

//               <button
//                 className="border-primary border-r px-3"
//                 onClick={() => handleTimeSkip(10)}
//                 disabled={!power}
//               >
//                 <FastForward className="w-4 h-4 text-primary" />
//               </button>

//               <button
//                 className="border-primary border-r px-3"
//                 onClick={handlePrevChannel}
//                 disabled={!power || channel === 1}
//               >
//                 <SkipBack className="w-4 h-4 text-primary" />
//               </button>
//               <button
//                 className="border-primary border-r px-3"
//                 onClick={handleMuteUnmute}
//                 disabled={!power}
//               >
//                 {isMuted ? (
//                   <VolumeX className="w-5 h-5 text-primary" />
//                 ) : (
//                   <Volume2 className="w-5 h-5 text-primary" />
//                 )}
//               </button>
//             </div>

//             <div className="h-full flex">
//               <div className="h-full flex items-center gap-2 text-primary uppercase px-3 border-l border-primary">
//                 <ChevronRight className="w-4 h-4" color="#89FC96" />
//                 {isLoading ? "Loading..." : formatTime(currentTime)}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TvConsole;