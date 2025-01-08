
const AgentTv = () => {
  return (
    <div className="binaria w-full h-full overflow-hidden border border-[rgba(241, 246, 242, 1)]">
      <div className=" relative w-full h-full">

        <div className="absolute font-thin left-2 top-2 uppercase">
        <p className="text-2xl">24</p>

        <p className="text-xs">watching</p>
        </div>
        <iframe
          width="100%"
          height="100%"
          src={
            "https://player.twitch.tv/?channel=anchorman_ai&parent=localhost&parent=dev.podcastslanding-fe.pages.dev&parent=podcastslanding-fe.pages.dev&parent=agentexperience.live"
          }
          title="TV Content"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen={true}
        />
        {/* <Scanlines /> */}
      </div>
    </div>
  );
};

export default AgentTv;
