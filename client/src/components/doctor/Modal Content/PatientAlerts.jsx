import { useEffect } from "react";
import { useAlerts } from "../../../context/AlertsContext";

const alertTypes = {
  baja_adherencia: {
    label: "Baja Adherencia",
    color: "bg-yellow-100 text-yellow-800",
    icon: "fas fa-pills",
  },
  riesgo_abandono: {
    label: "Riesgo de Abandono",
    color: "bg-red-100 text-red-700",
    icon: "fas fa-sign-out-alt",
  },
  tratamiento_inefectivo: {
    label: "Tratamiento Inefectivo",
    color: "bg-orange-100 text-orange-800",
    icon: "fas fa-exclamation-triangle",
  },
  resistencia_medicamentosa: {
    label: "Resistencia Medicamentos",
    color: "bg-purple-100 text-purple-800",
    icon: "fas fa-shield-virus",
  },
  inactividad_prolongada: {
    label: "Inactividad Prolongada",
    color: "bg-blue-100 text-blue-800",
    icon: "fas fa-bed",
  },
};

function PatientAlerts({ patientId, setActiveModal, setAlertId }) {
  const { alerts, errors, fetchAlertsByPatient } = useAlerts();

  useEffect(() => {
    fetchAlertsByPatient(patientId);
  }, []);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <header className="sticky top-0 z-10 bg-white pt-4 pb-4 px-4">
        <h2 className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xl sm:text-2xl font-bold text-teal-500 text-center">
          <i className="fas fa-bell text-teal-400 text-2xl" />
          <span className="leading-tight">Alertas del Paciente</span>
        </h2>
      </header>

      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">
            <i className="fas fa-exclamation-circle mr-2" />
            Errores:
          </h3>
          <ul className="list-disc list-inside text-sm">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {alerts.length === 0 ? (
        <p className="text-center text-gray-500 flex items-center justify-center gap-2 text-sm">
          <i className="fas fa-info-circle text-gray-400" />
          No hay alertas para este paciente.
        </p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => {
            const typeConfig = alertTypes[alert.type] || {
              label: alert.type,
              color: "bg-gray-100 text-gray-800",
              icon: "fas fa-exclamation-circle",
            };

            return (
              <li
                key={alert._id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${typeConfig.color}`}
                  >
                    <i className={`${typeConfig.icon}`} />
                    {typeConfig.label}
                  </div>

                  {alert.status !== "resuelta" && (
                    <button
                      onClick={() => {
                        setActiveModal("UpdateAlert");
                        setAlertId(alert._id);
                      }}
                      className="cursor-pointer text-sm text-teal-500 hover:text-teal-400 font-medium flex items-center gap-1 self-start sm:self-auto"
                    >
                      <i className="fas fa-edit" />
                      Actualizar
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-800">
                  <p className="flex items-start gap-2">
                    <i className="fas fa-align-left text-teal-400 mt-0.5" />
                    <span>{alert.description}</span>
                  </p>

                  {alert.doctor && (
                    <p className="flex items-start gap-2">
                      <i className="fas fa-user-md text-teal-400 mt-0.5" />
                      <span>
                        Médico: {alert.doctor.username || alert.doctor}
                      </span>
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <p className="flex items-center gap-2">
                      <i className="fas fa-thermometer-half text-orange-400" />
                      Severidad: {alert.severity}
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="fas fa-info-circle text-gray-500" />
                      Estado: {alert.status}
                    </p>

                    {alert.triggeredRules?.length > 0 && (
                      <p className="flex items-center gap-2 sm:col-span-2">
                        <i className="fas fa-cogs text-cyan-500" />
                        Reglas: {alert.triggeredRules.join(", ")}
                      </p>
                    )}

                    <p className="flex items-center gap-2 sm:col-span-2">
                      <i className="fas fa-tasks text-teal-400" />
                      Acción: {alert.actionTaken?.trim() || "No registrada"}
                    </p>

                    <p className="flex items-center gap-2">
                      <i className="fas fa-calendar-plus text-green-500" />
                      Creado: {formatDate(alert.createdAt)}
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="fas fa-clock text-blue-500" />
                      Actualizado: {formatDate(alert.updatedAt)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PatientAlerts;
