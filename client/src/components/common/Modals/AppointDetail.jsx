import { useState } from "react";
import { useAppointments } from "../../../context/AppointmentContext";
import { useAuth } from "../../../context/AuthContext";

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

  const canReprogram =
    isDoctor && status !== "solicitada" && status !== "pendiente";
  const canUpdateStatus =
    (isDoctor && status !== "pendiente") ||
    (isPatient && status === "pendiente");

  const historyClasses = `
    cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base font-medium py-2 px-4
    rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition shadow-sm
    ${!canDelete ? "col-span-2" : ""}
    ${isPatient && status === "pendiente" ? "col-span-full" : ""}
    ${isDoctor && status === "solicitada" ? "col-span-full" : ""}
  `;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold text-teal-500 text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
        <i className="fas fa-notes-medical text-teal-400 text-xl sm:text-2xl"></i>
        Detalles de la Cita
      </h2>

      <div className="text-sm text-gray-800 space-y-3">
        <p className="flex items-start gap-2">
          <span className="font-semibold text-teal-600 flex items-center gap-1.5">
            <i className="fas fa-user text-teal-400"></i> Paciente:
          </span>
          {selectedAppointment.patient?.username}
        </p>
        <p className="flex items-start gap-2">
          <span className="font-semibold text-teal-600 flex items-center gap-1.5">
            <i className="fas fa-pencil-alt text-teal-400"></i> Motivo:
          </span>
          {selectedAppointment.reason}
        </p>
        <p className="flex items-start gap-2">
          <span className="font-semibold text-teal-600 flex items-center gap-1.5">
            <i className="fas fa-info-circle text-teal-400"></i> Estado:
          </span>
          {selectedAppointment.status.charAt(0).toUpperCase() +
            selectedAppointment.status.slice(1)}
        </p>
        <p className="flex items-start gap-2">
          <span className="font-semibold text-teal-600 flex items-center gap-1.5">
            <i className="fas fa-calendar-alt text-teal-400"></i> Fecha:
          </span>
          {new Date(selectedAppointment.date).toLocaleString("es-PE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={() => setActiveModal("historyAppoint")}
          className={historyClasses}
        >
          <i className="fas fa-history text-gray-600"></i> Historial
        </button>

        {canDelete && (
          <>
            {canReprogram && (
              <button
                onClick={() => setActiveModal("editAppointment")}
                className="cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base font-medium py-2 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white transition shadow-sm"
              >
                <i className="fas fa-sync-alt"></i> Reprogramar
              </button>
            )}

            {canUpdateStatus && (
              <button
                onClick={() => setActiveModal("updateAppointStatus")}
                className="cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base font-medium py-2 px-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white transition shadow-sm"
              >
                <i className="fas fa-clipboard-check"></i> Actualizar Estado
              </button>
            )}

            <button
              onClick={() => setShowConfirm(true)}
              className="cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base font-medium py-2 px-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white transition shadow-sm"
            >
              <i className="fas fa-ban"></i> Cancelar Cita
            </button>
          </>
        )}
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl mt-4 text-sm space-y-2">
          {errors.map((err, i) => (
            <p key={i} className="flex items-center gap-2">
              <i className="fas fa-exclamation-circle text-red-500"></i>
              {err}
            </p>
          ))}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
                <i className="fas fa-exclamation-triangle text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                ¿Estás seguro de cancelar esta cita médica?
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex w-full gap-3 pt-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="cursor-pointer w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="cursor-pointer w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointDetail;
