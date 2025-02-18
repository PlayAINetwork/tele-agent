import { ICONS } from '@/assets';
import StakePopup from '@/components/app/StackPopup';
import { Button } from '@/components/ui/button';


export const Staking = () => {
   

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
   <StakePopup/>
   

      <div className='w-full flex flex-col justify-center items-center gap-10 px-20'>
        <Button variant={"outline" }className="text-primary px-20 transform transition-transform duration-500 ease-out hover:scale-[1.02]" >WHY STAKE ROGUE?</Button>
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
              clipPath: "polygon(6% 0, 100% 0%, 94% 100%, 0% 100%)",
            }}
          />
  
          {/* Main Content Layer */}
          <div
            className="absolute inset-[2px] bg-[#1A1F20] text-white"
            style={{
              clipPath: "polygon(6% 0, 100% 0%, 94% 100%, 0% 100%)",
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
              <h2 className="text-md md:text-md uppercase  tracking-wider text-center max-w-[80%] text-[#F1F6F2CC]">
                {title}
              </h2>
  
             
            </div>
          </div>
        </div>
      </div>
    );
  };
  
