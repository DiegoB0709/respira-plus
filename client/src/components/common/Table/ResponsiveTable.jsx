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
      {/* Tabla (solo MD en adelante) */}
      <div className="hidden md:block bg-white shadow-md rounded-xl overflow-hidden">
        <div className="w-full overflow-x-auto max-w-full">
          <table className="w-full table-auto divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-6 py-3 text-center font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        <div className="max-h-[550px] w-full overflow-y-auto overflow-x-auto max-w-full">
          <table className="w-full table-auto divide-y divide-gray-200 text-sm">
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-center py-6 text-gray-500"
                  >
                    Cargando...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="text-center py-6 text-gray-500"
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
          <p className="text-center text-gray-500">Cargando...</p>
        ) : data.length === 0 ? (
          <p className="text-center text-gray-500">
            No se encontraron resultados.
          </p>
        ) : (
          data.map((item, i) => renderCard(item, i))
        )}
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Total encontrados: <strong>{total}</strong>
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="cursor-pointer px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm">
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="cursor-pointer px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="cursor-pointer border rounded-lg px-3 py-2 w-full"
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
