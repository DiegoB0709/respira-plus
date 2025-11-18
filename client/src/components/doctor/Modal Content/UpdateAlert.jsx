import { useEffect, useState } from "react";
import { useAlerts } from "../../../context/AlertsContext";
import Input from "../../common/Imput/Input";
import Button from "../../common/Buttons/Button";
import Modal from "../../common/Modals/Modal";
import Toast from "@/components/common/Toast/Toast";

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
    <>
      {errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}
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

        {showSuccess && (
          <Modal
            type="success"
            title="¡Alerta actualizada!"
            message="El estado y la acción se guardaron correctamente."
            onSubmit={handleCloseSuccess}
          />
        )}
      </div>
    </>
  );
}

export default UpdateAlert;
