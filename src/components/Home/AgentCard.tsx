import React from "react";
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
      <img
        src={data.image}
        alt={data.title}
        className="w-full h-full object-cover shadow-lg border border-primary transition-all duration-500"
      />

      <div className="absolute bottom-0 left-0 right-0 p-3 py-2 bg-card border border-primary ">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <img
              className="w-10  h-10 "
              src="https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              alt=""
            />
            <div className="flex flex-col gap-0">
              <p className="text-white text-md font-semibold capitalize ">
                agent rogue
              </p>
              <p className="text-white/80 text-sm  font-normal line-clamp-2">
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
