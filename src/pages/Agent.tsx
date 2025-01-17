import DYNAMICICONS from "@/assets/DynamicIcon";
import Navbar from "@/components/Home/Navbar";
import Sidebar from "@/components/Sidebar";
import useGetAgentDetails from "@/hooks/api/agents/useGetAgentDetails";
import useGetAgentVideo from "@/hooks/api/agents/useGetAgentVideo";
import { useToast } from "@/hooks/use-toast";
import { hasSkill, trimAddress } from "@/lib/utils";
import { ArrowLeft, BadgeCheck, Copy, Globe, Twitter } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Agent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams()
  const { agent } = useGetAgentDetails(id ?? "")
  const { agentVideo } = useGetAgentVideo(id ?? "")


useEffect(() => {
  console.log(agentVideo, "agent")

  }, [agent,agentVideo]);


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
        <div className="flex h-full justify-between w-full ">
          <div className="p-4 px-10 w-full flex flex-col gap-3 ">
            <div
              className=" py-2 flex text-lg cursor-pointer items-center gap-1  uppercase"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={"18px"} />
              <p>explore all</p>
            </div>
            {/* <div className="min-h-[400px]">
              <AgentTv />
            </div>
            <p className="text-lg  ">
              Volodymyr Zelenskyy: Ukraine, War, Peace, Putin, Trump, NATO, and
              Freedom | Lex Fridman Podcast
            </p> */}

            <div className="flex justify-between items-center">
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
                    <div
                      onClick={() => copyAddress(agent?.addres)}
                      className="flex gap-1 cursor-pointer items-center text-white/80 text-xs hover:text-white/100 font-normal "
                    >
                      {trimAddress(agent?.address)}

                      <Copy size={"12px"} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
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
                  <Twitter size={"20px"} />
                </div> */}
                <div className="text-white/80 text-sm border h-max p-2 py-1 font-normal line-clamp-2 border-white/30 cursor-pointer hover:bg-white/10">

                  {" "}
                  <Globe size={"20px"} />
                </div>
              </div>
            </div>

            <div>
              <div className=" py-2 flex text-mditems-center gap-1 font-normal  uppercase">
                <p>Skill Traits:</p>
              </div>

              <div className="flex gap-2">
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
            </div>

            {/* <GraphSection/> */}

            <div className="pb-8">
              <div className=" py-2 flex text-mditems-center gap-1 font-normal  uppercase">
                <p>about:</p>
              </div>
              <div className="flex gap-2">
                <div className=" text-sm uppercase font-normal">
                  first ai podcaster agents drawn at inspiration from joe rogan
                  by rektdin, powered by play ai network. with etx etc etc etc.
                  first ai podcaster agents drawn at inspiration from joe rogan
                  by rektdin, powered by play ai network. with etx etc etc etc
                </div>
              </div>
            </div>
          </div>
          <Sidebar />
        </div>

      </div>
    </div>
  );
};

export default Agent;
