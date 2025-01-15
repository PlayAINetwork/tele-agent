import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { trimAddress } from "@/lib/utils";
import { SendHorizontalIcon } from "lucide-react";
// import { ICONS } from "@/assets";
import { useAppCtx } from "@/context/app.contex";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { ICONS } from "@/assets";

const GlobelBox = () => {
  const { connected, publicKey } = useWallet();
  const address: any = publicKey?.toString();

  const { disableAction } = useAppCtx();
  const { toast } = useToast();
  const messages = useQuery(api.functions.chats.getChats);
  const sends = useMutation(api.functions.chats.send);
  const boxRef: any = useRef(null);
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
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div className="   flex flex-col gap-4  h-[400px] justify-between ">
      <div
        ref={boxRef}
        className="flex flex-col flex-1   gap-4 overflow-auto h-full   p-4 bg-[#131314] "
      >
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
            <div key={_id} className="flex gap-2 uppercase items-start binaria">
              <div className="flex items-center gap-1">
                <img
                  src={ICONS.icon_textarrow}
                  alt=""
                  className="max-h-[13px]"
                  height={13}
                />
                <p className="text-[14px] text-[#B6B6B6]">
                  {trimAddress(user, 3)}:
                </p>
              </div>
              <p
                className="text-sm font-thin text-card-foreground
            text-wrap "
              >
                {text}
              </p>
            </div>
          )
        )}
      </div>

      {connected ? (
        <>
          <div className="flex gap-0">
            <div className="relative w-full  border-t-[1px] border-primary">
              <Input
                className="pr-[40px] binaria border-none  hover:bg-[#303030]"
                value={message}
                type="text"
                placeholder="Start typing…"
                disabled={disableAction}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button
              disabled={disableAction}
              onClick={handleSend}
              // variant={"ghost"}
              className="bg-primary text-md items-center text-[#010101]"
            >
              <SendHorizontalIcon />
              send_msg
            </Button>
          </div>
          {/* <TippingCard close={setsTipAgent} />  */}
        </>
      ) : null}
    </div>
  );
};

export default GlobelBox;
