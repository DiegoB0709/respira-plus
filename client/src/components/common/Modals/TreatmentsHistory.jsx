import { useEffect } from "react";
import { useTreatment } from "../../../context/TreatmentContext";
import TreatmentGroup from "../Treatment/TreatmentGroup";
import Toast from "../Toast/Toast";

function TreatmentsHistory({ patientId, setActiveModal }) {
  const { history, fetchTreatmentHistory, error } = useTreatment();

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
    <>
      {error.length > 0 &&
        error.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="flex flex-col max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {history.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-neutral-800 transition-colors duration-300 ease-in-out p-10 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700">
            <i className="fa fa-file-medical text-5xl text-gray-400 dark:text-neutral-400 transition-colors duration-300 ease-in-out mb-4" />
            <p className="text-gray-600 dark:text-neutral-300 transition-colors duration-300 ease-in-out text-base sm:text-lg max-w-md">
              No hay historial disponible para este paciente.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {Object.entries(groupedHistory).map(([treatmentId, entries]) => (
              <div
                key={treatmentId}
                className="bg-gray-50/5 dark:bg-neutral-800 transition-colors duration-300 ease-in-out rounded-2xl border border-gray-200 dark:border-neutral-700 p-5"
              >
                <TreatmentGroup entries={entries} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default TreatmentsHistory;
