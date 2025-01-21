
import GlobelBox from "./GlobelBox";



import Collapsible from "../app/Collapsible";

import TerminalDemo from "./TerminalLogs";
import TeerminalBox from "./TeerminalBox";
import CharacterBox from "./CharacterBox";
import StackBox from "./StackBox";
import { useParams } from "react-router-dom";



const Sidebar = () => {
  const { id } = useParams();

  // const config = genConfig(address);


  return (
    <aside
      className="relative h-full max-w-[100%] md:max-w-[420px] min-w-[100%] md:min-w-[420px] "

    >


      <div className=" relative z-[10] binaria flex flex-col gap-4 py-2 md:py-12 px-4 md:px-0  md:pr-4 ">
        <div
          className="  pt-5 flex text-lg cursor-pointer items-center gap-0  uppercase"
        >
          <p>Agent services</p>
        </div>
        <Collapsible titel={"GLObal chat"} subtext={"chat with the community."} showD={true}>
          <GlobelBox />

          {/* <div className="p-4">
            <ChatComponent agentId={id} />
          </div> */}
        </Collapsible>

     
        
        {
          id === "def99ef5-2a4c-4f03-9614-b91ff3503217" || id === "795fe77a-14b2-45f7-84c7-1bc532dd766d"

          ?
          <Collapsible titel={"terminal"} subtext={"brain of the agent to verify rag, memory, and automated tasks."}>
          <TerminalDemo />
        </Collapsible>

          :null
        }
       
        {
          id === "def99ef5-2a4c-4f03-9614-b91ff3503217"

          ?
          <Collapsible titel={"topic injection"} subtext={"add custom topics or links for agents."}>
          <TeerminalBox />
        </Collapsible>

          :null
        }

        {
          id === "def99ef5-2a4c-4f03-9614-b91ff3503217"

          ?
          <Collapsible titel={"character injection"} subtext={"add custom topics or links for agents."}>
          <CharacterBox />
        </Collapsible>

          :null
        }
        {
          id === "def99ef5-2a4c-4f03-9614-b91ff3503217"

          ?
          <Collapsible titel={"Staking $ROGUE"} subtext={"Stake $Rogue to earn rewards."}>
          <StackBox />
        </Collapsible>
          :null
        }
      

        {/* <div className="flex flex-col gap-0 h-full">
            <Tabs />
            <div className="grow  h-4   ">
              {sidebarMenu === "global" ? (
                <GlobelBox />
              ) : sidebarMenu === "inject" ? (
                <TeerminalBox />
              ) : sidebarMenu === "terminal" ? (
                <TerminalLogs />
              ) : sidebarMenu === "create" ? (
                <GenerateVedio />
              ) : (
                <CharacterBox />
              )}
            </div>
            
          </div> */}

      </div>
    </aside>
  );
};

export default Sidebar;
