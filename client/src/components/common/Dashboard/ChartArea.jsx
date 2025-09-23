import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ChartArea({ data, dataKey }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-neutral-200 dark:stroke-neutral-700 transition-colors duration-300 ease-in-out"
        />
        <XAxis
          dataKey="name"
          className="text-neutral-800 dark:text-neutral-300 transition-colors duration-300 ease-in-out"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          className="text-neutral-800 dark:text-neutral-300 transition-colors duration-300 ease-in-out"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgb(23,23,23)",
            borderColor: "rgb(82,82,82)",
            color: "rgb(250,250,250)",
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="#14b8a6"
          fill="#5eead4"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
