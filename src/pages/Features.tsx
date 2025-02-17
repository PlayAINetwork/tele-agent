import { ICONS } from "@/assets";


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
      description: "RETAINS CONVERSATIONS FOR MORE NATURAL DIALOG",
      icon: ICONS.icon_tag,
    },
    {
      title: "UNIQUE VOICE CREATION",
      description: "GENERATE UNIQUE VOICE WITH VARIED EMOTIONS AND TONES",
      icon: ICONS.icon_microphone,
    },
    {
      title: "MULTILINGUAL SUPPORT",
      description: "SPEAK WITH USERS IN ANY LANGUAGE EASILY",
      icon: ICONS.icon_translate,
    //   borderColor: "blue",
    },
    {
      title: "SOCIAL MEDIA INTEGRATION",
      description: "ADAPTS AND RESPONDS TO SOCIAL MEDIA CONVERSATIONS",
      icon: ICONS.icon_clock,
    },
  ];
  return (
    <div className="flex flex-col  gap-16 justify-center items-center h-full py-10">
      <div
        className="bg-primary w-[570px] font-semibold py-2 flex justify-center items-center text-black
        "
      >
        <p>{">> Main Pillars of ROGUE <<"}</p>
      </div>
      <div className="w-full h-full flex flex-col  gap-[230px]">
        <div className="flex justify-between mb-4  ">
          <div className="w-[100%]  relative">
            <div className="absolute w-full left-16 ">
              <FeatureCard {...features[0]} />
            </div>
          </div>

          <div className="w-[100%]  relative">
            <div className="absolute w-full left-4 ">
              <FeatureCard {...features[1]} />
            </div>
          </div>

          <div className="w-[100%]  relative">
            <div className="absolute w-full right-8 ">
              <FeatureCard {...features[2]} />
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <div className="w-1/3  relative">
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
  return (
    <div className="w-full max-w-lg mx-auto overflow-hidden">
      {/* Border Container */}
      <div className="relative w-full  aspect-[2/1]">
        {/* Border Layer */}
        <div
          className={`absolute inset-[1px]  ${borderClass}`}
          style={{
            clipPath: "polygon(15% 0, 100% 0%, 85% 100%, 0% 100%)",
          }}
        />

        {/* Main Content Layer */}
        <div
          className="absolute inset-[2px] bg-[#1A1F20] text-white"
          style={{
            clipPath: "polygon(15% 0, 100% 0%, 85% 100%, 0% 100%)",
          }}
        >
          {/* Content Wrapper */}
          <div className="w-full h-full flex flex-col items-center justify-center px-8 py-4">
            {/* Icon */}
            <div className="bg-[#89FC961A] rounded-full p-3 mb-4">
              <img src={icon} alt="" />
              {/* <Icon className="w-6 h-6 text-green-500 sm:w-8 sm:h-8" /> */}
            </div>

            {/* Text */}
            <h2 className="text-lg sm:text-2xl  mb-2 tracking-wider text-center">
              {title}
            </h2>

            <p className="text-xs sm:text-xs text-gray-400 max-w-[80%] tracking-wide uppercase text-center">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
