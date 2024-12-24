import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTokenBalance } from "@/hooks/token/useGetTokenBalance";

const StackPopup = () => {
  const { balance } = useTokenBalance();
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

      <DialogContent className=" flex flex-col sm:max-w-md md:max-w-[400px] gap-0 h-[50vh] border-2 border-primary binaria bg-[#181818] p-0 pt-0 overflow-auto ">
        <div className="flex justify-between">
          <DialogDescription className=" px-4 uppercase text-md text-gray-200 py-2   bg-primary text-[#010101]">
            {">> stake_your_rogue"}
          </DialogDescription>

          <DialogClose className="w-[40px] flex justify-center items-center bg-primary z-10">
            <X className="text-black" />
          </DialogClose>
        </div>
        <div className=" flex-1 h-full overflow-auto ">
          <div className="flex flex-col  h-full  border-primary border-[1px]  justify-center items-center gap-4     bg-[#131314] ">
            <div className="flex gap-3 flex-wrap">
              <div className="flex flex-col gap-2">
                <div className="flex w-full  ">
                  <div>Rogue Balance: {balance ?? 0}</div>
                </div>
                <div className="flex w-full  ">
                  <div>staked Rogue: {balance ?? 0}</div>
                </div>
                <div className="flex w-full  border-[1px] border-primary">
                  {/* <Textarea
              className="h-[50px]  binaria uppercase placeholder-white"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Inject your topic here"
            /> */}
                  <Input
                    className="pr-[40px] binaria border-none  uppercase hover:bg-[#303030]"
                    //   value={prompt}
                    //   onChange={(e) => setPrompt(e.target.value)}
                    type="text"
                    placeholder="type_your_amount"
                    //   disabled={disableAction}
                    // onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="flex w-full gap-2  ">
                  <Button
                    className=" uppercase w-full"
                    //   onClick={transferTokens}
                    //   disabled={videoGeneraing || !connected || disableAction}
                  >
                    stake
                  </Button>
                  <Button
                    className=" uppercase w-full "
                    //   onClick={transferTokens}
                    //   disabled={videoGeneraing || !connected || disableAction}
                  >
                    unstake
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StackPopup;
