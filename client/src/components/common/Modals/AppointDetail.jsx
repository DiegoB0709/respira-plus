import { useState } from "react";
import { useAppointments } from "../../../context/AppointmentContext";
import { useAuth } from "../../../context/AuthContext";
import Modal from "../Modals/Modal";
import Button from "../Buttons/Button";

function AppointDetail({
  selectedAppointment,
  setActiveModal,
  onAppointmentDeleted,
}) {
  const { deleteAppointment, errors } = useAppointments();
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();

  const handleDelete = async () => {
    await deleteAppointment(selectedAppointment._id);
    if (onAppointmentDeleted) onAppointmentDeleted();
    setShowConfirm(false);
    setActiveModal(null);
  };

  const status = selectedAppointment.status?.toLowerCase();
  const isPatient = user.role === "patient";
  const isDoctor = user.role === "doctor";

  const canDelete =
    status === "pendiente" ||
    status === "confirmada" ||
    status === "solicitada";

  const canReprogram = isDoctor && status === "confirmada";
  const canUpdateStatus =
    (isPatient && status === "pendiente") ||
    (isDoctor &&
      status !== "pendiente" &&
      status !== "cancelada" &&
      status !== "no asistió" &&
      status !== "asistió");

  const buttons = [
    {
      key: "history",
      show: true,
      onClick: () => setActiveModal("historyAppoint"),
      label: "Historial",
      icon: "fa-history",
      type: "bg6",
    },
    {
      key: "reprogram",
      show: canReprogram,
      onClick: () => setActiveModal("editAppointment"),
      label: "Reprogramar",
      icon: "fa-sync-alt",
      type: "bg2",
    },
    {
      key: "updateStatus",
      show: canUpdateStatus,
      onClick: () => setActiveModal("updateAppointStatus"),
      label: "Actualizar Estado",
      icon: "fa-clipboard-check",
      type: "bg3",
    },
    {
      key: "cancel",
      show: canDelete,
      onClick: () => setShowConfirm(true),
      label: "Cancelar Cita",
      icon: "fa-ban",
      type: "alert",
    },
  ].filter((b) => b.show);

  const renderButtons = () => {
    if (buttons.length === 1) {
      return (
        <div className="grid grid-cols-1 gap-3">
          <Button {...buttons[0]} full />
        </div>
      );
    }

    if (buttons.length === 2) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {buttons.map((btn) => (
            <Button key={btn.key} {...btn} full={false} />
          ))}
        </div>
      );
    }

    if (buttons.length === 3) {
      return (
        <div className="grid grid-cols-1 gap-3">
          <Button
            {...buttons.find((b) => b.key === "history")}
            full
            classes="!py-2"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {buttons
              .filter((b) => b.key !== "history")
              .map((btn) => (
                <Button key={btn.key} {...btn} full={false} />
              ))}
          </div>
        </div>
      );
    }

    if (buttons.length === 4) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {buttons.map((btn) => (
            <Button key={btn.key} {...btn} full={false} />
          ))}
        </div>
      );
    }

    return null;
  };


  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-neutral-900 rounded-2xl space-y-6 transition-colors duration-300 ease-in-out">
      <div className="text-sm text-gray-800 dark:text-neutral-50 space-y-3 transition-colors duration-300 ease-in-out">
        <p className="flex items-start gap-2">
          <span className="font-semibold bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent flex items-center gap-1.5">
            <i className="fas fa-user bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent"></i>{" "}
            Paciente:
          </span>
          {selectedAppointment.patient?.username}
        </p>
        <p className="flex items-start gap-2">
          <span className="font-semibold bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent flex items-center gap-1.5">
            <i className="fas fa-pencil-alt bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent"></i>{" "}
            Motivo:
          </span>
          {selectedAppointment.reason}
        </p>
        <p className="flex items-start gap-2">
          <span className="font-semibold bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent flex items-center gap-1.5">
            <i className="fas fa-info-circle bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent"></i>{" "}
            Estado:
          </span>
          {selectedAppointment.status.charAt(0).toUpperCase() +
            selectedAppointment.status.slice(1)}
        </p>
        <p className="flex items-start gap-2">
          <span className="font-semibold bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent flex items-center gap-1.5">
            <i className="fas fa-calendar-alt bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent"></i>{" "}
            Fecha:
          </span>
          {new Date(selectedAppointment.date).toLocaleString("es-PE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      {renderButtons()}

      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-neutral-800 text-red-700 dark:text-neutral-300 border border-red-200 dark:border-neutral-700 p-4 rounded-xl mt-4 text-sm space-y-2 transition-colors duration-300 ease-in-out">
          {errors.map((err, i) => (
            <p key={i} className="flex items-center gap-2">
              <i className="fas fa-exclamation-circle text-red-500"></i>
              {err}
            </p>
          ))}
        </div>
      )}

      {showConfirm && (
        <Modal
          type="alert"
          title="¿Estás seguro de cancelar esta cita médica?"
          message="Esta acción no se puede deshacer."
          onClose={() => setShowConfirm(false)}
          onSubmit={handleDelete}
        />
      )}
    </div>
  );
}

export default AppointDetail;
