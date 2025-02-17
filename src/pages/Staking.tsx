import { ICONS } from '@/assets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTokenBalance } from '@/hooks/token/useGetTokenBalance';
import { ChevronRight } from 'lucide-react';
import  { useState } from 'react'

export const Staking = () => {
    const { balance } = useTokenBalance();
    const [isStake, setStake] = useState(true);


    const list = [
        {
          title: "Earn x% of $ROGUE's revenue.",
         
          icon: ICONS.icon_up,
        },
        {
          title: "Early access to new features.",
          icon: ICONS.icon_key,
        },
        {
          title: " Unlock special stakers-only audios & features.",
          icon: ICONS.icon_headphones,
        },
        {
          title: "Get a discount in $ROGUE services.",
          icon: ICONS.icon_tag,
        },
        
      ];
  return (
<div className="flex flex-col justify-start gap-20 items-center h-full">
   
    <div className=" relative  border-[1px] border-primary  place-content-center place-items-center w-[70%] flex flex-col">
        <div className="absolute w-4 h-4 bg-primary left-[-10px] top-[-10px]"></div>
        <div className="absolute w-4 h-4 bg-primary right-[-10px] top-[-10px]"></div>
        <div className="absolute w-4 h-4 bg-primary left-[-10px] bottom-[-10px]"></div>
        <div className="absolute w-4 h-4 bg-primary right-[-10px] bottom-[-10px]"></div>

       
        <div className="h-full w-full overflow-hidden ">
         <div className='w-full'>
         <div className="flex justify-between  w-full">
          <div
            onClick={() => setStake(true)}
            className={` px-4 w-full uppercase text-md text-center font-semibold py-2  cursor-pointer  ${isStake ? "bg-primary text-black " : "bg-[#181818] text-[#fff]"} `}
          >
            {">> stake_$rogue"}
          </div>
          <div
            onClick={() => setStake(false)}
            className={`px-4 w-full uppercase text-md text-center font-semibold py-2   cursor-pointer  ${isStake ? "bg-[#181818] text-[#fff]" : "bg-primary text-[#010101]"} `}
          >
            {">> UNSTAKE_$rogue"}
          </div>
         </div>
         <div>
          <div className=" flex-1 h-full overflow-auto w-full">
          <div className="flex flex-col  h-full py-6 px-6   w-full border-primary border-[1px]  justify-center items-center gap-4     bg-[#131314] ">
            <div className="flex gap-3  w-full flex-wrap">
              <div className="flex w-full flex-col gap-2 text-[#F1F6F2]">
                {isStake ? (
                  <div className="flex w-full  ">
                    <div>ROGUE Balance: {balance ?? 0}</div>
                  </div>
                ) : (
                  <div className="flex w-full  ">
                    <div>ROGUE staked Balance: {balance ?? 0}</div>
                  </div>
                )}

                <div className="flex w-full  border-[1px] border-primary">
                  <Input
                    className="pr-[40px] min-w-full binaria border-none  uppercase hover:bg-[#303030]"
                    //   value={prompt}
                    //   onChange={(e) => setPrompt(e.target.value)}
                    type="text"
                    placeholder={
                      isStake
                        ? "input_$ROGUE_TO_STAKE"
                        : "input_$ROGUE_TO_UNSTAKE"
                    }
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
              {isStake ? "stake" : "unstake"}
            </Button>
          </div>
        </div>
        </div>
         </div>
        </div>
      </div>

      <div className='w-full flex flex-col justify-center items-center gap-10 px-20'>
        <Button variant={"outline" }className="text-primary px-20" >WHY STAKE ROGUE?</Button>
        <div className="grid grid-cols-4 w-[100%]  gap-0">

            <Card {...list[0]} />
            <Card {...list[1]} />
            <Card {...list[2]} />
            <Card {...list[3]} />



        </div>
      </div>
    
</div>
  )
}


const Card = ({
    title,
    icon,
    borderColor = "green",
  }: {
    title: string;
    icon: any;
    borderColor?: string;
  }) => {
    const borderClass = {
      green: "bg-green-500",
      blue: "bg-blue-500",
    }[borderColor];
    return (
      <div className="w-full max-w-lg mx-auto overflow-hidden">
        {/* Border Container */}
        <div className="relative w-full  aspect-[2/1]">
          {/* Border Layer */}
          <div
            className={`absolute inset-[1px]  ${borderClass}`}
            style={{
              clipPath: "polygon(5% 0, 100% 0%, 95% 100%, 0% 100%)",
            }}
          />
  
          {/* Main Content Layer */}
          <div
            className="absolute inset-[2px] bg-[#1A1F20] text-white"
            style={{
              clipPath: "polygon(5% 0, 100% 0%, 95% 100%, 0% 100%)",
            }}
          >
            {/* Content Wrapper */}
            <div className="w-full h-full flex flex-col bg-[#89FC960D] items-center justify-center px-8 py-4">
              {/* Icon */}
              <div className="bg-[#89FC961A] rounded-full p-3 mb-4">
                <img src={icon} alt="" className='w-7 h-7' />
                {/* <Icon className="w-6 h-6 text-green-500 sm:w-8 sm:h-8" /> */}
              </div>
  
              {/* Text */}
              <h2 className="text-md sm:text-md uppercase  tracking-wider text-center max-w-[80%]">
                {title}
              </h2>
  
             
            </div>
          </div>
        </div>
      </div>
    );
  };
  
