import { useMemo } from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

const SimpleAgentLineChart = ({ data, dataKey, color }:{ data:any; dataKey:any; color:string }) => {
  const trendColor = useMemo(() => {
    // Return default color if data is invalid or too short
    if (!Array.isArray(data) || data.length < 2) {
      return color;
    }

    const lastTwo = data.slice(-2);
    // Ensure both data points exist and have the required dataKey
    if (!lastTwo[0]?.[dataKey] || !lastTwo[1]?.[dataKey]) {
      return color;
    }

    // Parse values safely
    const prev = parseFloat(lastTwo[0][dataKey]);
    const current = parseFloat(lastTwo[1][dataKey]);
    
    // Check if both values are valid numbers
    if (isNaN(prev) || isNaN(current)) {
      return color;
    }

    return current > prev ? '#4ade80' : '#ef4444';
  }, [data, dataKey, color]);
    
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
  );
};

export default SimpleAgentLineChart;