
import GlobelBox from "./GlobelBox";
import { useWallet } from "@solana/wallet-adapter-react";


import Collapsible from "../app/Collapsible";

import TerminalDemo from "./TerminalLogs";



const Sidebar = () => {
  const { connected } = useWallet();

  // const config = genConfig(address);


  return (
    <aside
      className="relative h-full max-w-[100%] md:max-w-[420px] min-w-[100%] md:min-w-[420px] "

    >
      <div
        className={`flex  ${connected ? " justify-between" : "justify-end"}  `}
      >

      </div>
      {/* <div className="absolute h-full w-[1800px] top-0 z-[1] opacity-[.4]">
        <img src={IMAGES.bg} alt="" className="h-full" />
      </div> */}
      <div className=" relative z-[10] binaria flex flex-col gap-4 py-2 md:py-12 px-4 md:pr-6">
        <Collapsible titel={"GLObal chat"} subtext={"chat with the community."}>
          <GlobelBox />

          {/* <div className="p-4">
            <ChatComponent agentId={id} />
          </div> */}
        </Collapsible>

        <Collapsible titel={"terminal"} subtext={"brain of the agent to verify rag, memory, and automated tasks."}>
          <TerminalDemo/>
        </Collapsible>

        {/* <Collapsible titel={"GLObal chat"} subtext={"chat with the community."}>
          <TerminalLogs />
        </Collapsible>
        <Collapsible titel={"GLObal chat"} subtext={"chat with the community."}>
          <CharacterBox />
        </Collapsible> */}

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
