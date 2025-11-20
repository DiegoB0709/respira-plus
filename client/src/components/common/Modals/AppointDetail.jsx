import { useState } from "react";
import { useAppointments } from "../../../context/AppointmentContext";
import { useAuth } from "../../../context/AuthContext";
import Modal from "../Modals/Modal";
import Button from "../Buttons/Button";
import Toast from "../Toast/Toast";

const checkTimeTolerance = (appointmentDate) => {
  const now = new Date();
  const appointmentTime = new Date(appointmentDate).getTime();

  const thirtyMinutes = 30 * 60 * 1000;

  const earlyTime = appointmentTime - thirtyMinutes;
  const lateTime = appointmentTime + thirtyMinutes;

  return now.getTime() >= earlyTime && now.getTime() <= lateTime;
};

function AppointDetail({
  selectedAppointment,
  setActiveModal,
  onAppointmentDeleted,
}) {
  const { deleteAppointment, updateAppointmentTimes, errors } =
    useAppointments();
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();

  const handleDelete = async () => {
    await deleteAppointment(selectedAppointment._id);
    if (onAppointmentDeleted) onAppointmentDeleted();
    setShowConfirm(false);
    setActiveModal(null);
  };

  const handleMarkArrival = async () => {
    try {
      await updateAppointmentTimes(selectedAppointment._id);
      setActiveModal(null);
    } catch (error) {
      console.error("Error al marcar llegada:", error);
    }
  };

  const handleMarkConsultationStart = async () => {
    try {
      await updateAppointmentTimes(selectedAppointment._id);
      if (onAppointmentDeleted) onAppointmentDeleted();
      setActiveModal(null);
    } catch (error) {
      console.error("Error al marcar inicio de atención:", error);
    }
  };

  const status = selectedAppointment.status?.toLowerCase();
  const isPatient = user.role === "patient";
  const isDoctor = user.role === "doctor";

  const isWithinTolerance = checkTimeTolerance(selectedAppointment.date);
  const hasArrived = selectedAppointment.arrivalTime !== null;
  const hasConsultationStarted =
    selectedAppointment.consultationStartTime !== null;

  const canMarkArrival =
    isPatient &&
    isWithinTolerance &&
    !hasArrived &&
    (status === "confirmada" || status === "pendiente");

  const canMarkConsultationStart =
    isDoctor &&
    hasArrived &&
    !hasConsultationStarted &&
    (status === "confirmada" || status === "pendiente");

  const hasPriorityButton = canMarkArrival || canMarkConsultationStart;

  const canDelete =
    status === "pendiente" ||
    status === "confirmada" ||
    status === "solicitada";

  const canReprogram =
    !hasPriorityButton && isDoctor && status === "confirmada";

  const canUpdateStatus =
    !hasPriorityButton &&
    ((isDoctor && status === "solicitada") ||
      (isPatient && status === "pendiente"));

  const buttons = [
    {
      key: "markArrival",
      show: canMarkArrival,
      onClick: handleMarkArrival,
      label: "Marcar Llegada",
      icon: "fa-map-marker-alt",
      type: "bg5",
    },
    {
      key: "markConsultationStart",
      show: canMarkConsultationStart,
      onClick: handleMarkConsultationStart,
      label: "Marcar Atención",
      icon: "fa-user-md",
      type: "bg5",
    },
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
    const totalButtons = buttons.length;

    if (totalButtons === 0) {
      return null;
    }

    const historyButton = buttons.find((b) => b.key === "history");
    const otherButtons = buttons.filter((b) => b.key !== "history");

    if (totalButtons % 2 !== 0) {
      if (totalButtons === 1) {
        return (
          <div className="grid grid-cols-1 gap-3">
            <Button {...historyButton} full />
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 gap-3">
          {historyButton && <Button {...historyButton} full classes="!py-2" />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherButtons.map((btn) => (
              <Button key={btn.key} {...btn} full={false} />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {buttons.map((btn) => (
            <Button key={btn.key} {...btn} full={false} />
          ))}
        </div>
      );
    }
  };

  return (
    <>
      {errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}

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
    </>
  );
}

export default AppointDetail;
