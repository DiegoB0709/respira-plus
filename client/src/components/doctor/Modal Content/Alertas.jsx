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

function Alertas({ setAlertId, setActiveModal }) {
  const { alerts, errors, fetchAlertsByDoctor } = useAlerts();

  useEffect(() => {
    fetchAlertsByDoctor();
  }, []);

  const unresolvedCount = alerts.filter((a) => a.status !== "resuelta").length;

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleString("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <header className="mb-6 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <i className="fas fa-bell text-teal-400 text-2xl sm:text-3xl" />
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-500">
            Alertas del Paciente
          </h1>
          {unresolvedCount > 0 && (
            <div className="w-8 h-8 rounded-full shadow-md flex items-center justify-center animate-pulse bg-amber-500">
              <span className="flex items-center justify-center w-full h-full text-white text-sm font-bold leading-none">
                {unresolvedCount > 99 ? "99+" : unresolvedCount}
              </span>
            </div>
          )}
        </div>
      </header>

      {errors.length > 0 && (
        <ul className="text-red-600 text-sm mb-4 list-disc list-inside">
          {errors.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}

      {alerts.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center text-center bg-gray-50 p-10 rounded-2xl border border-dashed border-gray-300">
          <i className="fas fa-bell text-5xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-2 max-w-md">
            No hay alertas en este momento.
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
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${typeConfig.color}`}
                  >
                    <i className={typeConfig.icon} />
                    {typeConfig.label}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(alert.createdAt)}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-800">
                  <p className="flex items-start gap-2">
                    <i className="fas fa-user text-teal-400 mt-0.5" />
                    <span>
                      Paciente:{" "}
                      <span className="font-semibold">
                        {alert.patient?.username || "No especificado"}
                      </span>
                    </span>
                  </p>

                  <p className="flex items-start gap-2 text-gray-600">
                    <i className="fas fa-align-left text-teal-400 mt-0.5" />
                    <span>{alert.description}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <p className="flex items-center gap-2">
                      <i className="fas fa-thermometer-half text-orange-400" />
                      Severidad:
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          alert.severity === "alta"
                            ? "bg-red-100 text-red-700"
                            : alert.severity === "media"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <i className="fas fa-info-circle text-gray-500" />
                      Estado:
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          alert.status === "activa"
                            ? "bg-green-100 text-green-700"
                            : alert.status === "revisada"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </p>

                    {alert.triggeredRules?.length > 0 && (
                      <p className="flex items-center gap-2 sm:col-span-2">
                        <i className="fas fa-cogs text-cyan-500" />
                        Reglas: {alert.triggeredRules.join(", ")}
                      </p>
                    )}

                    {alert.actionTaken && (
                      <p className="flex items-center gap-2 sm:col-span-2">
                        <i className="fas fa-tasks text-teal-500" />
                        Acción: {alert.actionTaken}
                      </p>
                    )}
                  </div>

                  {alert.status !== "resuelta" && (
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => {
                          setAlertId(alert._id);
                          setActiveModal("UpdateAlert");
                        }}
                        className="cursor-pointer inline-flex items-center justify-center gap-2 text-sm text-white bg-teal-500 hover:bg-teal-400 font-medium py-2 px-5 rounded-full transition w-full sm:w-auto"
                      >
                        <i className="fa-regular fa-pen-to-square" />
                        Actualizar
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Alertas;
