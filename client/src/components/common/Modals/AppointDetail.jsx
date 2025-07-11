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
  const {user} = useAuth();

  const handleDelete = async () => {
    await deleteAppointment(selectedAppointment._id);
    if (onAppointmentDeleted) onAppointmentDeleted();
    setShowConfirm(false);
    setActiveModal(null);
  };

  const status = selectedAppointment.status?.toLowerCase();
  const canDelete = status === "pendiente" || status === "confirmada";

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl space-y-4">
      <h2 className="text-2xl font-bold text-teal-500 text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
        <i className="fas fa-notes-medical text-teal-400 "></i>
        Detalles de la Cita
      </h2>

      <div className="text-sm text-gray-800 space-y-2">
        <p className="flex items-start gap-2">
          <span className="font-semibold text-teal-500 flex items-center gap-1">
            <i className="fas fa-user text-teal-400"></i> Paciente:
          </span>{" "}
          {selectedAppointment.patient?.username}
        </p>
        <p className="flex items-start gap-2">
          <span className="font-semibold text-teal-500 flex items-center gap-1">
            <i className="fas fa-pencil-alt text-teal-400"></i> Motivo:
          </span>{" "}
          {selectedAppointment.reason}
        </p>
        <p className="flex items-start gap-2">
          <span className="font-semibold text-teal-500 flex items-center gap-1">
            <i className="fas fa-info-circle text-teal-400"></i> Estado:
          </span>{" "}
          {selectedAppointment.status.charAt(0).toUpperCase() +
            selectedAppointment.status.slice(1)}
        </p>
        <p className="flex items-start gap-2">
          <span className="font-semibold text-teal-500 flex items-center gap-1">
            <i className="fas fa-calendar-alt text-teal-400"></i> Fecha:
          </span>{" "}
          {new Date(selectedAppointment.date).toLocaleString("es-PE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={() => setActiveModal("historyAppoint")}
          className={`cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition text-xs sm:text-sm flex items-center justify-center gap-2 ${
            canDelete ? "" : "col-span-2"
          }`}
        >
          <i className="fas fa-history text-gray-600"></i> Historial
        </button>

        {canDelete && (
          <>
            {user.role === "doctor" && (
              <>
                <button
                  onClick={() => setActiveModal("editAppointment")}
                  className="cursor-pointer bg-teal-600 hover:bg-teal-500 text-white font-medium py-2 px-4 rounded-lg transition text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <i className="fas fa-sync-alt text-white"></i> Reprogramar
                </button>
                <button
                  onClick={() => setActiveModal("updateAppointStatus")}
                  className="cursor-pointer bg-teal-500 hover:bg-teal-400 text-white font-medium py-2 px-4 rounded-lg transition text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <i className="fas fa-clipboard-check text-white"></i>{" "}
                  Actualizar Estado
                </button>
              </>
            )}

            <button
              onClick={() => setShowConfirm(true)}
              className="cursor-pointer bg-red-500 hover:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <i className="fas fa-trash-alt text-white"></i> Cancelar Cita
            </button>
          </>
        )}
      </div>

      {errors.length > 0 && (
        <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded mt-4 text-sm space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="flex items-center gap-2">
              <i className="fas fa-exclamation-circle text-red-500"></i>
              {err}
            </p>
          ))}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.95)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              ¿Estás seguro de cancelar esta cita medica?
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="cursor-pointer px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointDetail;
