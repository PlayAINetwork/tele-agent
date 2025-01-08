import  { useMemo } from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

const SimpleAgentLineChart = ({ data, dataKey, color }:{ data:any; dataKey:any; color:string }) => {
    const trendColor = useMemo(() => {
        if (data.length < 2) return color;
        const lastTwo = data.slice(-2);
        return lastTwo[1][dataKey] > lastTwo[0][dataKey] ? '#4ade80' : '#ef4444';
      }, [data, dataKey]);
    
  return (
    <div className="h-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={trendColor}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
  )
}

export default SimpleAgentLineChart