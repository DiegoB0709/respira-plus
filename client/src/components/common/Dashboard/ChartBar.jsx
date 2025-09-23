import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ChartBar({ data, dataKey, horizontal = false }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 12, right: 12, left: 12, bottom: 12 }}
      >
        <CartesianGrid
          strokeDasharray="4 4"
          className="stroke-neutral-200 dark:stroke-neutral-700 transition-colors duration-300 ease-in-out"
        />
        {horizontal ? (
          <YAxis
            dataKey="name"
            type="category"
            className="text-neutral-800 dark:text-neutral-300 transition-colors duration-300 ease-in-out"
            tickLine={false}
            axisLine={false}
            width={80}
          />
        ) : (
          <XAxis
            dataKey="name"
            className="text-neutral-800 dark:text-neutral-300 transition-colors duration-300 ease-in-out"
            tickLine={false}
            axisLine={false}
            height={30}
          />
        )}
        {horizontal ? (
          <XAxis
            type="number"
            className="text-neutral-800 dark:text-neutral-300 transition-colors duration-300 ease-in-out"
            tickLine={false}
            axisLine={false}
          />
        ) : (
          <YAxis
            className="text-neutral-800 dark:text-neutral-300 transition-colors duration-300 ease-in-out"
            tickLine={false}
            axisLine={false}
            width={50}
          />
        )}
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          contentStyle={{
            backgroundColor: "rgb(23,23,23)",
            border: "1px solid rgb(82,82,82)",
            borderRadius: "0.5rem",
            color: "rgb(250,250,250)",
            padding: "0.5rem 0.75rem",
          }}
          itemStyle={{ color: "rgb(250,250,250)" }}
          labelStyle={{ color: "rgb(250,250,250)" }}
        />
        <Bar
          dataKey={dataKey}
          radius={horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}
          className="fill-teal-500 dark:fill-teal-400 hover:opacity-80 transition-all duration-300 ease-in-out"
          barSize={horizontal ? 16 : 32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
