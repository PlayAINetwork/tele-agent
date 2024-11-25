import { IMAGES } from "@/assets";
import TvConsole from "./Console";

const TvPanel = () => {
  return (
    <div className="grid place-items-center p-2">
      <div className="absolute z-10 top-4 left-4 md:top-6 md:left-8">
        <img src={IMAGES.logo} alt=""  className="w-[100px] lg:w-[200px]"/>
      </div>
      <TvConsole />
    </div>
  );
};

export default TvPanel;
