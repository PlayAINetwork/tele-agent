import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { trimAddress } from "@/lib/utils";
import { SendHorizontalIcon } from "lucide-react";
// import { ICONS } from "@/assets";
import TippingCard from "./TippingCard";
import { useAppCtx } from "@/context/app.contex";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useWallet } from "@solana/wallet-adapter-react";

const GlobelBox = () => {
  const { connected, publicKey } = useWallet();
const address :any=publicKey?.toString()

  const [showTipAgent, setsTipAgent] = useState(false);
  const { disableAction } = useAppCtx();
  const { toast } = useToast();
  const messages = useQuery(api.functions.chats.getChats);
  const sends = useMutation(api.functions.chats.send);
  const boxRef: any = useRef(null)
  const [message, setChatMessage] = useState("");
  // console.log(messages ? messages :"ddfd","messages")
  const handleSend = () => {
    if (message === "") {
      toast({
        title: "Enter your message",
      });
      return false;
    }
    if (message.trim()) {
      sends({ user: address, text: message });
      setChatMessage(""); // Clear the input after sending
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

   useEffect(() => {
    // Scroll to the bottom whenever logs change
    if (boxRef.current) {
      boxRef.current.scrollTo({
        top: boxRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])
  return (
    <div className="   flex flex-col gap-4  h-full justify-between overflow-auto ">
      <div ref={boxRef} className="flex flex-col flex-1   gap-2 overflow-auto h-full bg-muted p-4 ">
        {messages?.map(
          ({
            _id,
            text,
            user,
          }: {
            _id: string;
            text: string;
            user: string;
          }) => (
            <div key={_id} className="flex gap-2 items-center">
              <p className="text-[14px] font-semibold">{trimAddress(user)}:</p>
              <p
                className="text-sm 
            text-wrap "
              >
                {text}
              </p>
            </div>
          )
        )}
       
        
      </div>
      {showTipAgent ? <TippingCard close={setsTipAgent} /> : null}
      {connected ? (
        <div className="flex gap-2">
          <div className="relative w-full">
            <Input
              className="pr-[40px] hover:border-[#B5B6B7] hover:bg-[#303030]"
              value={message}
              type="text"
              placeholder="Start typing…"
              disabled={disableAction}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              disabled={disableAction}
              onClick={handleSend}
              variant={"ghost"}
              className="absolute right-0 top-0"
            >
              <SendHorizontalIcon />
            </Button>
          </div>
          {/* {showTipAgent ? null : (
            <Button
              disabled={disableAction}
              onClick={() => setsTipAgent(true)}
              className="bg-[#0842A0] border-[2px] border-[#B5B6B7] hover:bg-[#0842A0] "
            >
              <img src={ICONS.icon_tip__btn} alt="" />
            </Button>
          )} */}
        </div>
      ) : null}
    </div>
  );
};

export default GlobelBox;
