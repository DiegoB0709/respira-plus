function Card({ fields = [] }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 space-y-2 text-sm">
      {fields.map(({ label, value }, i) => (
        <div key={i} className="break-words">
          <span className="font-semibold text-gray-700">{label}:</span>{" "}
          <span className="text-gray-600">{value}</span>
        </div>
      ))}
    </div>
  );
}

export default Card;
