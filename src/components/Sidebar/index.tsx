
import GlobelBox from "./GlobelBox";



import Collapsible from "../app/Collapsible";

import TerminalDemo from "./TerminalLogs";
import TeerminalBox from "./TeerminalBox";
import CharacterBox from "./CharacterBox";



const Sidebar = () => {
  // const { connected } = useWallet();

  // const config = genConfig(address);


  return (
    <aside
      className="relative h-full max-w-[100%] md:max-w-[420px] min-w-[100%] md:min-w-[420px] "

    >
     
     
      <div className=" relative z-[10] binaria flex flex-col gap-4 py-2 md:py-12 px-4 md:px-0  md:pr-4 ">
      <div
              className=" py-2 pt-5 flex text-lg cursor-pointer items-center gap-1  uppercase"
            >
              <p>Agent services</p>
            </div>
        <Collapsible titel={"GLObal chat"} subtext={"chat with the community."}>
          <GlobelBox />

          {/* <div className="p-4">
            <ChatComponent agentId={id} />
          </div> */}
        </Collapsible>

        <Collapsible titel={"terminal"} subtext={"brain of the agent to verify rag, memory, and automated tasks."}>
          <TerminalDemo/>
        </Collapsible>

        <Collapsible titel={"topic injection"} subtext={"add custom topics or links for agents."}>
          <TeerminalBox />
        </Collapsible>
        <Collapsible titel={"character injection"} subtext={"add custom topics or links for agents."}>
          <CharacterBox />
        </Collapsible>

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
