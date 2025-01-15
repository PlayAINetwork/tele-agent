import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { trimAddress } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";

const Footer = () => {
  const { toast } = useToast();
  const { connected, publicKey, disconnect } = useWallet();
  const address: any = publicKey?.toString();
  const copy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    toast({
      title: "Address has been copied to the clipboard.",
    });
  };
  return (
    <div className="flex  justify-between w-full border-t-[1px] border-primary bg-secondary p-4 py-2">
      <div>
        <Button
          className="text-md"
          onClick={() => copy("27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL")}
          variant={"ghost"}
        >
          <span className="text-primary">CA:</span>
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
          className="w-full text-md  py-1 px-6 h-auto uppercase rounded-[40px]"
        >
          <div className="mt-1">BUY $ROGUE</div>
        </Button>
        {connected ? (
          <Button
            onClick={disconnect}
            className="w-full text-md py-1 px-6 h-auto uppercase "
          >
            <div className="mt-1">
              {" "}
              {trimAddress(address, 4) + " "}
              {"[Disconnect]"}
            </div>
          </Button>
        ) : null}
      </div>{" "}
    </div>
  );
};

export default Footer;
