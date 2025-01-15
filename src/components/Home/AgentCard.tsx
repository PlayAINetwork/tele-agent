import { IMAGES } from "@/assets";
import DYNAMICICONS from "@/assets/DynamicIcon";
import { hasSkill } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

function AgentCard({ data }: { data: any }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/agent/${data?.address}`)}
      className="relative
      cursor-pointer
          h-[200px]"

    >
      <div className="  relative w-full h-full object-cover r\ overflow-hidden shadow-lg border-primary  border-[0.5px] transition-all duration-500">
        <div
          className="absolute
                       blackshade w-full h-full
                        
                        
                        "
        >
          <img
            className="w-full h-full object-cover   "
            src={IMAGES.blackshard}
            alt={data?.name}
          />
        </div>
        <img
          src={data?.avatar}
          alt={data?.name}
          className="w-full h-full object-cover shadow-lg border border-primary transition-all duration-500"
        />
      </div>



      <div className="absolute bottom-0 left-0 right-0 p-2 py-2 bg-card border border-primary ">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <img
              className="w-8  h-8 rounded-sm "
              src={data?.avatar}
              alt={data?.name}

            />
            <div className="flex flex-col gap-0 justify-center">
              <p className="text-white text-sm font-semibold uppercase ">
              {data?.name}
              </p>
              {/* <p className="text-white/80 text-xs  font-normal uppercase">
                $ROGUE
              </p> */}
            </div>
          </div>

          <div className="flex">
                        <div>
                       
                          <p className="font-normal text-xs uppercase text-[#D4D4D4]">
                          Skill Traits
                          </p>
                          <div className="flex gap-2">
                              <DYNAMICICONS.socialSkil w={"16px"} color={hasSkill(data, "social")? "#89FC96": "#959595"} />

                              <DYNAMICICONS.terminalSkil w={"16px"} color={hasSkill(data, "terminal")? "#89FC96": "#959595"} />

                              <DYNAMICICONS.audioSkil w={"16px"} color={hasSkill(data, "audio")? "#89FC96": "#959595"}/>
                              <DYNAMICICONS.visualSkil w={"16px"} color={hasSkill(data, "visual")? "#89FC96": "#959595"}/>
                              <DYNAMICICONS.immearsivelSkil w={"16px"} color={hasSkill(data, "immersive")? "#89FC96": "#959595"}/>

                          </div>
                        </div>
                       
                      </div>
        </div>
      </div>
    </div>
  );
}

export default AgentCard;