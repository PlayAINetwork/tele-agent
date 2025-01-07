import LeaderboardTable from "@/components/Leaderboard/LeaderboardTable";
import Top10Agents from "@/components/Leaderboard/Top10Agents";
import TopSimpleList from "@/components/Leaderboard/TopSimpleList";
import { agentData } from "@/DB";
import  { useMemo } from "react";

const LeaderBoard = () => {
  const data: any = agentData;

  const top10_agents = useMemo(() => {
    return data ? data[0]?.result?.data?.json : {};
  }, [data]);

  const projects = useMemo(() => {
    const projectData = agentData[0].result.data.json.projects;

    return projectData.map((project) => {
      const currentPrice = project.onChainStats.dataPoints.Now.tokenPrice.value;
      const previousPrice =
        project.onChainStats.dataPoints._7DaysAgo.tokenPrice.value;
      const percentageChange =
        ((currentPrice - previousPrice) / previousPrice) * 100;

      return {
        name: project.agentDetails.name,
        image: project.profileImageUrl,

        ticker: project.ticker,
        currentPrice,
        previousPrice,
        percentageChange,
      };
    });
  }, []);

  const sortedProjects = useMemo(() => {
    return [...projects].sort(
      (a, b) => b.percentageChange - a.percentageChange
    );
  }, [projects]);

  const topGainers = sortedProjects.slice(0, 8);
  const topLosers = sortedProjects.slice(-8).reverse();

  return (
    <div className="  p-6 h-full py-14 gap-6 overflow-scroll">
      <div className="flex w-full gap-3 ">
        <div className=" flex-[4] border ">
          <Top10Agents agents={top10_agents} />
        </div>
        <div className="flex-[2] h-full">
          <TopSimpleList title={"top gainers"} data={topGainers} gain={true} />
          <TopSimpleList title="new losers" data={topLosers.reverse()} gain={false} />
        </div>
      </div>
      <LeaderboardTable />
    </div>
  );
};

export default LeaderBoard;
