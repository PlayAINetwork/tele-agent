import { useMemo } from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

const SimpleAgentLineChart = ({ data, dataKey, color }: { data: any; dataKey: any; color: string }) => {
  const trendColor = useMemo(() => {
    // Return default color if data is invalid or too short
    if (!Array.isArray(data) || data.length < 2) {
      return color;
    }

    // Get the first and last data points to determine overall trend
    const firstPoint = data[0]?.[dataKey];
    const lastPoint = data[data.length - 1]?.[dataKey];

    // Ensure both data points exist
    if (firstPoint === undefined || lastPoint === undefined) {
      return color;
    }

    // Parse values safely
    const start = parseFloat(firstPoint);
    const end = parseFloat(lastPoint);

    // Check if both values are valid numbers
    if (isNaN(start) || isNaN(end)) {
      return color;
    }

    // Determine color based on overall trend
    return end > start ? '#4ade80' : '#ef4444';
  }, [data, dataKey, color]);

  return (
    <div className="h-full w-full">
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