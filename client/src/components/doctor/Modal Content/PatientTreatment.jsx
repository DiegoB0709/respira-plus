import { useEffect, useState } from "react";
import { useTreatment } from "../../../context/TreatmentContext";

function PatientTreatment({ patientId, setActiveModal }) {
  const { treatment, fetchTreatmentByPatient, removeTreatment } =
    useTreatment();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchTreatmentByPatient(patientId);
  }, []);

  const handleDeleteTreatment = async () => {
    await removeTreatment(patientId);
    setShowConfirm(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-teal-500 mb-8 flex flex-col items-center justify-center gap-2">
        <i className="fas fa-user-md text-teal-400 text-3xl sm:text-4xl" />
        <span>Tratamiento del Paciente</span>
      </h1>

      {treatment ? (
        <section className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-6">
          <div className="space-y-3 text-gray-700 text-sm sm:text-base">
            <p className="flex items-center gap-2">
              <i className="fas fa-calendar-alt text-teal-400" />
              <span>
                <span className="font-medium text-teal-7500">
                  Fecha de Inicio:
                </span>{" "}
                {new Date(treatment.startDate).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <i className="fas fa-calendar-check text-teal-400" />
              <span>
                <span className="font-medium text-teal-500">Fecha de Fin:</span>{" "}
                {new Date(treatment.endDate).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <i className="fas fa-sticky-note text-teal-400 pt-1" />
              <span>
                <span className="font-medium text-teal-500">Notas:</span>{" "}
                {treatment.notes || "Sin notas registradas."}
              </span>
            </p>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold text-teal-500 mb-2 flex items-center gap-2">
              <i className="fas fa-pills" />
              Medicamentos
            </h4>
            <ul className="list-disc list-inside text-gray-800 text-sm sm:text-base space-y-1 ml-2">
              {treatment.medications.map((med, index) => (
                <li key={index}>
                  <span className="font-medium">{med.name}</span> - {med.dosage}{" "}
                  - {med.frequency}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              onClick={() => setShowConfirm(true)}
              className="cursor-pointer flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              <i className="fas fa-trash-alt text-sm" />
              Eliminar
            </button>
            <button
              onClick={() => setActiveModal("treatmentForm")}
              className="cursor-pointer flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              <i className="fas fa-edit text-sm" />
              Editar
            </button>
            <button
              onClick={() => setActiveModal("treatmentHistory")}
              className="cursor-pointer flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              <i className="fas fa-history text-sm" />
              Historial
            </button>
          </div>
        </section>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-6 text-base">
            No se encontraron tratamientos registrados para este paciente.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setActiveModal("treatmentForm")}
              className="cursor-pointer flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-medium px-5 py-2 rounded-lg transition"
            >
              <i className="fas fa-plus-circle text-sm" />
              Añadir Tratamiento
            </button>
            <button
              onClick={() => setActiveModal("treatmentHistory")}
              className="cursor-pointer flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-lg transition"
            >
              <i className="fas fa-history text-sm" />
              Ver Historial
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.9)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              ¿Estás seguro de eliminar este tratamiento?
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="cursor-pointer px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteTreatment}
                className="cursor-pointer px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default PatientTreatment;
