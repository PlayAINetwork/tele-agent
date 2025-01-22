import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBigNumber, hasSkill, processGraphDataToSeven } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import useGetAgents from "@/hooks/api/agents/useGetAgents";
import DYNAMICICONS from "@/assets/DynamicIcon";
import VerifyTwitter from "./VerifyTwitter";
import SimpleAgentLineChart from "./graphs/SimpleAgentLineChart";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";

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
      {[...Array(totalPages)]?.map((_, id) => {
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
  const [time, setTime] = useState({ type: '7D', value: 'week' });

  const [totalPage, setTotalPage] = useState(1);

  const { agents, loadingAgent } = useGetAgents({
    page: page,
    time: time?.value ?? 'week',
  });


  const agentsData: any = useMemo(() => {
    setTotalPage(agents?.total / 10);
    return agents ? agents : [];
  }, [agents]);
  const timeInterval = [{ type: '1H', value: 'hour' }, { type: '6H', value: '6hour' }, { type: '24H', value: 'day' }, { type: '7D', value: 'week' }, { type: '30D', value: 'month' }]

  const getTimeBaseData = (time: string, data: any) => {

    if (time === 'week') {
      return data?.dataPoints?._7DaysAgo
    } else if (time === 'month') {
      return data?.dataPoints?._30DaysAgo

    } else if (time === 'day') {
      return data?.dataPoints?._24HoursAgo
    } else if (time === 'hour') {
      return data?.dataPoints?._1HourAgo
    } else if (time === '6hour') {
      return data?.dataPoints?._6HoursAgo
    }

  }

  return (
    <div className=" w-full overflow-hidden relative">
      <div className="flex items-center md:justify-start justify-between  gap-6 mb-2">
        <div className=" py-3 text-2xl">
          <p className="leading-[100%] pt-1">RANKINGS</p>
        </div>

        <div className="flex border-[.5px] h-max">
          {
            timeInterval?.map((el, index) => (
              <div key={index} onClick={() => setTime(el)} className={`p-1 px-2 text-sm cursor-pointer border-r-[.5px] ${time.type === el.type ? 'bg-primary text-black' : 'text-white'}`}>
                <p>{el.type}</p>

              </div>
            ))
          }

        </div>
      </div>
      <div className="border-[.5px] max-w-full w-full min-h-[400px] max-h-[680px] overflow-x-auto hideScrollbrar overflow-y-hidden">
        <Table
          containerClassname="w-full
              [&_th]:bg-[#1A1F20] 
              [&_th]:text-[#fff]
              [&_th]:font-medium 
              [&_th]:px-2 
              [&_th]:py-3 


              [&_th]:text-nowrap
              first:[&_th]:sticky 
              first:[&_th]:bg-bg 

              first:[&_th]:left-0 
              first:[&_th]:z-10
              first:[&_td]:sticky 
              first:[&_td]:bg-[#00120A]
               [&_th]:hover:bg-[#1C1C1C]
              

              first:[&_td]:z-10 
              first:[&_td]:left-0 
              [&_td]:py-3 
              [&_td]:px-5 
              [&_td]:border-b-0
            "
        >
          <TableHeader>
            <TableRow className="text-[#fff] text-sm uppercase">
              <TableHead className="text-center">Agent Name</TableHead>
              <TableHead className="text-center">social</TableHead>
              <TableHead className="text-center">terminal</TableHead>
              <TableHead className="text-center">audio</TableHead>
              <TableHead className="text-center">visual</TableHead>
              <TableHead className="text-center">immersive</TableHead>
              <TableHead className="text-center">MARKET CAP</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Holders</TableHead>
              <TableHead className="text-center">verified</TableHead>

            </TableRow>
          </TableHeader>
          {loadingAgent ? (
            <div className="h-full w-full absolute top-0 left-0 z-10 bg-[#00120A] grid place-items-center">
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
              {agentsData?.result?.map((agent: any) => (
                <TableRow className="text-sm  hover:bg-[#1C1C1C]" key={agent?.address}>
                  <TableCell
                    className="sticky  min-w-[100px] max-w-[150px] truncate cursor-pointer "
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   if (agent?.address)
                  //     navigate(
                  //       `/agent/${agent?.address}`,
                  //       {
                  //         state: agent,
                  //       }
                  //     );
                  // }}
                  >
                    <div className="flex ">

                      <img
                        src={agent?.avatar}
                        alt={agent?.name}
                        className="w-9 h-9 inline-flex mr-1 mb-1"
                      />
                      <div className="uppercase">
                        {agent?.name}
                        <p className="text-[#C4C4C4] text-[12px]">
                          @{agent?.twitter}

                        </p>
                      </div>
                    </div>


                  </TableCell>
                  <TableCell className="text-center  justify-center items-center flex">
                    <DYNAMICICONS.socialSkil w={"24px"} h={"24px"} color={hasSkill(agent, "social") ? "#89FC96" : "#959595"} />

                  </TableCell>
                  <TableCell
                    className="text-center"
                  >
                    <div className="w-full justify-center items-center flex ">
                      <DYNAMICICONS.terminalSkil w={"24px"} h={"24px"} color={hasSkill(agent, "social") ? "#89FC96" : "#959595"} />

                    </div>

                  </TableCell>
                  <TableCell className="text-center ">
                    <div className="w-full justify-center items-center flex ">
                      <DYNAMICICONS.audioSkil w={"24px"} h={"24px"} color={hasSkill(agent, "social") ? "#89FC96" : "#959595"} />

                    </div>

                  </TableCell>
                  <TableCell className="text-center ">
                    <div className="w-full justify-center items-center flex ">
                      <DYNAMICICONS.visualSkil w={"24px"} h={"24px"} color={hasSkill(agent, "social") ? "#89FC96" : "#959595"} />

                    </div>
                  </TableCell>
                  <TableCell className="text-center  justify-center items-center flex">
                    <div className="w-full justify-center items-center flex ">
                      <DYNAMICICONS.immearsivelSkil w={"24px"} h={"24px"} color={hasSkill(agent, "social") ? "#89FC96" : "#959595"} />

                    </div>
                  </TableCell>


                  <TableCell className="text-center">
                    <div className="flex justify-around">
                      {formatBigNumber(getTimeBaseData(time?.value, agent)?.tokenMarketCap ??0)}

                      <div className="w-[60px] h-[35px]">
                        <SimpleAgentLineChart
                          data={time.value == "week" || time.value == "month" || time.value == "day" ? processGraphDataToSeven(agent?.marketCapGraph,7) : agent?.marketCapGraph}

                          dataKey="value"
                          color="#3b82f6"
                        />
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell
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
                    </TableCell> */}
                  <TableCell className="text-center">
                    ${getTimeBaseData(time?.value, agent)?.tokenPrice.toFixed(8)??0}

                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-around">

                      {formatBigNumber(getTimeBaseData(time?.value, agent)?.tokenHoldersCount??0)}
                      <div className="w-[60px] h-[35px]">
                        <SimpleAgentLineChart
                          data={time.value == "week" || time.value == "month" || time.value == "day" ? processGraphDataToSeven(agent?.holdersGraph,7) : agent?.holdersGraph}

                          dataKey="value"
                          color="#3b82f6"
                        />
                      </div>
                    </div>

                  </TableCell>
                  <TableCell className="text-center uppercase">
                    {
                      agent?.verified ? <span className="text-[#89FC96]">verified</span> :
                        <VerifyTwitter data={agent} />

                      // <span className="text-#959595 cursor-pointer">unverified</span>
                    }

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
      {
        agents?.result && agents.result.length > 0 && (
          <div className="flex gap-2 items-center justify-center md:justify-end p-2 ">
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
            <RenderPageBtns
              totalPages={totalPage}
              setPage={setPage}
              page={
                page > 2 && page < agents?.page - 1
                  ? page - 1
                  : page > 2 &&
                    page <= totalPage - 1 &&
                    page < totalPage
                    ? page - 2
                    : page === totalPage
                      ? page - 3
                      : 1
              }
              currentPage={page}
            />
            <Button
              variant={"ghost"}
              className="text-[0.7rem] p-[1px] h-fit gap-0 items-center"
              disabled={page >= totalPage}
              onClick={() => {
                if (page >= totalPage) return;
                setPage((prev) => prev + 1);
              }}
            >
              <span className="pl-2">Next</span>
              <ChevronRight className="p-[1px] pb-[2px]" />
            </Button>
          </div>
        )
      }
    </div>
  );
};

export default LeaderboardTable;
