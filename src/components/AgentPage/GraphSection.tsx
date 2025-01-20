import { Agent } from '@/types';
import SimpleAgentLineChart from '../Leaderboard/graphs/SimpleAgentLineChart';
import { formatBigNumber, processGraphData } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const GraphSection = ({ data, isLoading }: { data: Agent, isLoading: Boolean }) => {

  // const datas = [
  //     { name: '1', marketCap: 2, mindshare: 21 },
  //     { name: '2', marketCap: 21, mindshare: 22 },
  //     { name: '3', marketCap: 23, mindshare: 20 },
  //     { name: '4', marketCap: 22, mindshare: 21 },
  //     { name: '5', marketCap: 24, mindshare: 23 },
  //     { name: '6', marketCap: 5, mindshare: 22 },
  //     { name: '7', marketCap: 21, mindshare: 24 },
  //     { name: '8', marketCap: 23, mindshare: 25 },
  //     { name: '9', marketCap: 22, mindshare: 21 },
  //     { name: '10', marketCap: 23, mindshare: 2 }
  //   ];
  return (
    <div className="grid grid-cols-2  ">
      {
        isLoading ?


          <>
            <div className="relative border-[.1px] bottom-[#F1F6F2] w-full h-[100px]">
              <Skeleton className="w-full h-full   rounded-[0px] bg-gray-700  " />
              <div className="absolute bottom-2 p-2 flex flex-col gap-1">
                <Skeleton className="w-[60px] h-4  rounded-[5px]  bg-gray-200 " />
                <Skeleton className="w-[120px] h-4 rounded-[5px]  bg-gray-200 " />

              </div>
            </div>


            <div className="relative border-[.1px] bottom-[#F1F6F2] w-full h-[100px]">
              <Skeleton className="w-full h-full   rounded-[0px] bg-gray-700  " />
              <div className="absolute bottom-2 p-2 flex flex-col gap-1">
                <Skeleton className="w-[60px] h-4  rounded-[5px]  bg-gray-200 " />
                <Skeleton className="w-[120px] h-4 rounded-[5px]  bg-gray-200 " />

              </div>
            </div>
          </>


          :

          <>
            <div className="relative border-[.1px] bottom-[#F1F6F2] p-2 w-full h-[100px]">
              <SimpleAgentLineChart
                data={processGraphData(data?.marketCapGraph,20)}

                dataKey="value"
                color="#3b82f6"
              />
              <div className="absolute bottom-2">
                <div className=" text-xl uppercase font-semibold">{formatBigNumber(data?.marketCap)}</div>
                <div className=" text-xs uppercase font-normal">
                  market cap
                </div>
              </div>
            </div>

            <div className="relative border-[.1px] bottom-[#F1F6F2] p-2 w-full h-[100px]">
              <SimpleAgentLineChart
                data={processGraphData(data?.holdersGraph,10)}
                dataKey="value"
                color="#3b82f6"
              />
              <div className="absolute bottom-2">
                <div className=" text-xl uppercase font-semibold">{data?.holders}</div>
                <div className=" text-xs uppercase font-normal">
                  Holders
                </div>
              </div>
            </div>
            {/* <div className="relative border-[.1px] bottom-[#F1F6F2] p-2 w-full h-[100px]">
      <div className="absolute bottom-2">
        <div className=" text-xl uppercase font-semibold">#23</div>
        <div className=" text-xs uppercase font-normal">
        ranking
        </div>
      </div>
    </div> */}
          </>
      }

    </div>
  )
}

export default GraphSection