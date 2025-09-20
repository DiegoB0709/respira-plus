function ResponsiveTable({
  headers = [],
  data = [],
  loading = false,
  total = 0,
  page = 1,
  limit = 10,
  onPageChange = () => {},
  onLimitChange = () => {},
  renderRow = () => null,
  renderCard = () => null,
}) {
  const totalPages = limit === 0 ? 1 : Math.ceil(total / limit);

  return (
    <>
      <div className="hidden md:block bg-white dark:bg-neutral-900 shadow-md rounded-xl overflow-hidden transition-colors duration-300 ease-in-out">
        <div className="w-full overflow-x-auto max-w-full">
          <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-neutral-700 text-sm transition-colors duration-300 ease-in-out">
            <thead className="bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-50 uppercase text-xs tracking-wider transition-colors duration-300 ease-in-out">
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-center font-semibold break-words"
                    style={{ width: `${100 / headers.length}%` }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        <div className="max-h-[550px] w-full overflow-y-auto overflow-x-auto max-w-full">
          <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-neutral-700 text-sm transition-colors duration-300 ease-in-out">
            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700 transition-colors duration-300 ease-in-out">
              {loading ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-center py-6 text-gray-500 dark:text-neutral-400 transition-colors duration-300 ease-in-out"
                  >
                    Cargando...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-center py-6 text-gray-500 dark:text-neutral-400 transition-colors duration-300 ease-in-out"
                  >
                    No se encontraron resultados.
                  </td>
                </tr>
              ) : (
                data.map((item, i) => renderRow(item, i))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="block md:hidden space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-neutral-400 transition-colors duration-300 ease-in-out">
            Cargando...
          </p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-neutral-400 transition-colors duration-300 ease-in-out">
            No se encontraron resultados.
          </p>
        ) : (
          data.map((item, i) => renderCard(item, i))
        )}
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-neutral-300 transition-colors duration-300 ease-in-out">
          Total encontrados: <strong>{total}</strong>
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="cursor-pointer px-3 py-1 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 disabled:opacity-50 transition-colors duration-300 ease-in-out"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="cursor-pointer px-3 py-1 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 disabled:opacity-50 transition-colors duration-300 ease-in-out"
          >
            Siguiente
          </button>
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="w-full cursor-pointer border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl p-2.5 text-sm text-gray-700 dark:text-neutral-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300 ease-in-out outline-none"
          >
            <option value={10}>10 por página</option>
            <option value={15}>15 por página</option>
            <option value={20}>20 por página</option>
            <option value={0}>Todos</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default ResponsiveTable;
