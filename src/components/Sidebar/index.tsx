import { useAppCtx } from "@/context/app.contex";
import { trimAddress } from "@/lib/utils";

import Tabs from "./Tabs";
import GlobelBox from "./GlobelBox";
import TeerminalBox from "./TeerminalBox";
import { Button } from "../ui/button";
import Avatar, { genConfig } from "react-nice-avatar";
import CustomSolanaButton from "../WalletConnect/solConnectBtn";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { useTokenBalance } from "@/hooks/token/useGetTokenBalance";
import CharacterBox from "./CharacterBox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import GenerateVedio from "./GenerateVedio";
import TerminalLogs from "./TerminalLogs";
import { IMAGES } from "@/assets";

const Sidebar = () => {
  const { toast } = useToast();
  const { connected, publicKey, disconnect } = useWallet();
  const { balance } = useTokenBalance(publicKey);

  const address: any = publicKey?.toString();
  const config = genConfig(address);

  const { hideSidebar, sidebarMenu } = useAppCtx();

  const copy = async (address: string) => {
    console.log(balance);
    await navigator.clipboard.writeText(address);
    toast({
      title: "Address has been copied to the clipboard.",
    });
  };
  return (
    <aside
      className="relative overflow-hidden h-full border-[1px] border-primary bg-card rounded-2xl max-w-[400px] min-w-[400px] "
      // className={cn(
      //   "m-10 h-full gap-4  px-4  py-2 flex md:bg-card fixed top-0 right-0 overflow-hidden text-nowrap font-sans text-lg  z-10 flex-col md:border-l",
      //   "transition-all duration-300 ease-in-out",
      //   hideSidebar ? "w-[auto]" : "w-[100%] md:w-[400px]  bg-card",
      //   // "-md:hidden"
      // )}
    >
      <div
        className={`flex  ${connected ? " justify-between" : "justify-end"}  `}
      >
        {/* {hideSidebar ? (
          <img
            className="cursor-pointer"
            onClick={() => setHideSidebar((prev) => !prev)}
            src={ICONS.icon_sidebarView__btn}
            alt=""
          />
        ) : (
          <X
            className="cursor-pointer"
            onClick={() => setHideSidebar((prev) => !prev)}
            width={20}
            height={20}
          />
        )} */}
      </div>
      <div className="absolute h-full w-[1800px] top-0 z-[1] opacity-[.4]">
        <img src={IMAGES.bg} alt="" className="h-full" />
      </div>
      <div className="h-full py-4 relative z-[10]">
        {!hideSidebar && (
          <div className="flex flex-col gap-5 h-full">
            <Tabs />
            <div className="grow  h-4 px-4 DIGITALIZE ">
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
            {connected ? (
              !hideSidebar && connected ? (
                <div onClick={() => ""} className="px-4 w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button  className="w-full rounded-[40px] gap-2">
                        <Avatar
                          className="cursor-pointer ] px-0 "
                          style={{ width: "32px", height: "32px" }}
                          {...config}
                          // shape="square"
                        />
                        <div className="pt-1">
                         {trimAddress(address)}

                        </div>
                      </Button>
                      
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[370px] bg-[#000] text-[#fff]  ">
                      <DropdownMenuLabel>Profile</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <div className="flex text-sm flex-col gap-2 p-2">
                        <div className="flex gap-2">
                          <p>Address:</p>
                          <Button
                            onClick={() => copy(address)}
                            variant={"ghost"}
                            className="p-0 h-auto"
                          >
                            
                            {trimAddress(address)}
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <p>$ROGUE:</p>
                          <p> {balance}</p>
                        </div>
                        <Button
                          onClick={disconnect}
                          className="w-full  rounded-[40px]"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : null
            ) : (
              <div className="px-4">
                {/* <SolConnectBtn/> */}
                <CustomSolanaButton
                  connectText="Connect Wallet"
                  disconnectText="Disconnect Wallet"
                  buttonStyle="primary"
                  size="medium"
                />
                {/* <ConnectWallet /> */}
              </div>
            )}
          </div>
        )}
      </div>
     
    </aside>
  );
};

export default Sidebar;
