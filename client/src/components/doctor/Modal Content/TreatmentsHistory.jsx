import { useEffect } from "react";
import { useTreatment } from "../../../context/TreatmentContext";

function TreatmentsHistory({ patientId, setActiveModal }) {
  const { history, fetchTreatmentHistory } = useTreatment();

  useEffect(() => {
    fetchTreatmentHistory(patientId);
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const translateAction = {
    create: "Creación",
    update: "Actualización",
    delete: "Eliminación",
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <header className="sticky top-0 z-50 bg-white w-full">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h2 className="text-base sm:text-xl md:text-2xl font-semibold text-center text-teal-700 flex items-center justify-center gap-2">
            <i className="fa fa-notes-medical text-teal-500 text-lg sm:text-xl" />
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
          {history.map((entry) => (
            <div
              key={entry._id}
              className="bg-white border border-gray-200 rounded-2xl  transition p-5"
            >
              <div className="grid md:grid-cols-2 gap-6 text-sm sm:text-base text-gray-800">
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold text-teal-700">
                      <i className="fa fa-tasks mr-1 text-sm" /> Acción:
                    </span>{" "}
                    {translateAction[entry.action] || entry.action}
                  </p>
                  <p>
                    <span className="font-semibold text-teal-700">
                      <i className="fa fa-calendar-day mr-1 text-sm" /> Fecha:
                    </span>{" "}
                    {formatDate(entry.createdAt)}
                  </p>
                  <p>
                    <span className="font-semibold text-teal-700">
                      <i className="fa fa-user-md mr-1 text-sm" /> Médico:
                    </span>{" "}
                    {entry.doctor?.username || "Desconocido"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p>
                    <span className="font-semibold text-teal-700">
                      <i className="fa fa-play mr-1 text-sm" /> Inicio:
                    </span>{" "}
                    {formatDate(entry.treatmentSnapshot.startDate)}
                  </p>
                  <p>
                    <span className="font-semibold text-teal-700">
                      <i className="fa fa-stop mr-1 text-sm" /> Fin:
                    </span>{" "}
                    {formatDate(entry.treatmentSnapshot.endDate)}
                  </p>
                  <p>
                    <span className="font-semibold text-teal-700">
                      <i className="fa fa-sticky-note mr-1 text-sm" /> Notas:
                    </span>{" "}
                    {entry.treatmentSnapshot.notes || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <h4 className="text-teal-700 font-semibold mb-2 flex items-center gap-2">
                  <i className="fa fa-pills text-sm" /> Medicamentos
                </h4>
                {entry.treatmentSnapshot.medications.length > 0 ? (
                  <ul className="space-y-1 list-disc list-inside text-gray-700 text-sm sm:text-base ml-2">
                    {entry.treatmentSnapshot.medications.map((med, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{med.name}</span> -{" "}
                        {med.dosage} - {med.frequency}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm sm:text-base">
                    Sin medicamentos registrados.
                  </p>
                )}
              </div>
            </div>
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
