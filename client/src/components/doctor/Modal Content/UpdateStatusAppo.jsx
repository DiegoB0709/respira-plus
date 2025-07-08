import { useEffect, useState } from "react";
import { useAppointments } from "../../../context/AppointmentContext";

function UpdateStatusAppo({ selectedAppointment, activeModal }) {
  const { updateAppointmentStatus } = useAppointments();
  const [appointmentId, setAppointmentId] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setAppointmentId(selectedAppointment._id);
  }, [selectedAppointment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentId || !newStatus) return;
    await updateAppointmentStatus(appointmentId, newStatus);
    setShowSuccess(true);
  };

  const handleClose = () => {
    setShowSuccess(false);
    activeModal();
  };

  return (
    <>
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl space-y-5">
        <h2 className="text-xl font-bold text-teal-600 text-center flex items-center justify-center gap-2">
          <i className="fas fa-edit text-teal-400"></i>
          Actualizar Estado de la Cita
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <i className="fas fa-sync-alt text-teal-400"></i>
              Nuevo Estado:
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            >
              <option value="">Selecciona...</option>
              <option value="confirmada">Confirmada</option>
              <option value="asistió">Asistió</option>
              <option value="no asistió">No asistió</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md transition cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <i className="fas fa-save text-white"></i>
            Actualizar Estado
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center space-y-4">
            <h3 className="text-lg font-semibold text-teal-700 flex items-center justify-center gap-2">
              <i className="fas fa-check-circle text-teal-400"></i>
              Estado actualizado con éxito
            </h3>
            <p className="text-sm text-gray-600">
              El estado de la cita ha sido modificado correctamente.
            </p>
            <button
              onClick={handleClose}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded transition cursor-pointer inline-flex items-center gap-2"
            >
              <i className="fas fa-check text-white"></i>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
  
}

export default UpdateStatusAppo;
