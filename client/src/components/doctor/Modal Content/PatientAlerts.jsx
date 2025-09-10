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
    label: "Resistencia Medicamentosa",
    color: "bg-purple-100 text-purple-800",
    icon: "fas fa-shield-virus",
  },
  inactividad_prolongada: {
    label: "Inactividad Prolongada",
    color: "bg-blue-100 text-blue-800",
    icon: "fas fa-bed",
  },
  falta_educacion: {
    label: "Falta de Educación",
    color: "bg-pink-100 text-pink-800",
    icon: "fas fa-book-open",
  },
};

function PatientAlerts({ patientId, setActiveModal, setAlertId }) {
  const { alerts, errors, fetchAlertsByPatient } = useAlerts();

  useEffect(() => {
    fetchAlertsByPatient(patientId);
  }, []);

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleString("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <header className="sticky top-0 z-10 bg-white pt-4 pb-4 px-4 ">
        <h2 className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xl sm:text-2xl font-bold text-teal-500 text-center">
          <i className="fas fa-triangle-exclamation text-teal-400 text-2xl" />
          <span>Alertas del Paciente</span>
        </h2>
      </header>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl shadow-sm mb-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <i className="fas fa-exclamation-circle" />
            Errores
          </h3>
          <ul className="list-disc list-inside text-sm">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {alerts.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <i className="fa fa-triangle-exclamation text-5xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg max-w-md leading-relaxed">
            El paciente aún no genero alertas.
          </p>
        </div>
      ) : (
        <ul className="space-y-5">
          {alerts.map((alert) => {
            const typeConfig = alertTypes[alert.type] || {
              label: alert.type,
              color: "bg-gray-100 text-gray-800",
              icon: "fas fa-exclamation-circle",
            };

            return (
              <li
                key={alert._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${typeConfig.color}`}
                  >
                    <i className={typeConfig.icon} />
                    {typeConfig.label}
                  </div>

                  {alert.status !== "resuelta" && (
                    <button
                      onClick={() => {
                        setActiveModal("UpdateAlert");
                        setAlertId(alert._id);
                      }}
                      className="cursor-pointer bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium px-4 py-2 rounded-2xl shadow-sm transition-colors inline-flex items-center gap-2"
                    >
                      <i className="fas fa-edit" />
                      Actualizar
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-sm text-gray-800">
                  <p className="flex items-start gap-2">
                    <i className="fas fa-align-left text-teal-400 mt-0.5" />
                    <span>{alert.description}</span>
                  </p>

                  {alert.doctor && (
                    <p className="flex items-start gap-2">
                      <i className="fas fa-user-md text-teal-400 mt-0.5" />
                      <span>
                        Médico:{" "}
                        <span className="font-medium">
                          {alert.doctor.username || alert.doctor}
                        </span>
                      </span>
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <p className="flex items-center gap-2">
                      <i className="fas fa-thermometer-half text-orange-400" />
                      <span className="font-medium">Severidad:</span>{" "}
                      {alert.severity}
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="fas fa-info-circle text-gray-500" />
                      <span className="font-medium">Estado:</span>{" "}
                      {alert.status}
                    </p>

                    {alert.triggeredRules?.length > 0 && (
                      <p className="flex items-center gap-2 sm:col-span-2">
                        <i className="fas fa-cogs text-cyan-500" />
                        <span className="font-medium">Reglas:</span>{" "}
                        {alert.triggeredRules.join(", ")}
                      </p>
                    )}

                    <p className="flex items-center gap-2 sm:col-span-2">
                      <i className="fas fa-tasks text-teal-500" />
                      <span className="font-medium">Acción:</span>{" "}
                      {alert.actionTaken?.trim() || "No registrada"}
                    </p>

                    <p className="flex items-center gap-2">
                      <i className="fas fa-calendar-plus text-green-500" />
                      <span className="font-medium">Creado:</span>{" "}
                      {formatDate(alert.createdAt)}
                    </p>
                    <p className="flex items-center gap-2">
                      <i className="fas fa-clock text-blue-500" />
                      <span className="font-medium">Actualizado:</span>{" "}
                      {formatDate(alert.updatedAt)}
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
