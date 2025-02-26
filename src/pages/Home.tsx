import { IMAGES } from "@/assets";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const Home = () => {
  return (
    <div className="relative h-full flex justify-center items-center w-full">
      <div className="absolute w-full h-full flex justify-center items-center">
        <img src={IMAGES.homebgLine} alt="" />
      </div>

      <div className=" flex flex-col items-center md:items-start relative border-y-4 py-14 w-full bg-[#01010180] px-4 md:px-20 border-[#89FC96] border-solid [border-image-source:linear-gradient(90deg,#89FC96_0%,rgba(137,252,150,0)_100%)] [border-image-slice:1]">
        <div className="md:absolute mb-6 md:mb-0 right-0 bottom-0 w-[300px]">
          <img
            src={IMAGES.homehero}
            alt=""
            className="w-full h-full object-cove"
          />
        </div>
        <div className="relative">
          <div className="flex  flex-col gap-2 uppercase">
            <p className=" text-xl md:text-4xl md:leading-[50px]">
              Create AI Agents That Sound Human
            </p>
            <div className=" w-full md:w-[340px] border border-solid [border-image-source:linear-gradient(90deg,#89FC96_0%,#FFFFFF_100%)] [border-image-slice:1]"></div>
            <p className=" md:text-2xl ">
              The Very First No-Code Multilingual Audio AI Framework
            </p>
          </div>

          <div className="absolute bottom-[-77px] flex justify-center md:justify-start w-full">
            <Button className="!font-semibold  transform transition-transform duration-500 ease-out hover:scale-[1.02]">
              <Play fill="" /> LEARN MORE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
