import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useUser } from "../../../context/UserContext";

function RegisterToken() {
  const { user, createRegistrationToken, errors: tokenErrors } = useAuth();
  const { fetchDoctors, doctors } = useUser();

  const isDoctor = user?.role === "doctor";

  const [token, setToken] = useState("");
  const [role, setRole] = useState(isDoctor ? "Paciente" : "Doctor");
  const [selectedDoctor, setSelectedDoctor] = useState(
    isDoctor ? user.id : ""
  );

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleGenerateToken = async () => {
    const payload = role === "Paciente" ? { doctorId: selectedDoctor } : {};
    const newToken = await createRegistrationToken(payload);
    if (newToken) {
      setToken(newToken);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-center text-teal-500 mb-6 flex flex-wrap items-center justify-center gap-2">
        <i className="fas fa-key text-teal-400 text-xl shrink-0"></i>
        <span className="whitespace-normal">Token de Registro</span>
      </h1>

      <label
        htmlFor="role"
        className="block font-medium text-gray-700 mb-1 flex items-center gap-2"
      >
        <i className="fas fa-user-tag text-gray-500"></i>
        Generar token para:
      </label>
      <select
        id="role"
        className={`w-full mb-4 border border-gray-300 rounded px-3 py-2 ${
          isDoctor ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
        }`}
        value={role}
        onChange={(e) => setRole(e.target.value)}
        disabled={isDoctor}
      >
        <option value="Doctor">Doctor</option>
        <option value="Paciente">Paciente</option>
      </select>

      {role === "Paciente" && (
        <>
          <label className=" font-medium text-gray-700 mb-1 flex items-center gap-2">
            <i className="fas fa-user-md text-gray-500"></i>
            Asignar a doctor:
          </label>
          <select
            className={`w-full mb-4 border border-gray-300 rounded px-3 py-2 ${
              isDoctor ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
            }`}
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            disabled={isDoctor}
          >
            <option value="">Seleccione un doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.username || doctor.email}
              </option>
            ))}
          </select>
        </>
      )}

      {tokenErrors &&
        tokenErrors.map((error, i) => (
          <div
            key={i}
            className="text-red-600 text-sm mb-2 flex items-center gap-2"
          >
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        ))}

      <button
        onClick={handleGenerateToken}
        disabled={!!token || (role === "Paciente" && !selectedDoctor)}
        className={`w-full py-2 rounded-xl text-white font-bold transition flex items-center justify-center gap-2 ${
          token || (role === "Paciente" && !selectedDoctor)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-teal-500 cursor-pointer hover:bg-teal-400"
        }`}
      >
        <i className="fas fa-magic"></i>
        Generar Token
      </button>

      {token && (
        <div className="mt-4 text-green-600 font-semibold text-center flex items-center justify-center gap-2">
          <i className="fas fa-check-circle"></i>
          Token generado: {token}
        </div>
      )}
    </div>
  );
  
}

export default RegisterToken;
