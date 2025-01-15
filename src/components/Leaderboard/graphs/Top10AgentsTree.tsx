import React, { useMemo } from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { cn, getHDAgentImageUrl } from "@/lib/utils";
import { TwitterStatsDP } from "@/types";


interface Top10AgentTreeProps {
  data: TwitterStatsDP[];
}

// Custom content for TreeMap cells
const CustomizedContent = (props: any) => {
  const {
    x,
    y,
    width,
    height,
    symbol,
    name,
    profileImageUrl,
    mindshare,
    prev_mindshare,
  } = props;
  return (
    <g>
      <foreignObject x={x} y={y} width={width} height={height}>
        <div
          className={cn(
            "w-full h-full flex flex-col items-center justify-center relative",
            mindshare - prev_mindshare > 0 ? "bg-green-800" : "bg-red-800"
          )}
        >
          <img
            src={getHDAgentImageUrl(profileImageUrl ?? "")}
            alt={symbol}
            className="w-full h-full object-cover opacity-30"
          />
          <div className={cn("absolute top-1  left-1 text-white text-[0.7rem]")}>
          <p className="truncate text-lg uppercase font-800">{name}</p>

            {/* <p className="max-w-[100px] truncate">{symbol}</p> */}
            <p>{`${mindshare?.toFixed(2)}%`}</p>
            <p className={cn("font-semibold")}>{`(${
              mindshare - prev_mindshare > 0 ? "+" : ""
            }${(mindshare - prev_mindshare)?.toFixed(2)})`}</p>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};
const Top10AgentTree: React.FC<Top10AgentTreeProps> = ({ data }) => {
  console.log("data",data)
  const transformedAgentData = useMemo(
    () =>
      data.map((agent) => ({
        mindshare: agent.mindshare.value,

        prev_mindshare: agent.mindshare.previousValue,
        symbol: agent.symbol === "[invalid]" ? agent.projectName : agent.symbol,
        name: agent.projectName,
        profileImageUrl: agent.profileImageUrl,
      })),
    [data]
  );
  return (
    <div className="w-full overflow-hidden grid place-items-center">
      <ResponsiveContainer>
        <Treemap
          data={transformedAgentData}
          dataKey="mindshare"
          aspectRatio={4 / 4}
          stroke="#fff"
          fill="#8884d8"
          isAnimationActive={false}
          content={<CustomizedContent />}
        >
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white/80 p-2 border rounded shadow text-xs">
                    <p className="font-bold">{data?.name}</p>
                    <p>{`Mindshare: ${data.mindshare?.toFixed(2)}%`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default Top10AgentTree;
