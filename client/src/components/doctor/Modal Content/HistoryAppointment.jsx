import { useEffect } from "react";
import { useAppointments } from "../../../context/AppointmentContext";
import Toast from "@/components/common/Toast/Toast";

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
    <>
      {errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="p-6 max-w-2xl mx-auto space-y-6 transition-colors duration-300 ease-in-out">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-300 ease-in-out">
            Registros de acciones realizadas sobre esta cita.
          </p>
        </div>

        {appointmentHistory.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 dark:bg-neutral-800 border border-dashed border-gray-300 dark:border-neutral-700 rounded-xl transition-colors duration-300 ease-in-out">
            <i className="fas fa-folder-open text-4xl text-gray-400 dark:text-neutral-400 mb-3"></i>
            <p className="text-gray-500 dark:text-neutral-300 text-sm transition-colors duration-300 ease-in-out">
              No hay historial disponible.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {appointmentHistory.map((entry, index) => (
              <li
                key={index}
                className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-5 shadow-md hover:shadow-lg transition-colors duration-300 ease-in-out"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm text-gray-800 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
                    <span className="font-semibold text-teal-500 flex items-center gap-1 shrink-0">
                      <i className="fas fa-tasks text-teal-400"></i>
                      Acción:
                    </span>
                    <span className="text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out">
                      {entry.action}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-800 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
                    <span className="font-semibold text-teal-500 flex items-center gap-1 shrink-0">
                      <i className="fas fa-calendar-alt text-teal-400"></i>
                      Fecha:
                    </span>
                    <span className="text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out">
                      {new Date(entry.date).toLocaleString("es-PE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-800 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
                    <span className="font-semibold text-teal-500 flex items-center gap-1 shrink-0">
                      <i className="fas fa-user-edit text-teal-400"></i>
                      Actualizado por:
                    </span>
                    <span className="text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out">
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
    </>
  );
}

export default HistoryAppointment;
