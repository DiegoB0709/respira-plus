import { useEffect, useState } from "react";
import { useTreatment } from "../../../context/TreatmentContext";
import { useAuth } from "../../../context/AuthContext";
import Button from "../Buttons/Button";
import Modal from "./Modal";
import Toast from "../Toast/Toast";

function PatientTreatment({ patientId, setActiveModal }) {
  const { treatment, fetchTreatmentByPatient, removeTreatment, error } =
    useTreatment();
  const { user } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchTreatmentByPatient(patientId);
  }, []);

  const handleDeleteTreatment = async () => {
    await removeTreatment(patientId);
    setShowConfirm(false);
  };

  return (
    <>
      {error.length > 0 &&
        error.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="p-6 max-w-4xl mx-auto">
        {treatment ? (
          <section className="bg-white dark:bg-neutral-800 transition-colors duration-300 ease-in-out rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-md hover:shadow-lg p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out text-sm sm:text-base divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-neutral-800">
              <p className="flex items-center gap-3 py-1 sm:pr-4">
                <i className="fas fa-calendar-alt bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent text-lg" />
                <span>
                  <span className="font-medium text-gray-900 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
                    Inicio:
                  </span>{" "}
                  {new Date(treatment.startDate).toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
              <p className="flex items-center gap-3 py-1 sm:pl-4">
                <i className="fas fa-calendar-check bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent text-lg" />
                <span>
                  <span className="font-medium text-gray-900 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
                    Fin:
                  </span>{" "}
                  {new Date(treatment.endDate).toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
              <p className="flex items-start gap-3 sm:col-span-2 pt-3 sm:pt-4">
                <i className="fas fa-sticky-note bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent text-lg pt-1" />
                <span>
                  <span className="font-medium text-gray-900 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
                    Notas:
                  </span>{" "}
                  {treatment.notes || "Sin notas registradas."}
                </span>
              </p>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-50 transition-colors duration-300 ease-in-out mb-3 flex items-center gap-2">
                <i className="fas fa-pills bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent" />
                Medicamentos
              </h4>
              <ul className="flex flex-wrap gap-2">
                {treatment.medications.map((med, index) => (
                  <li
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-teal-50 dark:bg-neutral-800 transition-colors duration-300 ease-in-out bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent text-sm font-medium border border-teal-100 dark:border-neutral-700 shadow-sm"
                  >
                    {med.name} · {med.dosage} · {med.frequency}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`flex ${
                user.role === "doctor"
                  ? "flex-col sm:flex-row justify-end"
                  : "flex-col"
              } gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800 transition-colors duration-300 ease-in-out`}
            >
              {user.role === "doctor" && (
                <>
                  <Button
                    onClick={() => setShowConfirm(true)}
                    type="alert"
                    icon="fa-trash-alt"
                    label="Eliminar"
                    full={true}
                  />
                  <Button
                    onClick={() => setActiveModal("treatmentForm")}
                    type="bg1"
                    icon="fa-edit"
                    label="Editar"
                    full={true}
                  />
                </>
              )}
              <Button
                onClick={() => setActiveModal("treatmentHistory")}
                type={user.role === "doctor" ? "bg6" : "bg1"}
                icon="fa-history"
                label="Historial"
                full={true}
              />
            </div>
          </section>
        ) : (
          <div className="mt-2 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-neutral-800 transition-colors duration-300 ease-in-out p-10 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700">
            <i className="fa fa-pills text-5xl text-gray-400 dark:text-neutral-400 transition-colors duration-300 ease-in-out mb-4" />
            <p className="text-gray-600 dark:text-neutral-300 transition-colors duration-300 ease-in-out text-lg mb-6 max-w-md">
              No se encontraron tratamientos registrados para este paciente.
            </p>

            <div
              className={`flex ${
                user.role === "doctor" ? "flex-col sm:flex-row" : "flex-col"
              } justify-center gap-4 w-full sm:w-auto`}
            >
              {user.role === "doctor" && (
                <Button
                  onClick={() => setActiveModal("treatmentForm")}
                  type="bg1"
                  icon="fa-plus"
                  label="Añadir Tratamiento"
                  full={false}
                  classes="px-6 py-3"
                />
              )}

              <Button
                onClick={() => setActiveModal("treatmentHistory")}
                type={user.role === "doctor" ? "bg6" : "bg1"}
                label="Ver Historial"
                full={user.role !== "doctor"}
                classes="px-6 py-3"
              />
            </div>
          </div>
        )}

        {showConfirm && (
          <Modal
            type="alert"
            title="¿Estás seguro de eliminar este tratamiento?"
            message="Esta acción no se puede deshacer."
            onClose={() => setShowConfirm(false)}
            onSubmit={handleDeleteTreatment}
          />
        )}
      </div>
    </>
  );
}

export default PatientTreatment;
