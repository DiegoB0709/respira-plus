import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ChartDonut({ data, colors }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={50}
          paddingAngle={2}
          cornerRadius={8}
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              className="transition-all duration-300 ease-in-out hover:opacity-85"
            />
          ))}
        </Pie>
        <Tooltip
          cursor={{ fill: "rgba(0,0,0,0.05)" }}
          contentStyle={{
            backgroundColor: "rgb(23,23,23)",
            border: "1px solid rgb(82,82,82)",
            borderRadius: "0.75rem",
            color: "rgb(250,250,250)",
            padding: "0.75rem 1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          itemStyle={{ color: "rgb(250,250,250)", fontWeight: 500 }}
          labelStyle={{ color: "rgb(250,250,250)", fontWeight: 600 }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={10}
          formatter={(value) => {
            const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
            return (
              <span className="text-neutral-800 dark:text-neutral-300 transition-colors duration-300 ease-in-out text-sm">
                {capitalized}
              </span>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
