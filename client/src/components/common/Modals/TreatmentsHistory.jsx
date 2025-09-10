import { useEffect } from "react";
import { useTreatment } from "../../../context/TreatmentContext";
import TreatmentGroup from "../Treatment/TreatmentGroup";

function TreatmentsHistory({ patientId, setActiveModal }) {
  const { history, fetchTreatmentHistory } = useTreatment();

  useEffect(() => {
    fetchTreatmentHistory(patientId);
  }, []);

  const groupedHistory = history.reduce((acc, entry) => {
    const key = entry.treatment;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  Object.values(groupedHistory).forEach((entries) =>
    entries.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  return (
    <div className="flex flex-col max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm rounded-b-xl">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-teal-500 flex flex-col sm:flex-row items-center justify-center gap-2 break-words">
            <i className="fa fa-notes-medical text-teal-400 text-lg sm:text-xl" />
            <span>Historial de Tratamientos</span>
          </h2>
        </div>
      </header>

      {history.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center text-center bg-gray-50 p-10 rounded-2xl border border-dashed border-gray-300">
          <i className="fa fa-file-medical text-5xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-base sm:text-lg max-w-md">
            No hay historial disponible para este paciente.
          </p>
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          {Object.entries(groupedHistory).map(([treatmentId, entries]) => (
            <div
              key={treatmentId}
              className="bg-white rounded-2xl border border-gray-200 p-5"
            >
              <TreatmentGroup entries={entries} />
            </div>
          ))}
        </div>
      )}

      <footer className="sticky bottom-0 z-10 bg-white/95 backdrop-blur-sm pt-6 mt-8 border-t border-gray-200">
        <div className="text-center">
          <button
            onClick={setActiveModal}
            className="inline-flex items-center justify-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-xl transition-colors"
          >
            <i className="fa fa-arrow-left text-sm" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default TreatmentsHistory;
