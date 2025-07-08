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
};

function Alertas({ setAlertId, setActiveModal }) {
  const { alerts, errors, fetchAlertsByDoctor } = useAlerts();

  useEffect(() => {
    fetchAlertsByDoctor();
  }, []);

  const severityOrder = { alta: 0, media: 1, baja: 2 };
  const statusOrder = { activa: 0, revisada: 1, resuelta: 2 };

  const sortedAlerts = [...alerts].sort((a, b) => {
    const sevA = severityOrder[a.severity] ?? 3;
    const sevB = severityOrder[b.severity] ?? 3;
    if (sevA !== sevB) return sevA - sevB;

    const statA = statusOrder[a.status] ?? 3;
    const statB = statusOrder[b.status] ?? 3;
    return statA - statB;
  });

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
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-700">
            Alertas del Paciente
          </h1>
          {unresolvedCount > 0 && (
            <span className="text-sm font-medium bg-red-500 text-white px-2 py-0.5 rounded-full">
              {unresolvedCount}
            </span>
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
        <p className="text-center text-gray-500 text-sm flex items-center justify-center gap-2">
          <i className="fas fa-info-circle text-gray-400" />
          No hay alertas disponibles.
        </p>
      ) : (
        <ul className="space-y-4">
          {sortedAlerts.map((alert) => {
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
                    <i className={typeConfig.icon} />
                    {typeConfig.label}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(alert.createdAt)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-800">
                  <p className="flex items-start gap-2">
                    <i className="fas fa-user text-teal-400 mt-0.5" />
                    <span>
                      Paciente:{" "}
                      <span className="font-medium">
                        {alert.patient?.username || "No especificado"}
                      </span>
                    </span>
                  </p>

                  <p className="flex items-start gap-2">
                    <i className="fas fa-align-left text-teal-400 mt-0.5" />
                    <span>{alert.description}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <p className="flex items-center gap-2">
                      <i className="fas fa-thermometer-half text-orange-400" />
                      Severidad:
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
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
                      <span className="capitalize">{alert.status}</span>
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
                    <div className="pt-4 text-right">
                      <button
                        onClick={() => {
                          setAlertId(alert._id);
                          setActiveModal("UpdateAlert");
                        }}
                        className="cursor-pointer inline-flex items-center gap-1 text-sm text-white bg-teal-600 hover:bg-teal-700 font-medium py-1.5 px-4 rounded transition"
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
