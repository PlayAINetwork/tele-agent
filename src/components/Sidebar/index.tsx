import { useAppCtx } from "@/context/app.contex";
import { cn } from "@/lib/utils";

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

const Sidebar = () => {
const {toast} = useToast()
  const { connected, publicKey } = useWallet();
  const address: any = publicKey?.toString();

  const config = genConfig(address);

  const { setHideSidebar, hideSidebar, sidebarMenu } = useAppCtx();

  const copy = async()=>{
    await navigator.clipboard.writeText("27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL");
    toast({
      title: "The contract address has been copied to the clipboard.",
    });
  }
  return (
    <aside
      className={cn(
        "h-full gap-4 px-4 py-2 flex bg-card fixed top-0 right-0 overflow-hidden text-nowrap font-sans text-lg  z-10 flex-col ",
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
            <Avatar
              className="cursor-pointer rounded-none"
              style={{ width: "32px", height: "32px" }}
              {...config}
              shape="square"
            />
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
              {sidebarMenu === "global" ? <GlobelBox /> : <TeerminalBox />}
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
             
              <Button variant={"ghost"} onClick={()=>open("https://x.com/0xRogueAgent","_brace")}>
                <Twitter />
              </Button>

              <Button onClick={()=>copy()} variant={"ghost"}>CA:27yzfJ......t8MZ9mL</Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
