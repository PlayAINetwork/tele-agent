import { IMAGES } from "@/assets";
import TvConsole from "./Console";

const TvPanel = () => {
  return (
    <div className=" relative border-[1px] border-primary bg-card rounded-2xl place-content-center  w-full place-items-center overflow-hidden ">
      <div className="absolute bottom-0">
        <div className="w-full h-3 bg-primary  flex   items-center sp_hero-neon-strip-wrapper">
        <div className="w-full h-1 bg-[#ff6348]"></div>

        </div>

        <img src={IMAGES.line} alt="" />
      </div>
      <TvConsole />

    </div>
  );
};

export default TvPanel;
