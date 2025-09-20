import { useEffect } from "react";
import { useAlerts } from "../../../context/AlertsContext";
import Button from "../../common/Buttons/Button";

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
    <div className="p-4 sm:p-6 max-w-5xl mx-auto transition-colors duration-300 ease-in-out">
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-neutral-800 border border-red-200 dark:border-neutral-700 text-red-700 dark:text-red-400 p-4 rounded-xl shadow-sm mb-6 transition-colors duration-300 ease-in-out">
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
        <div className="p-12 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-neutral-800 rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 transition-colors duration-300 ease-in-out">
          <i className="fa fa-triangle-exclamation text-5xl text-gray-400 dark:text-neutral-400 mb-4 transition-colors duration-300 ease-in-out" />
          <p className="text-gray-600 dark:text-neutral-300 text-lg max-w-md leading-relaxed transition-colors duration-300 ease-in-out">
            El paciente aún no genero alertas.
          </p>
        </div>
      ) : (
        <ul className="space-y-5">
          {alerts.map((alert) => {
            const typeConfig = alertTypes[alert.type] || {
              label: alert.type,
              color:
                "bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-neutral-300 transition-colors duration-300 ease-in-out",
              icon: "fas fa-exclamation-circle",
            };

            return (
              <li
                key={alert._id}
                className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 shadow-md transition-colors duration-300 ease-in-out"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${typeConfig.color}`}
                  >
                    <i className={typeConfig.icon} />
                    {typeConfig.label}
                  </div>

                  {alert.status !== "resuelta" && (
                    <div>
                      <Button
                        type="bg3"
                        icon="fa-edit"
                        label="Actualizar"
                        full={false}
                        onClick={() => {
                          setActiveModal("UpdateAlert");
                          setAlertId(alert._id);
                        }}
                        classes="px-6 py-2.5"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-sm text-gray-800 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
                  <p className="flex items-start gap-2">
                    <i className="fas fa-align-left text-teal-400 mt-0.5" />
                    <span>{alert.description}</span>
                  </p>

                  {alert.doctor && (
                    <p className="flex items-start gap-2">
                      <i className="fas fa-user-md bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mt-0.5" />
                      <span className="font-medium">Médico:</span>{" "}
                      {alert.doctor.username || alert.doctor}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <p className="flex items-center gap-2">
                      <i className="fas fa-thermometer-half bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent" />
                      <span className="font-medium ">Severidad:</span>{" "}
                      {alert.severity}
                    </p>

                    <p className="flex items-center gap-2">
                      <i className="fas fa-info-circle bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent" />
                      <span className="font-medium">Estado:</span>{" "}
                      {alert.status}
                    </p>

                    <p className="flex items-center gap-2 sm:col-span-2">
                      <i className="fas fa-cogs bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent" />
                      <span className="font-medium">Reglas:</span>{" "}
                      {alert.triggeredRules.join(", ")}
                    </p>

                    <p className="flex items-center gap-2 sm:col-span-2">
                      <i className="fas fa-tasks bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent" />
                      <span className="font-medium">Acción:</span>{" "}
                      {alert.actionTaken?.trim() || "No registrada"}
                    </p>

                    <p className="flex items-center gap-2">
                      <i className="fas fa-calendar-plus bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent" />
                      <span className="font-medium">Creado:</span>{" "}
                      {formatDate(alert.createdAt)}
                    </p>

                    <p className="flex items-center gap-2">
                      <i className="fas fa-clock bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent" />
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
