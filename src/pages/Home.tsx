import { IMAGES } from "@/assets";

import Sidebar from "@/components/Sidebar";
import TvPanel from "@/components/TvPanel";

const Home = () => {

  return (
  
      <div className="flex flex-1 p-6 h-full py-14 gap-6">
         <div className="absolute h-full flex w-[100%] top-[0] z-[-1]  items-center">
            <img src={IMAGES.bg} alt="" className="w-full" />
          </div>
        <TvPanel />
        <Sidebar />
      </div>
  
  );
};

export default Home;
