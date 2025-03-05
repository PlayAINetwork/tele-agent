import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { trimAddress } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import CustomSolanaButton from "../WalletConnect/solConnectBtn";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import DYNAMICICONS from "@/assets/DynamicIcon";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppCtx } from "@/context/app.contex";

const Footer = () => {
  const { toast } = useToast();
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const {isMobile} = useAppCtx();
const navigate = useNavigate();
const {pathname} = useLocation();
  const address: any = publicKey?.toString();
  const copy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    toast({
      title: "Address has been copied to the clipboard.",
    });
  };

  const menu = [
    {
      label: "Features",
      icon: <DYNAMICICONS.Features />,
      activeIcon: <DYNAMICICONS.Features color="#88FC95" />,
      link: "/features",
    },
    {
      label: "Experience",
      icon: <DYNAMICICONS.Experience />,
      activeIcon: <DYNAMICICONS.Experience color="#88FC95" />,
      link: "/rogue",
    },
    
    {
      label: "Create",
      icon: <DYNAMICICONS.Create />,
      activeIcon: <DYNAMICICONS.Create color="#88FC95" />,
      link: "/create-with-rogue",
    },
    {
      label: "Stake",
      icon: <DYNAMICICONS.Stake />,
      activeIcon: <DYNAMICICONS.Stake color="#88FC95" />,
      link: "/stake",
    },
    {
      label: "Terminal",
      icon: <DYNAMICICONS.Terminal />,
      activeIcon: <DYNAMICICONS.Terminal color="#88FC95" />,
      link: "/terminal",
    },
  ];
  return (
    <div>

      <div className=" flex md:hidden border-t-[1px] justify-between  border-primary bg-secondary w-full p-3 px-6">
        {
          menu?.map((item, index) => (
            <div className=" flex flex-col justify-end items-center gap-2" key={index} onClick={() => navigate(item.link)}>
              <div className="justify-center flex items-center">
         {pathname === item.link ? item.activeIcon : item.icon}

              </div>
            <p className={`text-[8px] ${pathname === item.link ? "text-[#88FC95]" : "text-[#A3A3A3]"}`}>{item.label}</p>
          </div>
          ))
        }
       

      </div>

    <div className="flex  justify-between items-center w-full border-t-[1px] border-primary bg-secondary px-2 md:p-4 md:py-1">
      <div>
        <Button
          className="text-[8px] md:text-sm flex justify-center items-center px-0 md:px-4 "
          onClick={() => copy("27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL")}
          variant={"ghost"}
        >
          <span className="text-primary text-sm">CA:</span>
          27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL
        </Button>
      </div>
      <div className="flex">
        <Button
          onClick={() =>
            open(
              "https://raydium.io/swap/?outputMint=27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL&inputMint=sol",
              "_brace"
            )
          }
          variant={"ghost"}
          className="w-full text-sm hidden md:block py-1 px-6 h-auto uppercase rounded-[40px]"
        >
          <div className="mt-1">BUY $ROGUE</div>
        </Button>
        
        {connected ? (
          <Button
            onClick={disconnect}
            className="w-full text-xs md:text-md md:py-1 md:px-6 h-auto uppercase bg-transparent text-primary md:bg-primary  md:text-black p-0"
          >
            <div className="mt-1">
              {" "}
              {isMobile ? "" :trimAddress(address, 4) + " "}
              {"[Disconnect]"}
            </div>
          </Button>
        ) : 
        <>
        <div className="block md:hidden">
        <Button
          className="text-xs flex justify-center items-center px-0 "
          onClick={() => setVisible(true)}
          variant={"ghost"}
        >
         Connect Wallet
        </Button>
        </div>
        <div className="hidden md:block">
           <CustomSolanaButton
          connectText="Connect Wallet"
          disconnectText="Disconnect Wallet"
          buttonStyle="primary"
          size="medium"
          />
        </div>
          </>
       }
      </div>{" "}
    </div>

    </div>

  );
};

export default Footer;
