import { useEffect, useState } from "react";
import { useTreatment } from "../../../context/TreatmentContext";
import { useAuth } from "../../../context/AuthContext";

function PatientTreatment({ patientId, setActiveModal }) {
  const { treatment, fetchTreatmentByPatient, removeTreatment } =
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-teal-500 mb-6 flex flex-col items-center justify-center gap-2">
        <i className="fas fa-user-md text-teal-400 text-3xl sm:text-4xl" />
        <span>Tratamiento del Paciente</span>
      </h1>

      {treatment ? (
        <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm sm:text-base">
            <p className="flex items-center gap-3">
              <i className="fas fa-calendar-alt text-teal-400 text-lg" />
              <span>
                <span className="font-semibold text-teal-500">Inicio:</span>{" "}
                {new Date(treatment.startDate).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <p className="flex items-center gap-3">
              <i className="fas fa-calendar-check text-teal-400 text-lg" />
              <span>
                <span className="font-semibold text-teal-500">Fin:</span>{" "}
                {new Date(treatment.endDate).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <p className="flex items-start gap-3 sm:col-span-2">
              <i className="fas fa-sticky-note text-teal-400 text-lg pt-1" />
              <span>
                <span className="font-semibold text-teal-500">Notas:</span>{" "}
                {treatment.notes || "Sin notas registradas."}
              </span>
            </p>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold text-teal-500 mb-3 flex items-center gap-2">
              <i className="fas fa-pills" />
              Medicamentos
            </h4>
            <ul className="flex flex-wrap gap-2">
              {treatment.medications.map((med, index) => (
                <li
                  key={index}
                  className="px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-sm font-medium border border-teal-200"
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
            } gap-3 pt-4`}
          >
            {user.role === "doctor" && (
              <>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="cursor-pointer flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium px-5 py-2 rounded-xl transition-colors"
                >
                  <i className="fas fa-trash-alt text-sm" />
                  Eliminar
                </button>
                <button
                  onClick={() => setActiveModal("treatmentForm")}
                  className="cursor-pointer flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium px-5 py-2 rounded-xl transition-colors"
                >
                  <i className="fas fa-edit text-sm" />
                  Editar
                </button>
              </>
            )}
            <button
              onClick={() => setActiveModal("treatmentHistory")}
              className={`cursor-pointer flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-xl transition-colors ${
                user.role !== "doctor" ? "w-full justify-center" : ""
              }`}
            >
              <i className="fas fa-history text-sm" />
              Historial
            </button>
          </div>
        </section>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center text-center bg-gray-50 p-10 rounded-2xl border border-dashed border-gray-300">
          <i className="fa fa-pills text-5xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-6 max-w-md">
            No se encontraron tratamientos registrados para este paciente.
          </p>

          <div
            className={`flex ${
              user.role === "doctor" ? "flex-col sm:flex-row" : "flex-col"
            } justify-center gap-4 w-full sm:w-auto`}
          >
            {user.role === "doctor" && (
              <button
                onClick={() => setActiveModal("treatmentForm")}
                className="cursor-pointer flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Añadir Tratamiento
              </button>
            )}

            <button
              onClick={() => setActiveModal("treatmentHistory")}
              className={`cursor-pointer flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-xl transition-colors ${
                user.role !== "doctor" ? "w-full" : ""
              }`}
            >
              Ver Historial
            </button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="p-6 flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
                <i className="fas fa-exclamation-triangle text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                ¿Estás seguro de eliminar este tratamiento?
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex w-full gap-3 pt-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="cursor-pointer w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteTreatment}
                  className="cursor-pointer w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default PatientTreatment;
