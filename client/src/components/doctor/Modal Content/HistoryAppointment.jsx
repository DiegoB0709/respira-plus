import { useEffect } from "react";
import { useAppointments } from "../../../context/AppointmentContext";

function HistoryAppointment({ selectedAppointment }) {
  const { appointmentHistory, fetchAppointmentHistory, errors } =
    useAppointments();

  useEffect(() => {
    fetchAppointmentHistory(selectedAppointment._id);
  }, [selectedAppointment]);

  const translateRole = (role) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "doctor":
        return "Médico";
      case "patient":
        return "Paciente";
      case "server":
        return "Servidor";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-teal-500 flex items-center justify-center gap-2">
          <i className="fas fa-history text-teal-400 text-2xl"></i>
          Historial de la Cita
        </h2>
        <p className="text-sm text-gray-500">
          Registros de acciones realizadas sobre esta cita.
        </p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl shadow-sm space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="flex items-center gap-2 text-sm">
              <i className="fas fa-exclamation-circle text-red-500"></i>
              {err}
            </p>
          ))}
        </div>
      )}

      {appointmentHistory.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
          <i className="fas fa-folder-open text-4xl text-gray-400 mb-3"></i>
          <p className="text-gray-500 text-sm">No hay historial disponible.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {appointmentHistory.map((entry, index) => (
            <li
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-gray-800">
                  <span className="font-semibold text-teal-500 flex items-center gap-1 shrink-0">
                    <i className="fas fa-tasks text-teal-400"></i>
                    Acción:
                  </span>
                  <span className="text-gray-700">{entry.action}</span>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-800">
                  <span className="font-semibold text-teal-500 flex items-center gap-1 shrink-0">
                    <i className="fas fa-calendar-alt text-teal-400"></i>
                    Fecha:
                  </span>
                  <span className="text-gray-700">
                    {new Date(entry.date).toLocaleString("es-PE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-800">
                  <span className="font-semibold text-teal-500 flex items-center gap-1 shrink-0">
                    <i className="fas fa-user-edit text-teal-400"></i>
                    Actualizado por:
                  </span>
                  <span className="text-gray-700">
                    {entry.updatedBy?.username} (
                    {translateRole(entry.updatedBy?.role)})
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

}

export default HistoryAppointment;
