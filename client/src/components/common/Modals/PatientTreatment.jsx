import { useEffect, useState } from "react";
import { useTreatment } from "../../../context/TreatmentContext";
import { useAuth } from "../../../context/AuthContext";
import Button from "../Buttons/Button";
import Toast from "../Toast/Toast";

function PatientTreatment({ patientId, setActiveModal }) {
  const {
    treatment,
    fetchTreatmentByPatient,
    removeTreatment,
    finalizeTreatment,
    error,
    complianceStatus,
    recordCompliance,
    checkCompliance,
  } = useTreatment();
  const { user } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  const [observation, setObservation] = useState("");
  const [abandonment, setAbandonment] = useState(false);

  const [showFinalObservationForm, setShowFinalObservationForm] =
    useState(false);
  const [finalObservationData, setFinalObservationData] = useState({
    finalObservation: "",
    isRecurrence: false,
    recurrenceReason: "",
    observationDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchTreatmentByPatient(patientId);
  }, [patientId, fetchTreatmentByPatient]);

  useEffect(() => {
    if (treatment && treatment.status === "Activo" && treatment._id) {
      checkCompliance(treatment._id);
    }
  }, [treatment, checkCompliance]);

  const handleDeleteTreatment = async () => {
    const data = {
      observation: observation,
      abandonment: abandonment,
    };

    await removeTreatment(patientId, data);

    setObservation("");
    setAbandonment(false);
    setShowConfirm(false);
  };

  const handleFinalizeTreatmentSubmit = async () => {
    const dataToSend = {
      finalObservation: finalObservationData.finalObservation,
      isRecurrence: finalObservationData.isRecurrence,
      recurrenceReason: finalObservationData.isRecurrence
        ? finalObservationData.recurrenceReason
        : undefined,
      observationDate: finalObservationData.observationDate,
    };

    await finalizeTreatment(patientId, dataToSend);

    if (!error.length) {
      setFinalObservationData({
        finalObservation: "",
        isRecurrence: false,
        recurrenceReason: "",
        observationDate: new Date().toISOString().split("T")[0],
      });
      setShowFinalObservationForm(false);
    }
  };

  const handleRecordCompliance = async () => {
    if (treatment && treatment._id) {
      await recordCompliance(treatment._id);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = treatment ? new Date(treatment.startDate) : null;
  if (start) start.setHours(0, 0, 0, 0);
  const startsInFuture = treatment && start > today;

  return (
    <>
      {error.length > 0 &&
        error.map((e, i) => <Toast key={i} type="error" message={e} />)}

      <div className="p-6 max-w-4xl mx-auto">
        {treatment &&
        treatment.status === "Activo" &&
        user.role === "patient" &&
        startsInFuture ? (
          <div className="mt-2 flex flex-col items-center justify-center text-center bg-blue-50 dark:bg-neutral-800 transition-colors duration-300 ease-in-out p-10 rounded-2xl border border-dashed border-blue-300 dark:border-neutral-700 shadow-sm hover:shadow-md">
            <i className="fa fa-hourglass-start text-5xl text-blue-600 dark:text-blue-400 transition-colors duration-300 ease-in-out mb-4" />

            <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-50 mb-2">
              Tu tratamiento aún no inicia
            </h3>

            <p className="text-gray-600 dark:text-neutral-300 text-base mb-6 max-w-md">
              El tratamiento está programado para comenzar el{" "}
              {new Date(treatment.startDate).toLocaleDateString("es-PE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              .
            </p>

            <Button
              onClick={() => setActiveModal("treatmentHistory")}
              type="bg1"
              label="Ver Historial"
              full={false}
              classes="px-6 py-3"
            />
          </div>
        ) : treatment && treatment.status === "Activo" ? (
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
              className={`flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800 transition-colors duration-300 ease-in-out`}
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
              {user.role === "patient" && (
                <>
                  <Button
                    onClick={handleRecordCompliance}
                    type={complianceStatus ? "bg3" : "bg1"}
                    icon={
                      complianceStatus ? "fa-calendar-check" : "fa-circle-check"
                    }
                    label={
                      complianceStatus
                        ? "Cumplimiento Registrado"
                        : "Marcar Cumplimiento"
                    }
                    full={true}
                    disabled={complianceStatus}
                  />
                </>
              )}
              <Button
                onClick={() => setActiveModal("treatmentHistory")}
                type={"bg6"}
                icon="fa-history"
                label="Historial"
                full={true}
              />
            </div>
          </section>
        ) : treatment &&
          treatment.status === "Finalizado" &&
          user.role === "doctor" &&
          !treatment.finalObservation ? (
          <div className="mt-2 flex flex-col items-center justify-center text-center bg-yellow-50 dark:bg-neutral-800 transition-colors duration-300 ease-in-out p-10 rounded-2xl border border-dashed border-yellow-300 dark:border-neutral-700 shadow-sm hover:shadow-md">
            <i className="fa fa-clipboard-question text-5xl text-yellow-600 dark:text-yellow-400 transition-colors duration-300 ease-in-out mb-4" />

            <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-50 mb-2">
              Tratamiento Finalizado, Pendiente de Observación Final
            </h3>

            <p className="text-gray-600 dark:text-neutral-300 text-base mb-6 max-w-md">
              El tratamiento ha concluido, pero aún requiere las observaciones
              finales del médico.
            </p>

            {!showFinalObservationForm ? (
              <Button
                onClick={() => setShowFinalObservationForm(true)}
                type="bg6"
                label="Añadir Observación Final"
                full={false}
                classes="px-6 py-3"
              />
            ) : (
              <div className="w-full max-w-md mx-auto mt-4 p-5  bg-white dark:bg-neutral-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-left">
                <h4 className="text-lg font-medium text-gray-800 dark:text-neutral-50 mb-4 text-center">
                  Registro de Observación
                </h4>

                <div className="mb-4">
                  <label
                    htmlFor="finalObservation"
                    className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
                  >
                    Observación Final
                  </label>
                  <textarea
                    id="finalObservation"
                    value={finalObservationData.finalObservation}
                    onChange={(e) =>
                      setFinalObservationData((prev) => ({
                        ...prev,
                        finalObservation: e.target.value,
                      }))
                    }
                    required
                    rows="3"
                    className="w-full p-3 border border-gray-300 dark:border-neutral-600 rounded-lg shadow-sm dark:bg-neutral-800 dark:text-neutral-50 resize-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none relative">
                    <input
                      type="checkbox"
                      checked={finalObservationData.isRecurrence}
                      onChange={(e) =>
                        setFinalObservationData((prev) => ({
                          ...prev,
                          isRecurrence: e.target.checked,
                          recurrenceReason: e.target.checked
                            ? prev.recurrenceReason
                            : "",
                        }))
                      }
                      className="peer h-5 w-5 appearance-none rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 checked:bg-cyan-600 checked:border-cyan-600 transition-all duration-200 focus:ring-2 focus:ring-cyan-500"
                    />

                    <span className=" pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5 text-white text-xs font-bold opacity-0 peer-checked:opacity-100 transition-opacity duration-150">
                      ✓
                    </span>

                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      ¿Hubo Reincidencia de la Enfermedad?
                    </span>
                  </label>
                </div>

                {finalObservationData.isRecurrence && (
                  <div className="mb-4">
                    <label
                      htmlFor="recurrenceReason"
                      className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1"
                    >
                      Razón de Reincidencia
                    </label>
                    <textarea
                      id="recurrenceReason"
                      value={finalObservationData.recurrenceReason}
                      onChange={(e) =>
                        setFinalObservationData((prev) => ({
                          ...prev,
                          recurrenceReason: e.target.value,
                        }))
                      }
                      rows="2"
                      className="w-full p-3 border border-gray-300 dark:border-neutral-600 rounded-lg shadow-sm dark:bg-neutral-800 dark:text-neutral-50 resize-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="back"
                    label="Cancelar"
                    onClick={() => setShowFinalObservationForm(false)}
                    full={false}
                    classes="px-5"
                  />
                  <Button
                    type="bg1"
                    label="Guardar Observación"
                    onClick={handleFinalizeTreatmentSubmit}
                    full={false}
                    classes="px-5"
                    disabled={
                      finalObservationData.finalObservation.trim().length === 0
                    }
                  />
                </div>
              </div>
            )}

            <Button
              onClick={() => setActiveModal("treatmentHistory")}
              type="bg1"
              label="Ver Historial Completo"
              full={false}
              classes="px-6 py-3 mt-4"
            />
          </div>
        ) : treatment &&
          treatment.status === "Finalizado" &&
          user.role === "patient" ? (
          <div className="mt-2 flex flex-col items-center justify-center text-center bg-teal-50 dark:bg-neutral-800 transition-colors duration-300 ease-in-out p-10 rounded-2xl border border-dashed border-teal-300 dark:border-neutral-700">
            <i className="fa fa-clipboard-check text-5xl text-teal-600 dark:text-teal-400 transition-colors duration-300 ease-in-out mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-50 mb-2">
              Tratamiento Finalizado
            </h3>
            <p className="text-gray-600 dark:text-neutral-300 text-base mb-6 max-w-md">
              Tu último tratamiento ha concluido. Revisa tu historial para ver
              más detalles y medicamentos.
            </p>
            <hr className="w-4/5 border-t border-dashed border-gray-400/50 dark:border-neutral-600 mb-6" />
            <div className="max-w-md w-full mb-6">
              <p className="text-md font-medium text-gray-700 dark:text-neutral-200 mb-1">
                Comentarios del doctor:
              </p>
              <p className="text-gray-600 dark:text-neutral-300 text-base italic p-3 bg-white dark:bg-neutral-700 rounded-lg border border-teal-100 dark:border-neutral-600 shadow-sm">
                {treatment.finalObservation ||
                  "No se registró una observación final."}
              </p>
            </div>

            <Button
              onClick={() => setActiveModal("treatmentHistory")}
              type={"bg1"}
              label="Ver Historial Completo"
              full={false}
              classes="px-6 py-3"
            />
          </div>
        ) : (
          <div className="mt-2 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-neutral-800 transition-colors duration-300 ease-in-out p-10 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700">
            <i className="fa fa-pills text-5xl text-gray-400 dark:text-neutral-400 transition-colors duration-300 ease-in-out mb-4" />
            <p className="text-gray-600 dark:text-neutral-300 transition-colors duration-300 ease-in-out text-lg mb-6 max-w-md">
              No se encontraron tratamientos activos para este paciente.
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-900 transition-colors duration-300 ease-in-out rounded-2xl shadow-2xl p-8 text-center space-y-4 max-w-md w-full">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto bg-rose-100 text-rose-600 transition-colors duration-300 ease-in-out`}
              >
                <i className={`fa-solid fa-circle-exclamation text-xl`} />
              </div>

              <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-50 transition-colors duration-300 ease-in-out text-center">
                ¿Estás seguro de finalizar este tratamiento?
              </h2>
              <p className="text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out text-sm">
                Esta acción marcará el tratamiento como Finalizado.
              </p>

              <div className="space-y-4 text-left pt-3">
                <label className="flex items-center space-x-2 text-gray-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={abandonment}
                    onChange={(e) => setAbandonment(e.target.checked)}
                    className="h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                  />
                  <span>El paciente abandonó el tratamiento</span>
                </label>

                <div className="relative">
                  <textarea
                    id="final-observation"
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder=" "
                    required
                    rows="3"
                    className={`peer w-full p-3 border rounded-lg shadow-sm resize-none pt-6.5 ${
                      observation.trim().length > 0
                        ? "border-gray-300 dark:border-neutral-700 focus:border-rose-500"
                        : "border-red-500 dark:border-red-500"
                    } dark:bg-neutral-800 transition duration-150 ease-in-out`}
                  ></textarea>
                  <label
                    htmlFor="final-observation"
                    className={`absolute left-3 top-2 text-sm transition-all transform duration-150 ease-in-out ${
                      observation.trim().length > 0
                        ? "text-gray-500 dark:text-neutral-400 peer-focus:text-rose-600 dark:peer-focus:text-rose-400"
                        : "text-red-500"
                    } peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:top-2 peer-focus:text-sm`}
                  >
                    Observación Final (obligatorio)
                  </label>
                  {observation.trim().length === 0 && (
                    <p className="text-red-500 text-xs mt-1">
                      Debe introducir una observación final.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button
                  type="back"
                  label="Cancelar"
                  onClick={() => setShowConfirm(false)}
                  full={false}
                  classes={"px-9"}
                />
                <Button
                  type="alert"
                  label="Finalizar"
                  onClick={handleDeleteTreatment}
                  full={false}
                  classes={"px-9"}
                  disabled={observation.trim().length === 0}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PatientTreatment;
