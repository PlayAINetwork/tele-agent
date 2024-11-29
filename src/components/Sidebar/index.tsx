import { useAppCtx } from "@/context/app.contex";
import { cn, trimAddress } from "@/lib/utils";

import Tabs from "./Tabs";
import GlobelBox from "./GlobelBox";
import TeerminalBox from "./TeerminalBox";
import { Button } from "../ui/button";
import { ICONS } from "@/assets";
import Avatar, { genConfig } from "react-nice-avatar";
import { Twitter, X } from "lucide-react";
import CustomSolanaButton from "../WalletConnect/solConnectBtn";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { useTokenBalance } from "@/hooks/token/useGetTokenBalance";
import CharacterBox from "./CharacterBox";
import MainTerminal from "./MainTerminal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Sidebar = () => {
  const { toast } = useToast();
  const { connected, publicKey, disconnect } = useWallet();
  const { balance } = useTokenBalance(publicKey);

  const address: any = publicKey?.toString();
  const config = genConfig(address);

  const { setHideSidebar, hideSidebar, sidebarMenu } = useAppCtx();

  const copy = async (address: string) => {
    console.log(balance);
    await navigator.clipboard.writeText(address);
    toast({
      title: "Address has been copied to the clipboard.",
    });
  };
  return (
    <aside
      className={cn(
        "h-full gap-4 px-4 py-2 flex bg-card fixed top-0 right-0 overflow-hidden text-nowrap font-sans text-lg  z-10 flex-col border-l",
        "transition-all duration-300 ease-in-out",
        hideSidebar ? "w-[auto]" : "w-[400px]",
        "-md:hidden"
      )}
    >
      <div
        className={`flex  ${
          connected ? " justify-between" : "justify-end"
        }  py-2`}
      >
        {!hideSidebar && connected ? (
          <div onClick={() => ""}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <Avatar
                    className="cursor-pointer rounded-none px-0 "
                    style={{ width: "32px", height: "32px" }}
                    {...config}
                    shape="square"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#000] text-primary absolute left-[-20px]">
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
                  <Button onClick={disconnect} className="w-full  rounded-[40px]">
                    Disconnect
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}

        {hideSidebar ? (
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
        )}
      </div>

      <div className="h-full  ">
        {!hideSidebar && (
          <div className="flex flex-col gap-5 h-full">
            <Tabs />
            <div className="grow  h-4">
              {sidebarMenu === "global" ? (
                <GlobelBox />
              ) : sidebarMenu === "inject" ? (
                <TeerminalBox />
              ) : sidebarMenu === "terminal" ? (
                <MainTerminal />
              ) : (
                <CharacterBox />
              )}
            </div>
            {connected ? null : (
              <div>
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

            <div className="flex justify-between items-center">
              {/* <p className="text-[14px] ">$host: {tokenBalance ?? 0}</p> */}
              <div>
                <Button
                  variant={"ghost"}
                  onClick={() => open("https://x.com/0xRogueAgent", "_brace")}
                >
                  <Twitter />
                </Button>

                {/* <Button
                  variant={"ghost"}
                  onClick={() => open("https://x.com/0xRogueAgent", "_brace")}
                >
                  <svg
                    fill="#fff"
                    viewBox="0 0 256 256"
                    id="Flat"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M228.646,34.7676a11.96514,11.96514,0,0,0-12.21778-2.0752L31.87109,105.19729a11.99915,11.99915,0,0,0,2.03467,22.93457L84,138.15139v61.833a11.8137,11.8137,0,0,0,7.40771,11.08593,12.17148,12.17148,0,0,0,4.66846.94434,11.83219,11.83219,0,0,0,8.40918-3.5459l28.59619-28.59619L175.2749,217.003a11.89844,11.89844,0,0,0,7.88819,3.00195,12.112,12.112,0,0,0,3.72265-.59082,11.89762,11.89762,0,0,0,8.01319-8.73925L232.5127,46.542A11.97177,11.97177,0,0,0,228.646,34.7676ZM32.2749,116.71877a3.86572,3.86572,0,0,1,2.522-4.07617L203.97217,46.18044,87.07227,130.60769,35.47461,120.28811A3.86618,3.86618,0,0,1,32.2749,116.71877Zm66.55322,86.09375A3.99976,3.99976,0,0,1,92,199.9844V143.72048l35.064,30.85669ZM224.71484,44.7549,187.10107,208.88772a4.0003,4.0003,0,0,1-6.5415,2.10937l-86.1543-75.8164,129.66309-93.645A3.80732,3.80732,0,0,1,224.71484,44.7549Z" />
                  </svg>
                </Button> */}
              </div>

              <Button
                onClick={() =>
                  copy("27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL")
                }
                variant={"ghost"}
              >
                CA:27yzfJ......t8MZ9mL
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
