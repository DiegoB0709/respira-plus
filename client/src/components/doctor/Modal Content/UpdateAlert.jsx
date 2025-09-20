import { useEffect, useState } from "react";
import { useAlerts } from "../../../context/AlertsContext";
import Input from "../../common/Imput/Input";
import Button from "../../common/Buttons/Button";
import Modal from "../../common/Modals/Modal";

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
    <div className="p-4 sm:p-6 max-w-lg mx-auto transition-colors duration-300 ease-in-out">
      <form
        className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-600 rounded-2xl p-5 sm:p-6 space-y-6 shadow-md transition-colors duration-300 ease-in-out"
        onSubmit={handleSubmit}
      >
        <Input
          type="select"
          name="status"
          label="Nuevo estado"
          icon="fa-info-circle"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "activa", label: "Activa" },
            { value: "revisada", label: "Revisada" },
            { value: "resuelta", label: "Resuelta" },
          ]}
        />

        <Input
          type="text"
          name="actionTaken"
          label="Acción tomada"
          icon="fa-tasks"
          value={actionTaken}
          onChange={(e) => setActionTaken(e.target.value)}
          required
          placeholder="Describe la acción tomada"
        />

        <div className="pt-4 text-center">
          <Button
            type="bg1"
            icon="fa-check-circle"
            label="Actualizar Alerta"
            submit={true}
            full={true}
            classes="px-6 py-2.5"
          />
        </div>
      </form>

      {errors.length > 0 && (
        <div className="mt-6 bg-red-50 dark:bg-neutral-800 border border-red-300 dark:border-neutral-700 text-red-700 dark:text-red-400 p-4 rounded-xl shadow-sm transition-colors duration-300 ease-in-out">
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
        <Modal
          type="success"
          title="¡Alerta actualizada!"
          message="El estado y la acción se guardaron correctamente."
          onSubmit={handleCloseSuccess}
        />
      )}
    </div>
  );
}

export default UpdateAlert;
