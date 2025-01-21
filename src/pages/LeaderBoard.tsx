import LeaderboardTable from "@/components/Leaderboard/LeaderboardTable";
import Top5Agents from "@/components/Leaderboard/Top5Agents";

const LeaderBoard = () => {





  return (
    <div className="p-4 md:p-6 h-full py-14 gap-12 overflow-y-scroll">
      <div className="mb-10">
        <div className=" py-3 text-2xl uppercase">
          <p>top agents</p>
        </div>
        <Top5Agents />

      </div>

      <LeaderboardTable />
    </div>
  );
};

export default LeaderBoard;
