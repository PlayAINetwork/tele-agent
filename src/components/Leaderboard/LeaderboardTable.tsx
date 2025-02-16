import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { calculatePercentageChange, cn, formatBigNumber } from "@/lib/utils";
//   import { useGetLeadeboardTable } from "@/hooks/api/leaderboard/useGetLeadeboardTable";
  import { useMemo, useState } from "react";
//   import Brand from "@/components/common/Brand";
  import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
  import { Button } from "@/components/ui/button";
//   import { Agents } from "./types";
  import { useNavigate } from "react-router-dom";
import { agentData } from "@/DB";
  
  const RenderPageBtns = ({
    totalPages,
    page,
    currentPage,
    setPage,
  }: {
    totalPages: number;
    page: number;
    currentPage: number;
    setPage: (pageId: number) => void;
  }) => {
    return totalPages > 3 ? (
      <div className="flex items-center gap-1">
        <Button
          variant={page === currentPage ? "default" : "ghost"}
          className="p-[1px] px-3 text-[0.7rem] h-fit"
          onClick={() => setPage(page)}
        >
          {page}
        </Button>
        <Button
          variant={page + 1 === currentPage ? "default" : "ghost"}
          className="p-[1px] px-3 text-[0.7rem] h-fit"
          onClick={() => setPage(page + 1)}
        >
          {page + 1}
        </Button>
        <Button
          variant={page + 2 === currentPage ? "default" : "ghost"}
          className="p-[1px] px-3 text-[0.7rem] h-fit"
          onClick={() => setPage(page + 2)}
        >
          {page + 2}
        </Button>
        <Button
          variant={page + 3 === currentPage ? "default" : "ghost"}
          className="p-[1px] px-3 text-[0.7rem] h-fit"
          onClick={() => setPage(page + 3)}
        >
          {page + 3}
        </Button>
      </div>
    ) : (
      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, id) => {
          return (
            <Button
              variant={"ghost"}
              className="p-[1px] px-3 text-[0.7rem] h-fit"
              key={id + 1}
              onClick={() => setPage(id + 1)}
            >
              {id + 1}
            </Button>
          );
        })}
      </div>
    );
  };
  const LeaderboardTable = () => {
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    // const { data, isLoading: loadingAgents } = useGetLeadeboardTable({
    //   page: page,
    // });
  const loadingAgents = false
    const agents: any = useMemo(() => {
      return agentData ? agentData[0]?.result?.data?.json : {};
    }, [agentData]);
  
    return (
      <div className=" w-full overflow-hidden relative">
        <div className=" py-3 text-2xl">
          <p>RANKINGS</p>
        </div>
        <div className="border max-w-full w-full h-[400px] overflow-x-auto overflow-y-auto">
          <Table
            containerClassname="w-full
              [&_th]:bg-[#1A1F20] 
              [&_th]:text-[#fff]
              [&_th]:font-medium 
              [&_th]:px-2 
              [&_th]:py-3 

              [&_th]:text-nowrap
              first:[&_th]:sticky 
              first:[&_th]:left-0 
              first:[&_th]:z-10
              first:[&_td]:sticky 
              first:[&_td]:z-10 
              first:[&_td]:left-0 
              [&_td]:py-3 
              [&_td]:px-2 
              [&_td]:border-b-0
            "
          >
            <TableHeader>
              <TableRow className="text-[#fff] text-sm">
                <TableHead className="text-center">Agent Name</TableHead>
                <TableHead className="text-center">Mindshare</TableHead>
                <TableHead className="text-center">Δ7D</TableHead>
                <TableHead className="text-center">Top Tweets</TableHead>
                <TableHead className="text-center">Avg Impressions</TableHead>
                <TableHead className="text-center">Avg Eng.</TableHead>
                <TableHead className="text-center">MARKET CAP</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Holders</TableHead>
                <TableHead className="text-center">Δ7D</TableHead>
                <TableHead className="text-center">Smart Eng.</TableHead>
                <TableHead className="text-center">Followers</TableHead>
                <TableHead className="text-center">Smart Followers</TableHead>
              </TableRow>
            </TableHeader>
            {loadingAgents ? (
              <div className="h-full w-full absolute top-0 left-0 z-10 bg-card grid place-items-center">
                <div className="grid place-items-center gap-2">
                  {/* <Brand className="text-2xl" /> */}
                  <div className="flex items-center justify-center gap-2 border p-2 px-4 bg-primary text-primary-foreground rounded-xl ">
                    <Loader2 className="animate-spin w-5 h-5" />
                    <p>Loading Agents . . .</p>
                  </div>
                </div>
              </div>
            ) : (
              <TableBody>
                {agents?.projects?.map((agent:any) => (
                  <TableRow className="text-sm " key={agent.agentDetails.name}>
                    <TableCell
                      className="sticky min-w-[100px] max-w-[150px] truncate cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (agent.agentDetails.slug)
                          navigate(
                            `/rogueagent/agent/${agent.agentDetails.slug}`,
                            {
                              state: agent,
                            }
                          );
                      }}
                    >
                      <img
                        src={agent.profileImageUrl}
                        alt={agent.agentDetails.name}
                        className="w-8 h-8 inline-flex mr-1 mb-1"
                      />
                      {agent.ticker}
                    </TableCell>
                    <TableCell className="text-center ">
                      {`${agent.twitterStats.dataPoints._7DaysAgo.mindshare.value.toFixed(
                        2
                      )}%`}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-center",
                        agent.twitterStats.dataPoints._7DaysAgo.mindshare.value -
                          agent.twitterStats.dataPoints._7DaysAgo.mindshare
                            .previousValue >
                          0
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {`${
                        agent.twitterStats.dataPoints._7DaysAgo.mindshare.value -
                          agent.twitterStats.dataPoints._7DaysAgo.mindshare
                            .previousValue >
                        0
                          ? "+"
                          : ""
                      }${(
                        agent.twitterStats.dataPoints._7DaysAgo.mindshare.value -
                        agent.twitterStats.dataPoints._7DaysAgo.mindshare
                          .previousValue
                      ).toFixed(2)}`}
                    </TableCell>
                    <TableCell className="text-center flex items-center justify-center">
                      {agent?.twitterStats?.dataPoints?._7DaysAgo?.bestTweets
                        ?.length
                        ? agent?.twitterStats?.dataPoints?._7DaysAgo?.bestTweets?.map(
                            (tweet:any) => (
                              <a
                                href={tweet.item1}
                                target="_blank"
                                key={tweet.item1}
                              >
                                <img
                                  src={tweet.item2}
                                  alt={tweet.item1}
                                  className="w-4 h-4 rounded-sm"
                                />
                              </a>
                            )
                          )
                        : "No Tweets"}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatBigNumber(
                        agent.twitterStats.dataPoints._7DaysAgo.impressionsCount
                          .average
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatBigNumber(
                        agent.twitterStats.dataPoints._7DaysAgo.engagementsCount
                          .average
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {`$${formatBigNumber(
                        agent.onChainStats.dataPoints.Now.tokenMarketCap.value
                      )}`}
                    </TableCell>
                    <TableCell className="text-center">
                      {`$${formatBigNumber(
                        agent.onChainStats.dataPoints.Now.tokenPrice.value
                      )}`}
                    </TableCell>
                    <TableCell className="text-center">
                      {" "}
                      {`${formatBigNumber(
                        agent.onChainStats.dataPoints.Now.tokenHoldersCount.value
                      )}`}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-center",
                        calculatePercentageChange(
                          agent.onChainStats.dataPoints._7DaysAgo
                            .tokenHoldersCount.value,
                          agent.onChainStats.dataPoints.Now.tokenHoldersCount
                            .value
                        ).value > 0
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {`${formatBigNumber(
                        calculatePercentageChange(
                          agent.onChainStats.dataPoints._7DaysAgo
                            .tokenHoldersCount.value,
                          agent.onChainStats.dataPoints.Now.tokenHoldersCount
                            .value
                        ).value
                      )} %`}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatBigNumber(
                        agent.twitterStats.dataPoints._7DaysAgo
                          .smartEngagementPoints.value
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {agent.twitterStats.dataPoints._7DaysAgo.followersCount.value.toLocaleString(
                        "en-US"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {agent.twitterStats.dataPoints._7DaysAgo.smartFollowersCount.value.toLocaleString(
                        "en-US"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
        <div className="flex gap-2 items-center justify-center p-2 ">
          <Button
            variant={"ghost"}
            className="text-[0.7rem] p-[1px]  h-fit gap-0 items-center"
            disabled={page === 1}
            onClick={() => {
              if (page === 1) return;
              setPage((prev) => prev - 1);
            }}
          >
            <ChevronLeft className="p-[1px] pb-[2px]" />
            <span className="pr-2">Previous</span>
          </Button>
          {/* <p className="text-xs font-semibold">{`${page} / ${agents.totalPages}`}</p> */}
          <RenderPageBtns
            totalPages={agents.totalPages}
            setPage={setPage}
            page={
              page > 2 && page < agents?.totalPages - 1
                ? page - 1
                : page > 2 &&
                  page <= agents?.totalPages - 1 &&
                  page < agents?.totalPages
                ? page - 2
                : page === agents?.totalPages
                ? page - 3
                : 1
            }
            currentPage={page}
          />
          <Button
            variant={"ghost"}
            className="text-[0.7rem] p-[1px] h-fit gap-0 items-center"
            disabled={page >= agents?.totalPages}
            onClick={() => {
              if (page >= agents?.totalPages) return;
              setPage((prev) => prev + 1);
            }}
          >
            <span className="pl-2">Next</span>
            <ChevronRight className="p-[1px] pb-[2px]" />
          </Button>
        </div>
      </div>
    );
  };
  
  export default LeaderboardTable;
  