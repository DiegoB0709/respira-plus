import { useState, useEffect } from "react";
import { useAppointments } from "../../../context/AppointmentContext";
import { useDoctor } from "../../../context/DoctorContext";

function AppointmentForm({
  setActiveModal,
  selectedAppointment,
  onAppointmentCreated,
  patientId,
}) {
  const { createAppointment, rescheduleAppointment, errors } =
    useAppointments();
  const { fetchMyPatients, patients } = useDoctor();

  const isEditing = !!selectedAppointment;

  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    reason: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchMyPatients();

    if (isEditing) {
      setFormData({
        patientId: selectedAppointment.patient._id,
        date: selectedAppointment.date.slice(0, 10),
        time: new Date(selectedAppointment.date).toTimeString().slice(0, 5),
        reason: selectedAppointment.reason,
      });
    }else if (patientId){
      setFormData((prev) => ({ ...prev, patientId }));
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
      result = await createAppointment(formData);
    }

    if (result) {
      setShowSuccess(true);

      if (onAppointmentCreated) {
        onAppointmentCreated();
      }

      if (!isEditing) {
        setFormData({
          patientId: "",
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
    <div className="relative p-6 max-w-lg mx-auto bg-white rounded-2xl space-y-6">
      <h2 className="text-2xl font-bold text-teal-500 text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
        <i className="fas fa-calendar-plus text-teal-400 text-xl sm:text-2xl"></i>
        {isEditing ? "Reprogramar Cita" : "Crear Nueva Cita"}
      </h2>

      {errors.length > 0 && (
        <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded text-sm space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="flex items-center gap-2">
              <i className="fas fa-exclamation-circle text-red-500"></i>
              {err}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <i className="fas fa-user text-gray-500"></i>
            Paciente:
          </label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            disabled={isEditing || !!patientId}
            className={`w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-teal-500 focus:border-teal-500 ${
              isEditing || patientId
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : ""
            }`}
          >
            <option value="">Selecciona un paciente</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <i className="fas fa-calendar-day text-gray-500"></i>
            Fecha:
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <i className="fas fa-clock text-gray-500"></i>
            Hora:
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <i className="fas fa-pencil-alt text-gray-500"></i>
            Motivo:
          </label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            disabled={isEditing}
            className={`w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-teal-500 focus:border-teal-500 ${
              isEditing ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full cursor-pointer bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 px-4 rounded-lg transition inline-flex items-center justify-center gap-2"
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

      {showSuccess && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-50 p-5">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-teal-500 flex items-center justify-center gap-2 text-center break-words leading-snug">
              <i className="fas fa-check-circle text-teal-400"></i>
              {isEditing
                ? "¡Cita actualizada correctamente!"
                : "¡Cita agendada correctamente!"}
            </h3>
            <button
              onClick={handleCloseSuccess}
              className="bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer inline-flex items-center gap-2"
            >
              <i className="fas fa-check text-white"></i>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentForm;
