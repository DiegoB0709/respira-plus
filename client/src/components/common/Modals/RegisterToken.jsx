import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useUser } from "../../../context/UserContext";

function RegisterToken() {
  const { user, createRegistrationToken, errors: tokenErrors } = useAuth();
  const { fetchDoctors, doctors } = useUser();

  const isDoctor = user?.role === "doctor";

  const [token, setToken] = useState("");
  const [role, setRole] = useState(isDoctor ? "Paciente" : "Doctor");
  const [selectedDoctor, setSelectedDoctor] = useState(isDoctor ? user.id : "");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleGenerateToken = async () => {
    const payload = role === "Paciente" ? { doctorId: selectedDoctor } : {};
    const newToken = await createRegistrationToken(payload);
    if (newToken) {
      setToken(newToken);
      setShowSuccess(true);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setToken("");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-center text-teal-500 mb-6 flex flex-wrap items-center justify-center gap-2">
        <i className="fas fa-key text-teal-400 text-xl shrink-0"></i>
        <span className="whitespace-normal">Token de Registro</span>
      </h1>

      <label
        htmlFor="role"
        className="block font-medium text-gray-700 mb-2 flex items-center gap-2"
      >
        <i className="fas fa-user-tag text-teal-400"></i>
        Generar token para:
      </label>
      <select
        id="role"
        className={`cursor-pointer w-full mb-4 border border-gray-300 rounded-xl px-3 py-2 transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none ${
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
          <label className="block font-medium text-gray-700 mb-2 flex items-center gap-2">
            <i className="fas fa-user-md text-teal-400"></i>
            Asignar a doctor:
          </label>
          <select
            className={`cursor-pointer w-full mb-4 border border-gray-300 rounded-xl px-3 py-2 transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none ${
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
        className={`w-full py-3 rounded-2xl text-white font-bold transition flex items-center justify-center gap-2 shadow-md ${
          token || (role === "Paciente" && !selectedDoctor)
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-teal-500 hover:bg-teal-400 cursor-pointer"
        }`}
      >
        <i className="fas fa-magic"></i>
        Generar Token
      </button>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
                <i className="fas fa-check text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                ¡Token generado correctamente!
              </h3>
              <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 text-center break-all">
                <span className="font-semibold text-gray-800">Token:</span>{" "}
                {token}
              </div>
              <button
                onClick={handleCloseSuccess}
                className="cursor-pointer w-full bg-teal-500 hover:bg-teal-400 text-white py-2 rounded-2xl text-sm font-medium transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterToken;
