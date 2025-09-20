function TableRow({ columns = [] }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors duration-300 ease-in-out">
      {columns.map((col, i) => (
        <td
          key={i}
          className="px-6 py-4 text-center align-middle text-gray-700 dark:text-neutral-300 text-sm break-words max-w-[200px] min-w-0 transition-colors duration-300 ease-in-out"
        >
          {col}
        </td>
      ))}
    </tr>
  );
}

export default TableRow;
