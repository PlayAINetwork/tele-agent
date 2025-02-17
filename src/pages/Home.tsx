import { IMAGES } from "@/assets";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const Home = () => {
  return (
    <div className="relative h-full flex justify-center items-center w-full">

      <div className="absolute w-full h-full flex justify-center items-center">
        <img src={IMAGES.homebgLine} alt="" />
      </div>

      <div className="relative border-y-4 py-14 w-full bg-[#01010180] px-20 border-[#89FC96] border-solid [border-image-source:linear-gradient(90deg,#89FC96_0%,rgba(137,252,150,0)_100%)] [border-image-slice:1]">
      <div className="absolute  right-20 bottom-0 w-[300px]">
        <img src={IMAGES.homehero} alt="" className="w-full h-full object-cove" />
      </div>
       <div className="relative">
       
       <div  className="flex  flex-col gap-2">
          <p className="text-[50px] leading-[50px]">
          Create AI Agents That Sound Human
          </p>
          <div className="w-[340px] border border-solid [border-image-source:linear-gradient(90deg,#89FC96_0%,#FFFFFF_100%)] [border-image-slice:1]"></div>
          <p className="text-[35px] ">
          The Very First No-Code Multilingual Audio AI Framework
          </p>
        </div>

        <div className="absolute bottom-[-77px]">
          <Button>
         <Play fill=""/> LEARN MORE
          </Button>
        </div>
       </div>

      </div>
    
    </div>
  );
};

export default Home;
