import { useEffect, useState } from "react";
import { useAlerts } from "../../../context/AlertsContext";

function UpdateAlert({ setActiveModal, alertId }) {
  const { updateAlertStatus, errors, fetchAlertById, selectedAlert } =
    useAlerts();
  const [status, setStatus] = useState("activa");
  const [actionTaken, setActionTaken] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchAlertById(alertId);
  }, [alertId]);

  useEffect(() => {
    if (selectedAlert) {
      setStatus(selectedAlert.status || "activa");
      setActionTaken(selectedAlert.actionTaken || "");
    }
  }, [selectedAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateAlertStatus(alertId, status, actionTaken);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setActiveModal("alerts");
  };

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-teal-500 text-center mb-6 flex items-center justify-center gap-2">
        <i className="fas fa-pen-to-square text-teal-400" />
        Actualizar Alerta
      </h2>

      <form
        className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-6 shadow-md"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <i className="fas fa-info-circle text-teal-400" />
            Nuevo estado
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition"
          >
            <option value="activa">Activa</option>
            <option value="revisada">Revisada</option>
            <option value="resuelta">Resuelta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <i className="fas fa-tasks text-teal-400" />
            Acción tomada
          </label>
          <input
            type="text"
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            required
            placeholder="Describe la acción tomada"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition"
          />
        </div>

        <div className="pt-4 text-center">
          <button
            type="submit"
            className="cursor-pointer inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2.5 px-6 rounded-2xl shadow-md transition-transform duration-200 hover:scale-[1.02]"
          >
            <i className="fas fa-check-circle" />
            Actualizar Alerta
          </button>
        </div>
      </form>

      {errors.length > 0 && (
        <div className="mt-6 bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle" />
            Errores
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
                <i className="fas fa-check text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                ¡Alerta actualizada!
              </h3>
              <p className="text-sm text-gray-500 text-center">
                El estado y la acción se guardaron correctamente.
              </p>
              <button
                onClick={handleCloseSuccess}
                className="cursor-pointer w-full bg-teal-500 hover:bg-teal-400 text-white py-2 rounded-xl text-sm font-medium transition-colors"
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

export default UpdateAlert;
