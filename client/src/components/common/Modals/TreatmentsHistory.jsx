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
      <header className="sticky top-0 z-50 bg-white w-full">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-center text-teal-500 flex items-center justify-center gap-2">
            <i className="fa fa-notes-medical text-teal-400 text-lg sm:text-xl" />
            <span className="truncate">Historial de Tratamientos</span>
          </h2>
        </div>
      </header>

      {history.length === 0 ? (
        <p className="text-center text-gray-500 text-base sm:text-lg mt-6">
          No hay historial disponible para este paciente.
        </p>
      ) : (
        <div className="space-y-6 mt-4">
          {Object.entries(groupedHistory).map(([treatmentId, entries]) => (
            <TreatmentGroup key={treatmentId} entries={entries} />
          ))}
        </div>
      )}

      <footer className="sticky bottom-0 z-10 bg-white pt-6 mt-6">
        <div className="text-center">
          <button
            onClick={setActiveModal}
            className="inline-flex items-center justify-center gap-2 cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md shadow-sm transition"
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
