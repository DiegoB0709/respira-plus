import React, { useEffect } from "react";
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
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl  space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-teal-700 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
        <i className="fas fa-history text-teal-400 text-xl sm:text-2xl"></i>
        Historial de la Cita
      </h2>
      <p className="text-sm text-gray-500 text-center -mt-3">
        Registros de acciones realizadas sobre esta cita.
      </p>
      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded">
          {errors.map((err, i) => (
            <p key={i} className="text-sm">
              {err}
            </p>
          ))}
        </div>
      )}

      {appointmentHistory.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No hay historial disponible.
        </p>
      ) : (
        <ul className="space-y-4">
          {appointmentHistory.map((entry, index) => (
            <li
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm space-y-2"
            >
              <div className="text-sm text-gray-800 flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <span className="font-semibold text-teal-600 flex items-center gap-1 shrink-0">
                  <i className="fas fa-tasks text-teal-400"></i> Acción:
                </span>
                <span>{entry.action}</span>
              </div>

              <div className="text-sm text-gray-800 flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <span className="font-semibold text-teal-600 flex items-center gap-1 shrink-0">
                  <i className="fas fa-calendar-alt text-teal-400"></i> Fecha:
                </span>
                <span>
                  {new Date(entry.date).toLocaleString("es-PE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              <div className="text-sm text-gray-800 flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <span className="font-semibold text-teal-600 flex items-center gap-1 shrink-0">
                  <i className="fas fa-user-edit text-teal-400"></i> Actualizado
                  por:
                </span>
                <span>
                  {entry.updatedBy?.username} (
                  {translateRole(entry.updatedBy?.role)})
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HistoryAppointment;
