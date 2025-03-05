import { ICONS } from '@/assets';
import StakePopup from '@/components/app/StackPopup';


export const Staking = () => {
   

    const list = [
        {
          title: "Earn a share from $ROGUE's revenue",
         
          icon: ICONS.icon_up,
        },
        {
          title: "Early access to new features",
          icon: ICONS.icon_key,
        },
        {
          title: "Access to exclusive staker -only features.",
          icon: ICONS.icon_headphones,
        },
        {
          title: "Discount across $ROGUE services.",
          icon: ICONS.icon_tag,
        },
        
      ];
  return (
<div className="flex flex-col justify-start md:gap-20 gap-10 items-center h-full">
   <StakePopup/>
   

      <div className='w-full flex flex-col justify-center items-center gap-10 md:px-20'>
        <div className="text-primary border-2 border-primary py-1 px-20 transform transition-transform  pt-2 text-sm  md:text-md" >WHY STAKE ROGUE?</div>
        <div className=" md:hidden w-full h-full flex flex-col gap-0 ">
        
        <div className="flex w-full justify-center mb-4 h-[115px]">
          <div className="w-1/2   relative">
            <div className="absolute w-full left-0 ">
            <Card {...list[0]} />
            </div>
          </div>

          <div className="w-1/2  relative">
            <div className="absolute w-full left-0 ">
            <Card {...list[1]} />
            </div>
          </div>

         
        </div>
        <div className="flex w-full justify-center mb-4 h-[115px]">
          <div className="w-1/2   relative">
            <div className="absolute w-full left-0 ">
            <Card {...list[0]} />
            </div>
          </div>

          <div className="w-1/2  relative">
            <div className="absolute w-full left-0 ">
            <Card {...list[1]} />
            </div>
          </div>

         
        </div>

        </div>
        <div className=" hidden md:grid grid-cols-1 md:grid-cols-4 w-[100%]  md:gap-0 gap-3">

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
      <div className="w-full md:max-w-lg mx-auto overflow-hidden transition-transform duration-500 ease-out hover:scale-[1.02]">
        {/* Border Container */}
        <div className="relative w-full h-[120px]  md:h-[150px]  md:aspect-[2/1]">
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
                <img src={icon} alt="" className='md:w-7 md:h-7 w-5 h-5' />
                {/* <Icon className="w-6 h-6 text-green-500 sm:w-8 sm:h-8" /> */}
              </div>
  
              {/* Text */}
              <h2 className="text-xs md:text-md uppercase  tracking-wider text-center md:max-w-[80%] text-[#F1F6F2CC]">
                {title}
              </h2>
  
             
            </div>
          </div>
        </div>
      </div>
    );
  };
  
