import { useState, useEffect, useMemo } from "react";
import { useUser } from "../../context/UserContext";
import TableRow from "../common/Table/TableRow";
import Card from "../common/Table/Card";
import ModalContainer from "../common/Modals/ModalContainer";
import ResponsiveTable from "../common/Table/ResponsiveTable";
import RegisterToken from "../common/Modals/RegisterToken";

function Usuarios() {
  const { fetchUsers, users, totalUsers, loading, errors } = useUser();

  const [onlyWithToken, setOnlyWithToken] = useState(false);
  const [openGenerator, setOpenGenerator] = useState(false);

  const [filters, setFilters] = useState({
    role: "",
    username: "",
    email: "",
    phone: "",
    page: 1,
    limit: 10,
  });

  const headers = useMemo(() => {
    return onlyWithToken
      ? ["Nombre", "Rol", "Telefono", "Email", "Doctor", "Token"]
      : ["Nombre", "Rol", "Telefono", "Email", "Doctor"];
  }, [onlyWithToken]);

  const roleLabels = {
    admin: "Administrador",
    doctor: "Doctor",
    patient: "Paciente",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === "limit" || name === "page" ? parseInt(value) : value,
    }));
  };

  useEffect(() => {
    if (onlyWithToken) {
      setFilters((prev) => ({
        ...prev,
        username: "",
        email: "",
        phone: "",
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        username: "",
        email: "",
        page: 1,
        phone: "",
      }));
    }
  }, [onlyWithToken]);

  useEffect(() => {
    const extraFilters = onlyWithToken
      ? {
          role: filters.role,
          page: filters.page,
          limit: filters.limit,
          hasToken: true,
        }
      : { ...filters };
    fetchUsers(extraFilters);
  }, [filters, onlyWithToken]);

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto overflow-x-hidden">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-teal-500">
          Usuarios
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <select
            name="role"
            value={filters.role}
            onChange={handleChange}
            className="cursor-pointer border rounded-lg px-3 py-2 w-full disabled:bg-gray-100"
          >
            <option value="">Todos</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Paciente</option>
          </select>

          <input
            type="text"
            name="username"
            placeholder="Nombre"
            value={filters.username}
            onChange={handleChange}
            disabled={onlyWithToken}
            className="border rounded-lg px-3 py-2 w-full disabled:bg-gray-100"
          />

          <input
            type="text"
            name="email"
            placeholder="Email"
            value={filters.email}
            onChange={handleChange}
            disabled={onlyWithToken}
            className="border rounded-lg px-3 py-2 w-full disabled:bg-gray-100"
          />

          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            value={filters.phone}
            onChange={handleChange}
            disabled={onlyWithToken}
            className="border rounded-lg px-3 py-2 w-full disabled:bg-gray-100"
          />
        </div>

        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <label
            htmlFor="onlyWithToken"
            className="flex items-center cursor-pointer select-none"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="onlyWithToken"
                checked={onlyWithToken}
                onChange={() => {
                  setOnlyWithToken((prev) => !prev);
                  setFilters((prev) => ({ ...prev, page: 1 }));
                }}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner peer-checked:bg-teal-500 transition-colors duration-300"></div>
              <div className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 peer-checked:translate-x-full"></div>
            </div>
            <span className="ml-3 text-sm text-gray-700 font-medium">
              Mostrar tokens de registro
            </span>
          </label>

          <button
            onClick={() => setOpenGenerator(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm transition font-bold cursor-pointer "
          >
            Generar token de registro
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Errores:</h4>
            <ul className="list-disc list-inside text-sm">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <ResponsiveTable
          headers={headers}
          data={users}
          loading={loading}
          total={totalUsers}
          page={filters.page}
          limit={filters.limit}
          onPageChange={(newPage) =>
            setFilters((prev) => ({ ...prev, page: newPage }))
          }
          onLimitChange={(newLimit) =>
            setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }))
          }
          renderRow={(user) => (
            <TableRow
              key={user._id}
              columns={[
                user.username ?? "No definido / Por definir",
                roleLabels[user.role] ?? user.role,
                user.phone ?? "No definido / Por definir",
                user.email ?? "No definido / Por definir",
                user.doctor?.username ?? "-",
                ...(user.registrationToken ? [user.registrationToken] : []),
              ]}
            />
          )}
          renderCard={(user) => (
            <Card
              key={user._id}
              fields={[
                {
                  label: "Nombre",
                  value: user.username ?? "No definido / Por definir",
                },
                { label: "Rol", value: roleLabels[user.role] ?? user.role },
                {
                  label: "Telefono",
                  value: user.phone ?? "No definido / Por definir",
                },
                {
                  label: "Email",
                  value: user.email ?? "No definido / Por definir",
                },
                {
                  label: "Doctor",
                  value: user.doctor?.username ?? "-",
                },
                {
                  label: "Token",
                  value: user.registrationToken ?? "Token expirado o utilizado",
                },
              ]}
            />
          )}
        />
      </div>

      {openGenerator && (
        <ModalContainer onClose={() => setOpenGenerator(false)}>
          <RegisterToken />
        </ModalContainer>
      )}
    </>
  );
}

export default Usuarios;
