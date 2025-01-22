import DYNAMICICONS from "@/assets/DynamicIcon";
import GraphSection from "@/components/AgentPage/GraphSection";
import Navbar from "@/components/Home/Navbar";
import Sidebar from "@/components/Sidebar";
import SimpleCardSkeleton from "@/components/Skeleton/SimpleCardSkeleton";
import VideoPlayer from "@/components/TvPanel/AgentRecTv";
import AgentTv from "@/components/TvPanel/AgentTv";
import { Skeleton } from "@/components/ui/skeleton";
import useGetAgentDetails from "@/hooks/api/agents/useGetAgentDetails";
import useGetAgentVideo from "@/hooks/api/agents/useGetAgentVideo";
import { useToast } from "@/hooks/use-toast";
import { hasSkill, trimAddress } from "@/lib/utils";
import { ArrowLeft, BadgeCheck, Copy, Twitter } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Agent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams()
  const { agent, loadingAgent } = useGetAgentDetails(id ?? "")
  const { agentVideo, loadingAgentVideo } = useGetAgentVideo(id ?? "")

  // const loadingAgent = true
  useEffect(() => {
    console.log("agent")

    console.log(agentVideo, "agent", agentVideo?.result[1]?.url)

  }, [agent, agentVideo]);


  const copyAddress = async (address: string) => {

    await navigator.clipboard.writeText(address);
    toast({
      title: "Address has been copied to the clipboard.",
    });

  };
  return (
    <div className="h-full w-full flex binaria relative">
      <Navbar />
      <div className="w-full h-full overflow-y-scroll ">
        <div className="flex h-full justify-between w-full flex-col md:flex-row ">
          <div className="p-4   w-full flex flex-col gap-3 ">
            <div
              className=" py-2 flex text-lg cursor-pointer items-center gap-1  uppercase"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={"18px"} />
              <p>explore all</p>
            </div>
            <div className="min-h-[230px] md:min-h-[400px]">
              {agentVideo?.result?.length > 0 ?
                loadingAgentVideo ?
                  <div className="text-white/80 text-sm border h-full w-full  font-normal line-clamp-2 border-white/30">
                    <Skeleton className="w-full h-full  border-primary border-[0.5px]  " />
                  </div>
                  :
                  <div className="h-full border border-[rgba(241, 246, 242, 1)]">
                    {
                      agentVideo?.result.length > 1 && agentVideo?.result[0]?.live ?
                        <VideoPlayer videoUrl={agentVideo?.result[1]?.url} />

                        :
                        <AgentTv videoUrl={agentVideo?.result[0]?.url} />

                    }
                    {/* <VideoPlayer videoUrl={'https://assets.podcast.playai.network/master.m3u8'}  title="My Video"/> */}


                  </div>
                : null

              }
            </div>
            <p className="text-lg  uppercase">
              {agentVideo?.result.length > 1 && agentVideo?.result[0]?.live ?
                agentVideo?.result[1]?.name :
                agentVideo?.result[0]?.name
              }
            </p>

            <div className="flex flex-col md:flex-row justify-between md:items-center  items-start gap-3">
              {
                loadingAgent ?

                  <SimpleCardSkeleton />
                  :
                  <div className="flex gap-2">
                    <img
                      className="w-12  h-12 rounded-sm "
                      src={agent?.avatar}
                      alt=""
                    />
                    <div className="flex flex-col gap-0">
                      <div className="flex items-center gap-1">
                        <p className="text-white text-md font-normal uppercase ">
                          {agent?.name}
                        </p>
                        <div className="text-primary">
                          {
                            agent?.verified ?
                              <BadgeCheck size={"16px"} />
                              : null
                          }
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {/* <p className="text-white/80 text-xs  font-normal line-clamp-2">
                      $ROGUE
                    </p> */}
                        {
                          agent?.address ?
                            <div
                              onClick={() => copyAddress(agent?.addres)}
                              className="flex gap-1 cursor-pointer items-center text-white/80 text-xs hover:text-white/100 font-normal "
                            >
                              {trimAddress(agent?.address)}

                              <Copy size={"12px"} />
                            </div>

                            : null
                        }

                      </div>
                    </div>

                  </div>
              }


              <div className="flex gap-2">
                {
                  loadingAgent ?

                    <>
                      <div className="text-white/80 text-sm border h-6 w-20  font-normal line-clamp-2 border-white/30">
                        <Skeleton className="w-full h-full  border-primary border-[0.5px]  " />
                      </div>
                      <div className="text-white/80 text-sm border h-6 w-8  font-normal line-clamp-2 border-white/30">
                        <Skeleton className="w-full h-full  border-primary border-[0.5px]  " />
                      </div>
                      {/* <div className="text-white/80 text-sm border h-6 w-8  font-normal line-clamp-2 border-white/30">
                        <Skeleton className="w-full h-full  border-primary border-[0.5px]  " />
                      </div> */}
                    </>


                    :
                    <>
                      <div className="text-white/80 text-sm border h-max p-2 py-1 font-normal line-clamp-2 border-white/30">
                        {" "}
                        {agent?.name}: ${agent?.price}
                      </div>
                      <div onClick={() => window.open(`https://x.com/${agent?.twitter}`, "_blank")} className="text-white/80 text-sm border h-max p-2 py-1 font-normal line-clamp-2 border-white/30 cursor-pointer hover:bg-white/10">
                        {" "}
                        <Twitter size={"20px"} />
                      </div>

                      {/* <div className="text-white/80 text-sm border h-max p-2 py-1 font-normal line-clamp-2 border-white/30 cursor-pointer hover:bg-white/10">

                        {" "}
                        <Globe size={"20px"} />
                      </div> */}
                    </>
                }


              </div>
            </div>

            <div>
              <div className=" py-2 flex text-mditems-center gap-1 font-normal  uppercase">
                <p>Skill Traits:</p>
              </div>

              {
                loadingAgent ?
                  <div className="text-white/80 text-sm border h-6 w-24  font-normal line-clamp-2 border-white/30">
                    <Skeleton className="w-full h-full  border-primary border-[0.5px]  " />
                  </div>

                  :
                  <div className="flex gap-2 flex-wrap">
                    {
                      !hasSkill(agent, "social") && !hasSkill(agent, "terminal") && !hasSkill(agent, "audio") && !hasSkill(agent, "visual") && !hasSkill(agent, "immersive") ?
                        <div className="items-center flex gap-1 bg-[#092D0D] border text-[#89FC96] border-[#D4D4D433] text-sm px-3 py-1 uppercase font-normal">

                          No skill traits
                        </div>
                        : null
                    }
                    {
                      hasSkill(agent, "social") ? <div className="items-center flex gap-1 bg-[#092D0D] border text-[#89FC96] border-[#D4D4D433] text-sm px-3 py-1 uppercase font-normal">
                        <DYNAMICICONS.socialSkil color={hasSkill(agent, "social") ? "#89FC96" : "#89FC96"} />

                        social
                      </div> : null

                    }

                    {
                      hasSkill(agent, "terminal") ? <div className="items-center flex gap-1 bg-[#092D0D] border text-[#89FC96] border-[#D4D4D433] text-sm px-3 py-1 uppercase font-normal">
                        <DYNAMICICONS.terminalSkil color={hasSkill(agent, "terminal") ? "#89FC96" : "#89FC96"} />

                        terminal
                      </div> : null

                    }
                    {
                      hasSkill(agent, "audio") ? <div className="items-center flex gap-1 bg-[#092D0D] border text-[#89FC96] border-[#D4D4D433] text-sm px-3 py-1 uppercase font-normal">
                        <DYNAMICICONS.audioSkil color={hasSkill(agent, "audio") ? "#89FC96" : "#89FC96"} />

                        social
                      </div> : null

                    }
                    {
                      hasSkill(agent, "visual") ? <div className="items-center flex gap-1 bg-[#092D0D] border text-[#89FC96] border-[#D4D4D433] text-sm px-3 py-1 uppercase font-normal">
                        <DYNAMICICONS.visualSkil color={hasSkill(agent, "visual") ? "#89FC96" : "#89FC96"} />

                        social
                      </div> : null

                    }
                    {
                      hasSkill(agent, "immersive") ? <div className="items-center flex gap-1 bg-[#092D0D] border text-[#89FC96] border-[#D4D4D433] text-sm px-3 py-1 uppercase font-normal">
                        <DYNAMICICONS.immearsivelSkil color={hasSkill(agent, "immersive") ? "#89FC96" : "#89FC96"} />

                        social
                      </div> : null

                    }
                  </div>
              }

            </div>{
              agent?.address ?
                <GraphSection data={agent} isLoading={loadingAgent} />
                : null
            }



            <div className=" pb-0 md:pb-8">
              {/* <div className=" py-2 flex text-mditems-center gap-1 font-normal  uppercase">
                <p>about:</p>
              </div>
              <div className="flex gap-2">
                <div className=" text-sm uppercase font-normal">
                  first ai podcaster agents drawn at inspiration from joe rogan
                  by rektdin, powered by play ai network. with etx etc etc etc.
                  first ai podcaster agents drawn at inspiration from joe rogan
                  by rektdin, powered by play ai network. with etx etc etc etc
                </div>
              </div> */}
            </div>
          </div>
          <Sidebar />
        </div>

      </div>
    </div>
  );
};

export default Agent;
