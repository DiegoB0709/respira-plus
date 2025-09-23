export default function MetricCard({
  label,
  value,
  icon: Icon,
  color = "bg-teal-500",
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        p-5 rounded-2xl shadow-lg
        ${color} text-white
        transition-all duration-300 ease-in-out
        hover:scale-[1.02] hover:shadow-xl
        dark:bg-neutral-800 dark:text-neutral-50 dark:border dark:border-neutral-600
      `}
    >
      {Icon && (
        <Icon className="w-7 h-7 mb-3 opacity-90 transition-all duration-300 ease-in-out" />
      )}
      <span className="text-sm font-medium tracking-wide text-neutral-100 dark:text-neutral-300 transition-colors duration-300 ease-in-out">
        {label}
      </span>
      <span className="text-3xl font-extrabold leading-tight text-white dark:text-neutral-50 transition-colors duration-300 ease-in-out">
        {value}
      </span>
    </div>
  );
}
