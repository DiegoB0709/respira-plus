function TableRow({ columns = [] }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      {columns.map((col, i) => (
        <td
          key={i}
          className="px-6 py-4 text-gray-700 text-sm break-words max-w-[200px] min-w-[120px] whitespace-nowrap"
        >
          {col}
        </td>
      ))}
    </tr>
  );
}

export default TableRow;
