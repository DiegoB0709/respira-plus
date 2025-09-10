import { useState, useEffect } from "react";
import { useAppointments } from "../../../context/AppointmentContext";
import { useDoctor } from "../../../context/DoctorContext";
import { useAuth } from "../../../context/AuthContext";

function AppointmentForm({
  setActiveModal,
  selectedAppointment,
  onAppointmentCreated,
  patientId,
}) {
  const { user } = useAuth();
  const { createAppointment, rescheduleAppointment, errors } =
    useAppointments();

  const isDoctor = user?.role === "doctor";
  const { fetchMyPatients, patients } = isDoctor
    ? useDoctor()
    : { fetchMyPatients: null, patients: [] };

  const isEditing = !!selectedAppointment;

  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    reason: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    if (isDoctor && fetchMyPatients) fetchMyPatients();

    if (isEditing) {
      setFormData({
        patientId: selectedAppointment.patient._id,
        date: selectedAppointment.date.slice(0, 10),
        time: new Date(selectedAppointment.date).toTimeString().slice(0, 5),
        reason: selectedAppointment.reason,
      });
    } else if (patientId) {
      setFormData((prev) => ({ ...prev, patientId }));
    } else if (!isDoctor) {
      setFormData((prev) => ({ ...prev, patientId: user._id }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;

    if (isEditing) {
      result = await rescheduleAppointment(selectedAppointment._id, {
        date: formData.date,
        time: formData.time,
      });
    } else {
      const payload = {
        patientId: formData.patientId,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
      };
      result = await createAppointment(payload);
    }

    if (result) {
      setShowSuccess(true);

      if (onAppointmentCreated) onAppointmentCreated();

      if (!isEditing) {
        setFormData({
          patientId: isDoctor ? "" : user._id,
          date: "",
          time: "",
          reason: "",
        });
      }
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setActiveModal();
  };

  return (
    <>
      <div className="relative p-6 max-w-lg mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-teal-500 text-center flex flex-col sm:flex-row items-center justify-center gap-2">
          <i className="fas fa-calendar-plus text-teal-400 text-2xl"></i>
          {isEditing ? "Reprogramar Cita" : "Crear Nueva Cita"}
        </h2>

        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-4 rounded-xl text-sm space-y-1">
            {errors.map((err, i) => (
              <p key={i} className="flex items-center gap-2">
                <i className="fas fa-exclamation-circle text-red-500"></i>
                {err}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fas fa-user text-gray-500"></i>
              Paciente
            </label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              disabled={!isDoctor || isEditing || !!patientId}
              className={`w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none ${
                !isDoctor || isEditing || patientId
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
            >
              {isDoctor ? (
                <>
                  <option value="">Selecciona un paciente</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.username}
                    </option>
                  ))}
                </>
              ) : (
                <option value={user._id}>{user.username}</option>
              )}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fas fa-calendar-day text-gray-500"></i>
              Fecha
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={minDate}
              className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fas fa-clock text-gray-500"></i>
              Hora
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fas fa-pencil-alt text-gray-500"></i>
              Motivo
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              disabled={isEditing}
              placeholder="Escribe el motivo de la cita"
              className={`w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none ${
                isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
              }`}
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full cursor-pointer bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 px-4 rounded-2xl text-sm sm:text-base transition inline-flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
            >
              <i
                className={`fas ${
                  isEditing ? "fa-sync-alt" : "fa-plus"
                } text-white`}
              ></i>
              {isEditing ? "Actualizar Cita" : "Crear Cita"}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
                <i className="fas fa-check text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                {isEditing
                  ? "¡Cita actualizada correctamente!"
                  : "¡Cita agendada correctamente!"}
              </h3>
              <p className="text-sm text-gray-500 text-center">
                La acción se completó exitosamente.
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
    </>
  );
}

export default AppointmentForm;
