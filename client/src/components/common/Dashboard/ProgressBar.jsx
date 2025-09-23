export default function ProgressBar({ value, max, color = "bg-teal-500" }) {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-4 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden transition-colors duration-300 ease-in-out shadow-inner">
      <div
        className={`${color} h-4 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
