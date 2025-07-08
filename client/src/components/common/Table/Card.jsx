function Card({ fields = [] }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 space-y-3 text-sm border border-teal-100">
      {fields.map(({ label, value }, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 break-words"
        >
          <span className="font-semibold text-gray-700">{label}:</span>
          <div className="text-gray-600 sm:text-right">
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
