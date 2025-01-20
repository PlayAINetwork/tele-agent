import DYNAMICICONS from '@/assets/DynamicIcon';
import useGetAgents from '@/hooks/api/agents/useGetAgents';
import { cn, formatBigNumber, hasSkill, processGraphData } from '@/lib/utils';
import { Agent } from '@/types';
import { useEffect, useState } from 'react'
import SimpleAgentLineChart from './graphs/SimpleAgentLineChart';

const Top5Agents = () => {
    const { agents } = useGetAgents({ page: 1,time:"week" })
    const [filterAgents, setFilterAgents] = useState<any>();

const trendColor = (data:any, dataKey:string) => {
    // Return default color if data is invalid or too short
    if (!Array.isArray(data) || data.length < 2) {
      return "#3b82f6";
    }

    // Get the first and last data points to determine overall trend
    const firstPoint = data[0]?.[dataKey];
    const lastPoint = data[data.length - 1]?.[dataKey];

    // Ensure both data points exist
    if (firstPoint === undefined || lastPoint === undefined) {
      return "#3b82f6";
    }

    // Parse values safely
    const start = parseFloat(firstPoint);
    const end = parseFloat(lastPoint);

    // Check if both values are valid numbers
    if (isNaN(start) || isNaN(end)) {
      return "#3b82f6";
    }

    // Determine color based on overall trend
    return end > start ? true : false;
  };

    useEffect(() => {
        const filertdatares = agents?.result?.slice(0, 5)
        setFilterAgents(filertdatares)
        console.log(filertdatares)
    }, [agents]);
    return (
        <div className="grid  grid-cols-5 gap-4  ">



            {
                filterAgents?.map((event: Agent) => (
                    <div
                        className={cn(
                            "w-full h-full flex flex-col  items-center border-[1px]  justify-center relative",
                            trendColor(processGraphData(event?.marketCapGraph),"value") ? "bg-green-800" : "bg-red-900"
                        )}
                    >
                        <div className="w-full h-full absolute">
                            <SimpleAgentLineChart
                                data={processGraphData(event?.marketCapGraph)}
                                dataKey="value"
                                color="#3b82f6"
                            /> </div>
                        <img
                            src={event?.avatar}
                            alt={event?.name}
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className={cn("absolute top-1  left-1 text-white text-[0.9rem]")}>
                            <p className="truncate font-semibold text-lg uppercase font-800">{event?.name}</p>

                            {/* <p className="max-w-[100px] truncate">{"dw"}</p> */}
                            <p className=''>${`${formatBigNumber(event?.marketCap)}`}</p>

                        </div>


                        <div className={cn("absolute bottom-0 px-4 py-2 bg-[#1A1F20]  left-0 w-full text-white text-[0.9rem]")}>
                            <div className="grid grid-cols-5 gap-4  ">
                                <DYNAMICICONS.socialSkil w={"22px"} h={"22px"} color={hasSkill(event, "social") ? "#89FC96" : "#959595"} />

                                <DYNAMICICONS.terminalSkil w={"22px"} h={"22px"} color={hasSkill(event, "terminal") ? "#89FC96" : "#959595"} />

                                <DYNAMICICONS.audioSkil w={"22px"} h={"22px"} color={hasSkill(event, "audio") ? "#89FC96" : "#959595"} />
                                <DYNAMICICONS.visualSkil w={"22px"} h={"22px"} color={hasSkill(event, "visual") ? "#89FC96" : "#959595"} />
                                <DYNAMICICONS.immearsivelSkil w={"22px"} h={"22px"} color={hasSkill(event, "immersive") ? "#89FC96" : "#959595"} />

                            </div>
                        </div>
                    </div>
                ))
            }



        </div>
    )
}

export default Top5Agents
