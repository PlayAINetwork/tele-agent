import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useToast } from "@/hooks/use-toast";
import useGetTokenBalance from "@/hooks/token/useGetTokenBalance";
import { useAppCtx } from "@/context/app.contex";

const TippingCard = ({ close }: { close: any }) => {
  const [amount, setAmount] = useState<string>("");
  const { tokenBalance } = useGetTokenBalance();
  const { toast } = useToast();
  const { disableAction, setDisableAction } = useAppCtx();


  const sendTip = async () => {
    console.log(Number(tokenBalance) , Number(amount))
    if (amount == "") {
      toast({
        title: "Enter your Amount",

        // description: "Friday, February 10, 2023 at 5:57 PM",
      });
      return false;
    } else if (Number(tokenBalance) < Number(amount) || tokenBalance == null) {
      toast({
        title: "Insufficient Balance for Transfer. ",

        description: "Please Purchase More Tokens.",
      });
      return false;

    }

    try {
      setDisableAction(true)
      // const transaction

      // // Get the provider from wagmi

      // const res = await transaction;
      // console.log("res", res);

      // if (res) {
      // setDisableAction(false)

      //   const receipt = await waitForTransactionReceipt(evm_config, {
      //     hash: res, // Use the hash from the transaction object
      //   });

      //   if (receipt) {
      //     console.log(receipt, "receipt");
      //     toast({
      //       title: "Transaction Successful! ",
    
      //       description: "Your tokens have been transferred successfully.",
      //     });
      //     setAmount('')
      //   }
      // }
    } catch (error) {
      setDisableAction(false)

      console.error("Transaction error:", error);
    }
  };
  return (
    <div className="bg-muted flex flex-col gap-4 p-4 py-6">
      <div className="relative w-full">
        <Input
          // className="py-4 px-4"
          className="pr-[70px] hover:border-[#B5B6B7] hover:bg-[#303030]"

          value={amount}
          type="number"
          placeholder="0.00"
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="absolute right-4 top-0 h-full flex justify-center items-center">
          <p className="text-[14px] ">$host</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
        disabled={disableAction}
          className="bg-[#444746] w-full text-primary"
          onClick={() => close(false)}
        >
          Cancel
        </Button>
        <Button disabled={disableAction} className="w-full" onClick={sendTip}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default TippingCard;
