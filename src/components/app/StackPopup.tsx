import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { ChevronRight, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTokenBalance } from "@/hooks/token/useGetTokenBalance";
import { useState } from "react";

const StackPopup = () => {
  const { balance } = useTokenBalance();
  const [isStake, setStake] = useState(true)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="px-12 w-full h-full cursor-pointer bg-neutral-700 flex justify-center items-center overflow-hidden"
          style={{
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        >
          <span className="text-white relative transition-transform duration-300 ease-in-out">
            <span
              className={`block transition-all duration-300 ${"opacity-100 translate-y-0"}`}
            >
              {"> stake now <"}
            </span>
            <span
              className={`block absolute text-nowrap top-0 left-0  transition-all duration-300 ${"opacity-0 -translate-y-full"}`}
            >
              {"> stake now <"}
            </span>
          </span>
        </div>
      </DialogTrigger>

      <DialogContent className={` flex flex-col sm:max-w-md md:max-w-[500px] gap-0  border-2 border-primary binaria bg-[#181818] p-0 pt-0 overflow-auto `}>
        <div className="flex justify-between">
          <DialogDescription onClick={()=> setStake(true)} className={` px-4 w-full uppercase text-md text-gray-200 py-2  cursor-pointer  ${isStake ? "bg-primary text-[#010101] ":"bg-[#181818] text-[#fff]"} `}>
            {">> stake_$rogue"}
          </DialogDescription>
          <DialogDescription onClick={()=> setStake(false)} className={`px-4 w-full uppercase text-md text-gray-200 py-2   cursor-pointer  ${isStake ? "bg-[#181818] text-[#fff]":"bg-primary text-[#010101]"} `}>
            {">> UNSTAKE_$rogue"}
          </DialogDescription>
          <DialogClose className="min-w-[40px] flex justify-center items-center bg-primary z-10">
            <X className="text-black" />
          </DialogClose>
        </div>
        <div className=" flex-1 h-full overflow-auto w-full">
          <div className="flex flex-col  h-full py-6 px-6   w-full border-primary border-[1px]  justify-center items-center gap-4     bg-[#131314] ">
            <div className="flex gap-3  w-full flex-wrap">
              <div className="flex w-full flex-col gap-2 text-[#F1F6F2]">
                {
                  isStake ? 
                  <div className="flex w-full  ">
                  <div>ROGUE Balance: {balance ?? 0}</div>
                </div>
                  :
                  <div className="flex w-full  ">
                  <div>ROGUE staked Balance:  {balance ?? 0}</div>
                </div>
                }
              
              
                <div className="flex w-full  border-[1px] border-primary">
                  
                  <Input
                    className="pr-[40px] min-w-full binaria border-none  uppercase hover:bg-[#303030]"
                    //   value={prompt}
                    //   onChange={(e) => setPrompt(e.target.value)}
                    type="text"
                    placeholder={isStake ?"input_$ROGUE_TO_STAKE":"input_$ROGUE_TO_UNSTAKE"}
                    //   disabled={disableAction}
                    // onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="flex w-full text-[#B6B6B6]">
                  <div>DISCLAIMER: ONCE STAKED, t</div>
                </div>
               
              </div>
            </div>
          </div>
          <div className="flex w-full gap-0  ">
                  <Button
                    className=" uppercase w-full bg-[#181818] text-[#fff] hover:text-[#fff] hover:bg-[#171717]"
                    //   onClick={transferTokens}
                    //   disabled={videoGeneraing || !connected || disableAction}
                  >
                    cancel
                  </Button>
                  <Button
                    className=" uppercase w-full "
                    //   onClick={transferTokens}
                    //   disabled={videoGeneraing || !connected || disableAction}
                  >
                <ChevronRight className="w-4 h-4" color="#000" />
{
  isStake ? "stake" :"unstake"
}
                    
                  </Button>
                  
                </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StackPopup;
