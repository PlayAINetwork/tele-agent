import { IMAGES } from "@/assets";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import SimpleAgentLineChart from "../Leaderboard/graphs/SimpleAgentLineChart";
import { useNavigate } from "react-router-dom";
import useGetAgents from "@/hooks/api/agents/useGetAgents";
import { formatBigNumber, hasSkill } from "@/lib/utils";
import DYNAMICICONS from "@/assets/DynamicIcon";

const CourseCarousel = () => {
  //   const [currentIndex, setCurrentIndex] = useState(2);
  const [orders, setOrders] = useState([5, 6, 0, 1, 2, 3, 4]);
const navigate = useNavigate()
const {agents}= useGetAgents()
const [filterAgents, setFilterAgents] = useState<any>();




useEffect(() => {
 const filertdatares =  agents?.result?.slice(0,6)
 setFilterAgents(filertdatares)
  console.log(filertdatares)
  }, [agents]);


 
  const dataset = [
    { name: "1", marketCap: 2, mindshare: 21 },
    { name: "2", marketCap: 21, mindshare: 22 },
    { name: "3", marketCap: 23, mindshare: 20 },
    { name: "4", marketCap: 22, mindshare: 21 },
    { name: "5", marketCap: 24, mindshare: 23 },
    { name: "6", marketCap: 5, mindshare: 22 },
    { name: "7", marketCap: 21, mindshare: 24 },
    { name: "8", marketCap: 23, mindshare: 25 },
    { name: "9", marketCap: 22, mindshare: 21 },
    { name: "10", marketCap: 23, mindshare: 2 },
  ];
  const handlePrev = () => {
    setOrders((prevOrders) => {
      const newOrders = prevOrders.map((order) => (order + 1) % 7);
      return newOrders;
    });
    // setCurrentIndex(
    //   (prevIndex) => (prevIndex - 1 + courses.length) % courses.length
    // );
  };

  const handleNext = () => {
    setOrders((prevOrders) => {
      const newOrders = prevOrders.map((order) => (order - 1 + 7) % 7);
      return newOrders;
    });
    // setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length);
  };

  const getItemClasses = (order: any) => {
    const baseClasses =
      "absolute transition-all duration-500 ease-in-out cursor-pointer";
    switch (order) {
      case 0: // Focus (Center)
        return `${baseClasses} z-30 h-[85%] w-[48%] top-[5%] left-[26%]`;
      case 1: // Right Big
        return `${baseClasses} z-20 h-[75%] w-[44%] top-[10%] left-[41%]`;
      case 2: // Right Small
        return `${baseClasses} z-10 h-[65%] w-[40%] top-[15%] left-[53%]`;
      case 3: // Far Right
        return `${baseClasses} z-0 h-[55%] w-[36%] top-[20%] left-[63%] opacity-40`;
      case 4: // Far Left
        return `${baseClasses} z-0 h-[55%] w-[36%] top-[20%] left-[1%] opacity-40`;
      case 5: // Left Small
        return `${baseClasses} z-10 h-[65%] w-[40%] top-[15%] left-[7%]`;
      case 6: // Left Big
        return `${baseClasses} z-20 h-[75%] w-[44%] top-[10%] left-[15%]`;
      default:
        return baseClasses;
    }
  };
  return (
    <div className="  h-full w-full  overflow-hidden">
      <div className="h-full w-full  mx-auto px-4 py-7  items-center">
        <div className=" py-0 px-4 text-xl  uppercase">
          <p>featured agents</p>
        </div>
        <div className="relative w-full h-[100%]">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-[1%] top-1/2 -translate-y-1/2 text-3xl font-semibold cursor-pointer z-40 w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform bg-white/10 rounded-full backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft absoluteStrokeWidth />
          </button>

          {/* Carousel Items */}
          <div className="relative w-full h-full">
            {filterAgents?.map((data:any, index:any) => (
              <div key={index} className={getItemClasses(orders[index])} onClick={() => navigate(`/agent/${data?.address}`)}>
                <div className="  relative w-full h-full object-cover r\ overflow-hidden shadow-lg border-primary  border-[0.5px] transition-all duration-500">
                  <div
                    className="absolute
                 blackshade
                 w-full h-full
                  
                  
                  "
                  >
                    <img
                      className="w-full h-full object-cover   "
                      src={IMAGES.blackshard}
                      alt={data?.name}
                    />
                  </div>
                  <img
                    className="w-full h-full object-cover   "
                    src={data?.avatar}
                    alt={data?.name}
                  />
                </div>

                {/* {orders[index] === 0 && ( */}
                <div className="absolute bottom-0 left-0 right-0 p-3 py-2 bg-card  border-primary  border-[0.5px] max-h-[60px] min-h-[30px]">
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <img
                        className="w-10  h-10 rounded-md"
                        src={data?.avatar}
                        alt=""
                      />
                      <div className="flex flex-col gap-0">
                        <p className="text-white text-md font-semibold capitalize ">
                        {data?.name}
                        </p>
                        {/* <p className="text-white/80 text-sm  font-normal line-clamp-2">
                          $ROGUE
                        </p> */}
                      </div>
                    </div>

                    <div className="flex gap-6 text-sm text-[#F1F6F2] h-full ">
                      <div className="flex">
                        <div>
                          <p>${formatBigNumber(data?.marketCap) ?? 0}</p>
                          <p className="font-normal text-xs uppercase text-[#D4D4D4]">
                            market cap
                          </p>
                        </div>
                        <div className="w-[60px] h-full">
                          <SimpleAgentLineChart
                            data={dataset}
                            dataKey="marketCap"
                            color="#3b82f6"
                          />
                        </div>
                      </div>
                      <div className="flex">
                        <div>
                       
                          <p className="font-normal  uppercase text-[#D4D4D4]">
                          Skill Traits
                          </p>
                          <div className="flex gap-3">
                              <DYNAMICICONS.socialSkil color={hasSkill(data, "social")? "#89FC96": "#959595"} />

                              <DYNAMICICONS.terminalSkil color={hasSkill(data, "terminal")? "#89FC96": "#959595"} />

                              <DYNAMICICONS.audioSkil color={hasSkill(data, "audio")? "#89FC96": "#959595"}/>
                              <DYNAMICICONS.visualSkil color={hasSkill(data, "visual")? "#89FC96": "#959595"}/>
                              <DYNAMICICONS.immearsivelSkil color={hasSkill(data, "immersive")? "#89FC96": "#959595"}/>

                          </div>
                        </div>
                       
                      </div>
                    </div>
                  </div>
                </div>
                {/* )} */}
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-[1%] top-1/2 -translate-y-1/2 text-3xl font-semibold cursor-pointer z-40 w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform bg-white/10 rounded-full backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight absoluteStrokeWidth />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;
