import { useEffect, useState } from "react";
import { useAlerts } from "../../../context/AlertsContext";

function UpdateAlert({ setActiveModal, alertId }) {
  const { updateAlertStatus, errors, fetchAlertById, selectedAlert } =
    useAlerts();
  const [status, setStatus] = useState("activa");
  const [actionTaken, setActionTaken] = useState("");
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
    setActiveModal("alerts");
  };
  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-teal-500 text-center mb-6 flex items-center justify-center gap-2">
        <i className="fas fa-pen-to-square text-teal-400" />
        Actualizar Alerta
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-5 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <i className="fas fa-info-circle text-teal-400 mr-1" />
            Nuevo estado:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm"
          >
            <option value="activa">Activa</option>
            <option value="revisada">Revisada</option>
            <option value="resuelta">Resuelta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <i className="fas fa-tasks text-teal-400 mr-1" />
            Acción tomada:
          </label>
          <input
            type="text"
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            required
            placeholder="Describe la acción tomada"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm"
          />
        </div>

        <div className="pt-4 text-center">
          <button
            type="submit"
            className="cursor-pointer inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 px-6 rounded transition"
          >
            <i className="fas fa-check-circle" />
            Actualizar Alerta
          </button>
        </div>
      </form>

      {errors.length > 0 && (
        <div className="mt-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded-md">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle" />
            Errores:
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
  
  
}

export default UpdateAlert;
