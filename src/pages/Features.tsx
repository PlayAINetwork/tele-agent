import { ICONS } from "@/assets";
import { useAppCtx } from "@/context/app.contex";


const Features = () => {
  const features = [
    {
      title: "EMOTIONAL INTELLIGENCE",
      description:
        "AGENTS THAT ADAPT TONE AND RESPONSES BASED ON CONVERSATION CONTEXT",
      icon: ICONS.icon_speech,
    },
    {
      title: "MEMORY SYSTEMS",
      description: "Natural conversations that build on past interactions",
      icon: ICONS.icon_clock,
    },
    {
      title: "UNIQUE VOICE CREATION",
      description: 'Generate unique voices with simple prompts: "Warm, friendly male voice in his 30s" → Done',
      icon: ICONS.icon_microphone,
    },
    {
      title: "MULTILINGUAL SUPPORT",
      description: "Create agents that speak and understand multiple languages fluently Real-time translation across conversations.",
      icon: ICONS.icon_translate,
    //   borderColor: "blue",
    },
    {
      title: "INTEGRATE ANYWHERE",
      description: "INTEGRATE VOICE ACROSS DIFFERENT APPLICATIONS AND SOCIAL CHANNELS.",
      icon: ICONS.icon_clock,
    },
  ];
  return (
    <div className="flex flex-col   gap-10 justify-start items-center h-full w-full  md:py-0">
      <div
        className="md:text-lg uppercase  bg-primary md:w-[570px] px-10 font-semibold py-2 flex justify-center items-center text-black
        "
      >
        <p>{">> Main Pillars of ROGUE <<"}</p>
      </div>
      <div className="w-full h-full flex flex-col md:hidden pb-6 ">
        <div className="flex justify-between mb-4  ">
          <div className="w-[100%] flex flex-col gap-3 relative">
            {
              features?.map((feature, index) => (
                
                <FeatureCard {...feature} key={index}/>
              ))
            }
          </div>

         
        </div>
      </div>
      <div className="hidden w-full h-full md:flex flex-col gap-0 ">
        <div className="flex justify-between mb-4 h-[230px] ">
          <div className="w-[100%]  relative">
            <div className="absolute w-full left-16 ">
              <FeatureCard {...features[0]} />
            </div>
          </div>

          <div className="w-[100%]  relative">
            <div className="md:absolute w-full left-4 ">
              <FeatureCard {...features[1]} />
            </div>
          </div>

          <div className="w-[100%]  relative">
            <div className="absolute w-full right-8 ">
              <FeatureCard {...features[2]} />
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-4 h-[230px]">
          <div className="w-1/3   relative">
            <div className="absolute w-full left-16 ">
              <FeatureCard {...features[3]} />
            </div>
          </div>

          <div className="w-1/3  relative">
            <div className="absolute w-full left-4 ">
              <FeatureCard {...features[4]} />
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default Features;

const FeatureCard = ({
  title,
  description,
  icon,
  borderColor = "green",
}: {
  title: string;
  description: string;
  icon: any;
  borderColor?: string;
}) => {
  const borderClass = {
    green: "bg-green-500",
    blue: "bg-blue-500",
  }[borderColor];
const {isMobile} = useAppCtx()

  return (
    <div className="w-full max-w-lg mx-auto overflow-hidden transition-transform duration-500 ease-out hover:scale-[1.02]">
      {/* Border Container */}
      <div className="relative w-full  aspect-[3/1] md:aspect-[2/1]">
        {/* Border Layer */}
        <div
          className={`absolute inset-[1px]  ${borderClass}`}
          style={isMobile?{
            clipPath: "polygon(5% 0, 100% 0%, 95% 100%, 0% 100%)",
          }:{
            clipPath: "polygon(15% 0, 100% 0%, 85% 100%, 0% 100%)",
          }}
        />

        {/* Main Content Layer */}
        <div
          className="absolute inset-[2px] bg-[#1A1F20] text-white"
          style={isMobile?{
            clipPath: "polygon(5% 0, 100% 0%, 95% 100%, 0% 100%)",
          }:{
            clipPath: "polygon(15% 0, 100% 0%, 85% 100%, 0% 100%)",
          }}
        >
          {/* Content Wrapper */}
          <div className="w-full h-full flex md:flex-col gap-4 items-center md:justify-center px-8 py-4">
            {/* Icon */}
            <div className="bg-[#89FC961A] rounded-full p-3 mb-4">
              <img src={icon} alt="" />
              {/* <Icon className="w-6 h-6 text-green-500 sm:w-8 sm:h-8" /> */}
            </div>

            {/* Text */}
            <div>

            <h2 className="text-md md:text-2xl  mb-2 tracking-wider md:text-center">
              {title}
            </h2>

            <p className="text-[12px] md:text-xs text-gray-400 md:max-w-[80%] tracking-wide uppercase md:text-center">
              {description}
            </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
