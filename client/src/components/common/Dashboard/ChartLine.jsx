import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ChartLine({ data, dataKey }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={data}
        margin={{ top: 12, right: 16, left: 8, bottom: 12 }}
      >
        <CartesianGrid
          strokeDasharray="4 4"
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
          cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1 }}
          contentStyle={{
            backgroundColor: "rgb(23,23,23)",
            border: "1px solid rgb(82,82,82)",
            borderRadius: "0.5rem",
            color: "rgb(250,250,250)",
            padding: "0.5rem 0.75rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          }}
          itemStyle={{ color: "rgb(250,250,250)" }}
          labelStyle={{ color: "rgb(250,250,250)", fontWeight: 600 }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#2563eb"
          strokeWidth={2.5}
          dot={{ r: 4, strokeWidth: 2, fill: "#2563eb", stroke: "white" }}
          activeDot={{ r: 6, strokeWidth: 2, fill: "#2563eb", stroke: "white" }}
          className="transition-all duration-300 ease-in-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
