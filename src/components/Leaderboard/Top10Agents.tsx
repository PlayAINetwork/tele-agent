import { useMemo } from "react";
import Top10AgentTree from "./graphs/Top10AgentsTree";
import { Agents } from "@/types";

const Top10Agents = ({ agents }: { agents: Agents }) => {
  console.log("agent tree", agents);
  const last24HMindshareDPs = useMemo(() => {
    return agents.projects
      ? agents.projects.map((agent) => ({
          ...agent.twitterStats.dataPoints._7DaysAgo,
          ticker: agent.ticker,
          projectName: agent.agentDetails.name,

          profileImageUrl: agent.profileImageUrl,
        }))
      : null;
  }, [agents?.projects]);
  return (
    <div className=" h-full grid overflow-hidden">
      {last24HMindshareDPs && <Top10AgentTree data={last24HMindshareDPs} />}
    </div>
  );
};

export default Top10Agents;
