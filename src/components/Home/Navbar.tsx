import { useAppCtx } from "@/context/app.contex";
import useGetAgents from "@/hooks/api/agents/useGetAgents";
import { cn, formatBigNumber, hasSkill } from "@/lib/utils";
import { Agent } from "@/types";
import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import SimpleCardSkeleton from "../Skeleton/SimpleCardSkeleton";
import DYNAMICICONS from "@/assets/DynamicIcon";

const Navbar = () => {
  const { hideSidebar, setHideSidebar } = useAppCtx();
  const { agents, loadingAgent } = useGetAgents({ page: 1, time: "week" });
  const [newAgents, setNewAgents] = useState<any>();
  const [topAgents, setTopAgents] = useState<any>();


  useEffect(() => {
    const filertdatares = agents?.result?.slice(0, 7)
    setTopAgents(filertdatares)

    const filertnewgent = agents && agents.result
      ? agents.result
        .sort((a: Agent, b: Agent) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 7)
      : [];
    setNewAgents(filertnewgent)
    console.log(filertdatares)
  }, [agents]);


  return (
    <aside
      className={cn(
        "h-full flex relative bg-[#00120A]   pt-4  overflow-hidden text-nowrap  text-lg  z-[100] flex-col  border-r-[.5px]",
        "transition-all duration-300 ease-in-out",
        hideSidebar ? "min-w-[80px]" : "min-w-[280px]",
        "-md:hidden"
      )}
    >
      <div className="flex h-full  flex-col justify-between">
        <div
          className={cn(
            "flex  items-center gap-2   w-full px-4 pb-0",
            hideSidebar ? "justify-center" : "justify-between "
          )}
        >
          {!hideSidebar && (
            <div
              className={cn(
                hideSidebar ? "hidden absolute left-0" : "flex gap-1"
              )}
            ></div>
          )}

          <div
            className="w-6 h-6  cursor-pointer bg-[#00120A]"
            onClick={() => setHideSidebar((prev) => !prev)}
          >
            {hideSidebar ? <LogIn absoluteStrokeWidth size={"1.2rem"} /> : <LogOut size={"1.2rem"}  />}
          </div>
        </div>
        <div className="flex-1 px-4 overflow-y-scroll hideScrollbrar">
          <div className="flex flex-col gap-3 ">
            <div className="flex-1 ">
              {!hideSidebar && (
                <div className="flex text-md font-bold uppercase underline">
                  <p>Top_agents</p>
                </div>
              )}

              <div
                className={`mt-2 flex flex-col gap-0  ${hideSidebar ? "pt-6" : ""}`}
              >
                {

                  loadingAgent ?
                    [...Array(5)].map((_, i) => (
                      <SimpleCardSkeleton key={i} />

                    ))


                    :
                    topAgents?.map((agent: Agent) => (

                      <AgentItem hideNav={hideSidebar} data={agent} />


                    ))
                }

              </div>
            </div>

            <div className="flex-1">
              <div
                className={`flex uppercase items-center gap-2 w-full underline ${hideSidebar ? "justify-center" : "text-center"}`}
              >
                {!hideSidebar ? (
                  <>
                    <div className="flex text-md font-bold uppercase underline">
                      <p className="">new_agents</p>
                    </div>
                    <div className="w-full h-[1px] bg-[#fff]"></div>
                  </>
                ) : (
                  ">"
                )}
              </div>

              <div className="mt-2 flex flex-col gap-0 ">
                {


                  loadingAgent ?
                    [...Array(5)].map((_, i) => (
                      <SimpleCardSkeleton key={i} />

                    ))


                    :
                    newAgents?.map((agent: Agent) => (

                      <AgentItem hideNav={hideSidebar} data={agent} />


                    ))
                }

              </div>
            </div>

            {/* <div className="flex-1">
              <div
                className={`flex uppercase items-center gap-2 w-full underline ${hideSidebar ? "justify-center" : "text-center"}`}
              >
                {!hideSidebar ? (
                  <>
                    <p>watchlist</p>
                    <div className="w-full h-[1px] bg-[#fff]"></div>
                  </>
                ) : (
                  ">"
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2 ">
              {
                  newAgents?.map((agent:Agent)=>(
                    
                <AgentItem hideNav={hideSidebar} data={agent}/>
                    

                  ))
                }
               
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;

export const AgentItem = ({
  hideNav,
  data
}: {
  _onClick?: () => void;
  hideNav?: boolean;
  data: Agent
}) => {

  return (
    <div
      // onClick={() => navigate(`/agent/${data?.address}`)}
      className="flex cursor-pointer rounded-sm gap-3 w-full p-[5px] hover:bg-white/10" >
      <img
        className="min-w-8  min-h-8 max-w-8  max-h-8 rounded-md"
        src={data?.avatar}
        alt=""
      />
      {hideNav ? null : (
        <div className="text-sm uppercase w-full flex flex-col justify-between gap-0 ">
          <div className="flex font-medium gap-2  text-md">
            <p className="text-[16px]">{data?.name}</p>
            {/* {
              data?.live ?
              <div
              className="rounded-xs h-min  bg-primary text-[#000] gap-1 p-1 py-[2px]  text-[10px]  flex justify-center items-center font-bold
            "
            >
              <div className="w-1 rounded-[50%] h-1 bg-[#000]"></div>
              <p className="pt-[2px] leading-[80%] text-[10px]  ">Live</p>
            </div>
            :null
            } */}
           
          </div>
          <div className="flex text-[#D4D4D4] w-full font-normal text-[12px] justify-between ">
            <div className="flex leading-[100%]">
              <p>MC: ${formatBigNumber(data?.marketCap)}</p>
            </div>
            <div className="flex gap-2">
              {
                hasSkill(data, "social")
                  ?

                  <DYNAMICICONS.socialSkil w={"16px"} color={hasSkill(data, "social") ? "#89FC96" : "#959595"} />
                  : null
              }
              {
                hasSkill(data, "terminal")
                  ?

                  <DYNAMICICONS.terminalSkil w={"16px"} color={hasSkill(data, "terminal") ? "#89FC96" : "#959595"} />

                  : null
              }
              {
                hasSkill(data, "audio")
                  ?

                  <DYNAMICICONS.audioSkil w={"16px"} color={hasSkill(data, "audio") ? "#89FC96" : "#959595"} />


                  : null
              }
              {
                hasSkill(data, "visual")
                  ?

                  <DYNAMICICONS.visualSkil w={"16px"} color={hasSkill(data, "visual") ? "#89FC96" : "#959595"} />


                  : null
              }
              {
                hasSkill(data, "immersive")
                  ?

                  <DYNAMICICONS.immearsivelSkil w={"16px"} color={hasSkill(data, "immersive") ? "#89FC96" : "#959595"} />

                  : null
              }



            </div>
          </div>
        </div>
      )}
    </div>
  );
};
