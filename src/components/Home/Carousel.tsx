import { IMAGES } from "@/assets";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import SimpleAgentLineChart from "../Leaderboard/graphs/SimpleAgentLineChart";
import { useNavigate } from "react-router-dom";

import { formatBigNumber, hasSkill, processGraphDataToSeven } from "@/lib/utils";
import DYNAMICICONS from "@/assets/DynamicIcon";
import { Skeleton } from "../ui/skeleton";
import useGetFeaturedAgents from "@/hooks/api/agents/useFeaturedAgent";
import useGetAgentVideo from "@/hooks/api/agents/useGetAgentVideo";
import AgentTv from "../TvPanel/AgentTv";
import VideoPlayer from "../TvPanel/AgentRecTv";


const getItemClasses = (order: number) => {
  const baseClasses = "absolute transition-all duration-500 ease-in-out cursor-pointer";

  switch (order) {
    case 0: // Center (Focus)
      return `${baseClasses} z-30 h-4/5 w-full md:w-3/6 md:top-[9.5%] md:left-[25%]`;
    case 1: // Left
      return `${baseClasses} z-20 h-3/4 w-4/5 md:w-[45%] md:top-[12.5%] left-0 md:left-[10%] opacity-75`;
    case 2: // Right
      return `${baseClasses} z-20 h-3/4 w-4/5 md:w-[45%] md:top-[12.5%] right-0 md:left-[45%] opacity-75`;
    default:
      return baseClasses;
  }
};
const CourseCarousel = () => {
  // const [orders, setOrders] = useState([3, 4, 0, 1, 2]);
  const [orders, setOrders] = useState([1, 2, 0]);

  const { featuredAgents, loadingAgent } = useGetFeaturedAgents({ page: 1, time: "week" });
  const [filterAgents, setFilterAgents] = useState([]);

  useEffect(() => {
    const filteredData: any = featuredAgents?.result?.slice(0, 3);
    setFilterAgents(filteredData);
  }, [featuredAgents]);



  const handlePrev = () => {
    setOrders((prevOrders) => {
      // We subtract 1 and add 3 before modulo to ensure we don't get negative numbers
      const newOrders = prevOrders.map((order) => (order - 1 + 3) % 3);
      return newOrders;
    });
  };


  const handleNext = () => {
    setOrders((prevOrders) => {
      const newOrders = prevOrders.map((order) => (order - 1 + 5) % 3);
      return newOrders;
    });
  };

  // const getItemClasses = (order: any) => {
  //   const baseClasses =
  //     "absolute transition-all duration-500 ease-in-out cursor-pointer";
  //   switch (order) {
  //     case 0: // Center (Focus)
  //       return `${baseClasses} z-30 h-[85%] w-[50%] top-[7.5%] left-[25%]`;
  //     case 1: // Right
  //       return `${baseClasses} z-20 h-[75%] w-[45%] top-[12.5%] left-[45%]`;
  //     case 2: // Far Right
  //       return `${baseClasses} z-10 h-[65%] w-[40%] top-[17.5%] left-[60%] opacity-50`;
  //     case 3: // Far Left
  //       return `${baseClasses} z-10 h-[65%] w-[40%] top-[17.5%] left-[0%] opacity-50`;
  //     case 4: // Left
  //       return `${baseClasses} z-20 h-[75%] w-[45%] top-[12.5%] left-[10%]`;
  //     default:
  //       return baseClasses;
  //   }
  // };


  return (
    <div className="  h-full w-full  overflow-hidden">
      <div className="h-full w-full  mx-auto px-4 py-0  items-center">
        {/* <div className=" py-0 px-4 text-xl  uppercase">
          <p>featured agents</p>
        </div> */}
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

          <div className="relative w-full h-[85%] md:h-[90%] py-6">
            {
              loadingAgent ?
                [...Array(3)].map((_, index) => (
                  <div key={index} className={getItemClasses(orders[index]) + " bg-gray-800 "}>
                    <Skeleton className="w-full h-full  border-primary border-[0.5px] rounded-[0px] " />


                    <div className={` bottom- left-0 right-0 p-3 py-2 bg-card border-primary border-[0.5px] max-h-[60px] min-h-[30px]`}>
                      <div className="flex justify-between">
                        <div className="flex gap-2 items-center">

                          <div className="w-8 h-8 md:w-10  md:h-10 rounded-md bg-gray-700 animate-pulse" />
                          <div className="flex flex-col gap-1">
                            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                          </div>
                        </div>

                        <div className="flex gap-6 text-sm h-full overflow-hidden">
                          <div className="flex gap-2">
                            <div>
                              <div className="h-4 w-20 bg-gray-700 rounded animate-pulse mb-1" />
                              <div className="h-3 w-16 bg-gray-700 rounded animate-pulse" />
                            </div>
                            <div className="w-[60px] h-full bg-gray-700 rounded animate-pulse" />
                          </div>
                          <div className=" hidden md:flex">
                            <div>
                              <div className="h-3 w-20 bg-gray-700 rounded animate-pulse mb-2" />
                              <div className="flex gap-3">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className="w-4 h-4 bg-gray-700 rounded animate-pulse" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                :
                filterAgents?.map((data: any, index: any) => (
                  <CarouselItem data={data} index={index} orders={orders} />
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


const CarouselItem = ({ data, index, orders }: { data: any, index: number, orders: any }) => {
  const navigate = useNavigate();

  const { agentVideo } = useGetAgentVideo(data?.id ?? "")

  return (

    <div key={index} className={getItemClasses(orders[index])} onClick={() => navigate(`/agent/${data?.id}`)}>
      <div className={` relative w-full bg-black  h-full object-cover  overflow-hidden shadow-lg ${orders[index] == 0 ? "border-[#F1F6F2] " : 'border-primary'}   border-[0.5px] transition-all duration-500`}>
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
        {
          agentVideo?.result.length > 0 && orders[index] == 0 ?
            data?.live ?
              <AgentTv videoUrl={agentVideo?.result?.find((video: any) => video.live)?.url} />

              :
              <VideoPlayer videoUrl={agentVideo?.result?.find((video: any) => !video.live)?.url ?? agentVideo?.result[0]?.url} />

            :
            <img
              className="w-full h-full object-cover   "
              src={data?.avatar}
              alt={data?.name}
            />
        }

      </div>

      {/* {orders[index] === 0 && ( */}
      <div className={`  p-3 py-2 bg-card  ${orders[index] == 0 ? "border-[#F1F6F2] " : 'border-primary'}   border-[0.5px] max-h-[60px] min-h-[30px]`}>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <img
              className="w-8 h-8 md:w-10  md:h-10 rounded-md"
              src={data?.avatar}
              alt=""
            />
            <div className="flex items-center gap-2">
              <p className="text-white text-md font-semibold capitalize ">
                {data?.name}
              </p>
              {
                data?.live ?
                <div
                className="rounded-xs h-min  bg-primary text-[#000] gap-1 p-1 py-[2px]  text-[10px]  flex justify-center items-center font-bold
              "
              >
                <div className="w-1 rounded-[50%] h-1 bg-[#000]"></div>
                <p className="pt-[2px] leading-[80%] text-[10px]  ">Live</p>
              </div>:null
              }
              
              {/* <p className="text-white/80 text-sm  font-normal line-clamp-2">
          $ROGUE
        </p> */}
            </div>
          </div>

          <div className="flex gap-6 text-sm text-[#F1F6F2] h-full  ">

            {
              data?.address ?
                <div className="flex items-center md:items-start ">
                  <div>
                    <p>${formatBigNumber(data?.marketCap) ?? 0}</p>
                    <p className="font-normal text-xs uppercase text-[#D4D4D4]">
                      market cap
                    </p>
                  </div>
                  <div className="w-[60px] h-full">
                    <SimpleAgentLineChart
                      data={processGraphDataToSeven(data?.marketCapGraph, 7)}
                      dataKey="value"
                      color="#3b82f6"
                    />
                  </div>
                </div>
                :
                null
            }

            <div className="hidden md:flex ">
              <div>

                <p className="font-normal  uppercase text-[#D4D4D4]">
                  Skill Traits
                </p>
                <div className="flex gap-3">
                  <DYNAMICICONS.socialSkil color={hasSkill(data, "social") ? "#89FC96" : "#959595"} />

                  <DYNAMICICONS.terminalSkil color={hasSkill(data, "terminal") ? "#89FC96" : "#959595"} />

                  <DYNAMICICONS.audioSkil color={hasSkill(data, "audio") ? "#89FC96" : "#959595"} />
                  <DYNAMICICONS.visualSkil color={hasSkill(data, "visual") ? "#89FC96" : "#959595"} />
                  <DYNAMICICONS.immearsivelSkil color={hasSkill(data, "immersive") ? "#89FC96" : "#959595"} />

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  )

}
