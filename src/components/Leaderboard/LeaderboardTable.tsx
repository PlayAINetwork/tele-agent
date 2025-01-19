import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBigNumber, hasSkill } from "@/lib/utils";
import {  Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useGetAgents from "@/hooks/api/agents/useGetAgents";
import DYNAMICICONS from "@/assets/DynamicIcon";
import VerifyTwitter from "./VerifyTwitter";
import SimpleAgentLineChart from "./graphs/SimpleAgentLineChart";

// const RenderPageBtns = ({
//   totalPages,
//   page,
//   currentPage,
//   setPage,
// }: {
//   totalPages: number;
//   page: number;
//   currentPage: number;
//   setPage: (pageId: number) => void;
// }) => {
//   return totalPages > 3 ? (
//     <div className="flex items-center gap-1">
//       <Button
//         variant={page === currentPage ? "default" : "ghost"}
//         className="p-[1px] px-3 text-[0.7rem] h-fit"
//         onClick={() => setPage(page)}
//       >
//         {page}
//       </Button>
//       <Button
//         variant={page + 1 === currentPage ? "default" : "ghost"}
//         className="p-[1px] px-3 text-[0.7rem] h-fit"
//         onClick={() => setPage(page + 1)}
//       >
//         {page + 1}
//       </Button>
//       <Button
//         variant={page + 2 === currentPage ? "default" : "ghost"}
//         className="p-[1px] px-3 text-[0.7rem] h-fit"
//         onClick={() => setPage(page + 2)}
//       >
//         {page + 2}
//       </Button>
//       <Button
//         variant={page + 3 === currentPage ? "default" : "ghost"}
//         className="p-[1px] px-3 text-[0.7rem] h-fit"
//         onClick={() => setPage(page + 3)}
//       >
//         {page + 3}
//       </Button>
//     </div>
//   ) : (
//     <div className="flex items-center gap-1">
//       {[...Array(totalPages)].map((_, id) => {
//         return (
//           <Button
//             variant={"ghost"}
//             className="p-[1px] px-3 text-[0.7rem] h-fit"
//             key={id + 1}
//             onClick={() => setPage(id + 1)}
//           >
//             {id + 1}
//           </Button>
//         );
//       })}
//     </div>
//   );
// };
const LeaderboardTable = () => {
  // const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { agents,loadingAgent } = useGetAgents()

  // const { data, isLoading: loadingAgents } = useGetLeadeboardTable({
  //   page: page,
  // });


  return (
    <div className=" w-full overflow-hidden relative">
      <div className=" py-3 text-2xl">
        <p>RANKINGS</p>
      </div>
      <div className="border max-w-full w-full max-h-[400px] overflow-x-auto overflow-y-auto">
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

              first:[&_td]:z-10 
              first:[&_td]:left-0 
              [&_td]:py-3 
              [&_td]:px-5 
              [&_td]:border-b-0
            "
        >
          <TableHeader>
            <TableRow className="text-[#fff] text-sm">
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
              {agents?.result?.map((agent: any) => (
                <TableRow className="text-sm " key={agent?.address}>
                  <TableCell
                    className="sticky min-w-[100px] max-w-[150px] truncate cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (agent?.address)
                        navigate(
                          `/agent/${agent?.address}`,
                          {
                            state: agent,
                          }
                        );
                    }}
                  >
                    <img
                      src={agent?.avatar}
                      alt={agent?.name}
                      className="w-8 h-8 inline-flex mr-1 mb-1"
                    />
                    {agent?.name}
                  </TableCell>
                  <TableCell className="text-center  justify-center items-center flex">
                    <DYNAMICICONS.socialSkil w={"24px"} h={"24px"} color={hasSkill(agent, "social") ? "#89FC96" : "#959595"} />

                  </TableCell>
                  <TableCell
className="text-center"
                  >
                    <div className="w-full justify-center items-center flex ">
                    <DYNAMICICONS.terminalSkil w={"24px"} h={"24px"}  color={hasSkill(agent, "social") ? "#89FC96" : "#959595"} />

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
                  {formatBigNumber(agent?.marketCap)}

                   <div className="w-[60px] h-[35px]">
                          <SimpleAgentLineChart
                            data={agent?.marketCapGraph}
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
                    ${agent?.price}

                  </TableCell>
                  <TableCell className="text-center">
                  <div className="flex justify-around">

                   {formatBigNumber(agent?.holders)}
                   <div className="w-[60px] h-[35px]">
                          <SimpleAgentLineChart
                            data={agent?.holdersGraph}
                            dataKey="value"
                            color="#3b82f6"
                          />
                        </div>
                   </div>

                  </TableCell>
                  <TableCell className="text-center uppercase">
                    {
                      agent?.verified ? <span className="text-[#89FC96]">verified</span> : 
                    <VerifyTwitter data={agent}/>
                      
                      // <span className="text-#959595 cursor-pointer">unverified</span>
                    }

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
      {/* <div className="flex gap-2 items-center justify-center p-2 ">
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
            totalPages={agents.total}
            setPage={setPage}
            page={
              page > 2 && page < agents?.page - 1
                ? page - 1
                : page > 2 &&
                  page <= agents?.total - 1 &&
                  page < agents?.total
                ? page - 2
                : page === agents?.total
                ? page - 3
                : 1
            }
            currentPage={page}
          />
          <Button
            variant={"ghost"}
            className="text-[0.7rem] p-[1px] h-fit gap-0 items-center"
            disabled={page >= agents?.total}
            onClick={() => {
              if (page >= agents?.total) return;
              setPage((prev) => prev + 1);
            }}
          >
            <span className="pl-2">Next</span>
            <ChevronRight className="p-[1px] pb-[2px]" />
          </Button>
        </div> */}
    </div>
  );
};

export default LeaderboardTable;
