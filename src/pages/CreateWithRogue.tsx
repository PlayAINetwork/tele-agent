import { IMAGES } from '@/assets';
import DYNAMICICONS from '@/assets/DynamicIcon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateWithRogue = () => {
  const list = [
    {
      title: "Featured Videos",
      description: "Pick your agent and create videos based on simple prompts.",
      icon: <DYNAMICICONS.robot/>,
      isActive: <DYNAMICICONS.robot color="#010101"/>,
      link:"/create-vedio"
    },
    {
      title: "Create a Podcast",
      description: "Create a room, add topics, invite agents, and host your own personalised podcast instantly. ",
      icon: <DYNAMICICONS.robot/>,
      isActive: <DYNAMICICONS.robot color="#010101"/>,
      commingSoon: true
    },
    {
      title: "Integrate",
      description: "Give your agents a voice with simple prompt, and integrate it across different applications and channels.",
      icon: <DYNAMICICONS.robot/>,
      isActive: <DYNAMICICONS.robot color="#010101"/>,
      commingSoon: true

    },
  ];

  return (
    <div className="flex flex-col justify-center gap-6 relative h-full ">

      <div className="h-full absolute right-4 flex items-center">
        <img src={IMAGES.ROGUE_V} alt="" className={"h-[80%]"}/>
      </div>
      {list.map((item, index) => (
        <Card key={index} {...item} />
      ))}
    </div>
  );
};

export default CreateWithRogue;
const Card = ({
  title,
  icon,
  description,
  isActive,
  link,
  commingSoon = false,
  borderColor = "green",
}: {
  title: string;
  icon: any;
  isActive: any;
  description: string;
  link?: string;
  commingSoon?: boolean;
  borderColor?: string;
}) => {
  const borderClass = {
    green: "bg-green-500",
    blue: "bg-blue-500",
  }[borderColor];

  const [isHover, setHover] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      className="w-full md:max-w-[900px] cursor-pointer mx-auto overflow-hidden group md:px-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => link && !commingSoon ? navigate(link) : null}
    >
      <div className="relative w-full h-[130px] transform transition-transform duration-500 ease-out hover:scale-[1.02]">
        <div
          className={`absolute inset-[1px] ${borderClass} transition-all duration-500`}
          style={{
            clipPath: "polygon(5% 0, 100% 0%, 95% 100%, 0% 100%)",
          }}
        />

        <div
          className={`absolute inset-[2px] transition-all duration-500 ease-out ${
            isHover ? "bg-[#89FC96]" : "bg-[#1A1F20]"
          }`}
          style={{
            clipPath: "polygon(5% 0, 100% 0%, 95% 100%, 0% 100%)",
          }}
        >
          <div className="w-full h-full flex justify-between items-center md:px-14 px-6 py-4">
            <div className="flex items-center gap-4 transition-all duration-500">
              <div 
                className={`transition-all duration-500 ease-out rounded-full p-3 transform ${
                  isHover ? "bg-[#0101011A] scale-110" : "bg-[#89FC961A]"
                }`}
              >
                {isHover ? isActive : icon}
              </div>

              <div className="flex flex-col gap-1 transition-all duration-500">
                <div className="flex items-center gap-2">
                <h2 
                  className={`transition-all duration-500 ease-out ${
                    isHover ? "text-black translate-x-1" : "text-white"
                  } text-xl md:text-2xl font-semibold uppercase tracking-wider max-w-[80%]`}
                >
                  {/* {isHover && commingSoon ? "COMING SOON" : */}
                  { title}
                </h2>

                {isHover && commingSoon ? 
                  <h1
                  className={`transition-all duration-500 ease-out ${
                   isHover ? "text-black translate-x-1" : "text-white"
                 }   uppercase tracking-wider`}
                 >COMING SOON</h1>
                : null}
              
                </div>
                <p 
                  className={`transition-all duration-500 ease-out ${
                    isHover ? "text-[#01010199] translate-x-1" : "text-[#F1F6F299]"
                  } text-xs md:text-md tracking-wide uppercase md:max-w-[85%]`}
                >
                  {description}
                </p>
              </div>
            </div>

            <div 
              className={`rounded-full hidden md:block transition-all duration-500 ease-out transform ${
                isHover ? "translate-x-2 scale-110" : ""
              }`}
            >
              <DYNAMICICONS.BIgArrow color={isHover ? '#000' : '#89FC96'}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};