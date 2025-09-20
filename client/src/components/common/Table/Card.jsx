function Card({ fields = [] }) {
  return (
    <div className="bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-4 space-y-3 text-sm border border-gray-100 dark:border-neutral-600 transition-colors duration-300 ease-in-out">
      {fields.map(({ label, value }, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 break-words transition-all duration-300 ease-in-out"
        >
          <span className="font-semibold text-gray-700 dark:bg-gradient-to-r dark:from-teal-400 dark:to-cyan-500 dark:bg-clip-text dark:text-transparent transition-colors duration-300 ease-in-out">
            {label}:
          </span>
          <div className="text-gray-600 dark:text-neutral-300 sm:text-right transition-all duration-300 ease-in-out">
            {typeof value === "string" || typeof value === "number"
              ? value
              : value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Card;
