import { Agent } from '@/types';
import SimpleAgentLineChart from '../Leaderboard/graphs/SimpleAgentLineChart';
import { formatBigNumber } from '@/lib/utils';

const GraphSection = ({data}:{data:Agent}) => {

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
    <div className="relative border-[.1px] bottom-[#F1F6F2] p-2 w-full h-[100px]">
    <SimpleAgentLineChart
        data={data?.marketCapGraph}
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
        data={data?.holdersGraph}
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
  </div>
  )
}

export default GraphSection