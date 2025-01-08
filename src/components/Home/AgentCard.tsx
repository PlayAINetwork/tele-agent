import { IMAGES } from "@/assets";
import { useNavigate } from "react-router-dom";

function AgentCard({ data }: { data: any }) {
    const navigate = useNavigate()
  return (
    <div
    onClick={()=>navigate("/agent/addid")}
      className="relative
      cursor-pointer
          h-[200px]"
          
    >
       <div className="  relative w-full h-full object-cover r\ overflow-hidden shadow-lg border-primary  border-[0.5px] transition-all duration-500">
                        <div
                          className="absolute
                       blackshade
                        
                        
                        "
                        >
                          <img
                            className="w-full h-full object-cover   "
                            src={IMAGES.blackshard}
                            alt={data.title}
                          />
                        </div>
                        <img
        src={data.image}
        alt={data.title}
        className="w-full h-full object-cover shadow-lg border border-primary transition-all duration-500"
      />
                      </div>
      
     

      <div className="absolute bottom-0 left-0 right-0 p-2 py-2 bg-card border border-primary ">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <img
              className="w-8  h-8 rounded-sm "
              src={data.image}
              alt={data.title}

            />
            <div className="flex flex-col gap-0">
              <p className="text-white text-sm font-semibold uppercase ">
                agent rogue
              </p>
              <p className="text-white/80 text-xs  font-normal uppercase">
                $ROGUE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentCard;
