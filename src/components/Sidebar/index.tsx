
import GlobelBox from "./GlobelBox";
import { useWallet } from "@solana/wallet-adapter-react";

import { IMAGES } from "@/assets";
import Collapsible from "../app/Collapsible";



const Sidebar = () => {
  const { connected } = useWallet();

  // const config = genConfig(address);


  return (
    <aside
      className="relative overflow-hidden h-full  max-w-[380px] min-w-[380px] "

    >
      <div
        className={`flex  ${connected ? " justify-between" : "justify-end"}  `}
      >

      </div>
      <div className="absolute h-full w-[1800px] top-0 z-[1] opacity-[.4]">
        <img src={IMAGES.bg} alt="" className="h-full" />
      </div>
      <div className=" relative z-[10] binaria flex flex-col gap-4 py-12 pr-6">
        <Collapsible titel={"GLObal chat"} subtext={"chat with the community."}>
          <GlobelBox />

          <div className="p-4">
            {/* <ChatComponent agentId={id} /> */}
          </div>
        </Collapsible>

        {/* <Collapsible titel={"GLObal chat"} subtext={"chat with the community."}>
          <TeerminalBox />
        </Collapsible>

        <Collapsible titel={"GLObal chat"} subtext={"chat with the community."}>
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
