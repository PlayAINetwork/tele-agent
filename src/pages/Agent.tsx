import GraphSection from "@/components/AgentPage/GraphSection";
import Navbar from "@/components/Home/Navbar";
import Sidebar from "@/components/Sidebar";
import AgentTv from "@/components/TvPanel/AgentTv";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BadgeCheck, Copy, Globe, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Agent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    toast({
      title: "Address has been copied to the clipboard.",
    });
  };
  return (
    <div className="h-full w-full flex binaria relative">
      <Navbar />
      <div className="w-full h-full overflow-scroll ">
        <div className="flex h-full justify-between w-full ">
          <div className="p-4 px-10 w-full flex flex-col gap-3 ">
            <div
              className=" py-2 flex text-lg cursor-pointer items-center gap-1  uppercase"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={"18px"} />
              <p>explore all</p>
            </div>
            <div className="min-h-[400px]">
              <AgentTv />
            </div>
            <p className="text-lg  ">
              Volodymyr Zelenskyy: Ukraine, War, Peace, Putin, Trump, NATO, and
              Freedom | Lex Fridman Podcast
            </p>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <img
                  className="w-12  h-12 rounded-sm "
                  src="https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                  alt=""
                />
                <div className="flex flex-col gap-0">
                  <div className="flex items-center gap-1">
                    <p className="text-white text-md font-normal uppercase ">
                      agent rogue
                    </p>
                    <div className="text-primary">
                      <BadgeCheck size={"16px"} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <p className="text-white/80 text-xs  font-normal line-clamp-2">
                      $ROGUE
                    </p>
                    <div
                      onClick={() => copyAddress(" 0xdd56...3212")}
                      className="flex gap-1 cursor-pointer items-center text-white/80 text-xs hover:text-white/100 font-normal "
                    >
                      0xdd56...3212
                      <Copy size={"12px"} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="text-white/80 text-sm border h-max p-2 py-1 font-normal line-clamp-2 border-white/30">
                  {" "}
                  $ROGUE: $0.02
                </div>
                <div className="text-white/80 text-sm border h-max p-2 py-1 font-normal line-clamp-2 border-white/30 cursor-pointer hover:bg-white/10">
                  {" "}
                  <Twitter size={"20px"} />
                </div>
                <div className="text-white/80 text-sm border h-max p-2 py-1 font-normal line-clamp-2 border-white/30 cursor-pointer hover:bg-white/10">

                  {" "}
                  <Twitter size={"20px"} />
                </div>
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
                <div className="bg-[#092D0D] border border-[#D4D4D433] text-sm px-3 py-1 uppercase font-normal">
                  social
                </div>

                <div className="bg-[#092D0D] border border-[#D4D4D433] text-sm px-3 py-1 uppercase font-normal">
                  social
                </div>
                <div className="bg-[#092D0D] border border-[#D4D4D433] text-sm px-3 py-1 uppercase font-normal">
                  social
                </div>
              </div>
            </div>

            <GraphSection/>

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
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default Agent;
