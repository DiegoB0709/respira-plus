import { useState } from "react";

function TreatmentGroup({ entries }) {
  const [selectedEntry, setSelectedEntry] = useState(null);

  const translateAction = {
    create: "Creación",
    update: "Actualización",
    delete: "Eliminación",
    finished: "Finalizado",
  };

  const actionIcons = {
    create: "fa-file-medical",
    update: "fa-pen",
    delete: "fa-trash",
    finished: "fa-check-circle",
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const treatmentId = sortedEntries[0].treatment;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 space-y-6 border border-gray-100">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-teal-600 flex flex-row items-center flex-wrap gap-2">
        <span className="flex items-center gap-2">
          <i className="fas fa-notes-medical text-teal-400" />
          Tratamiento ID:
        </span>
        <span className="text-gray-800 font-normal break-all">
          {treatmentId}
        </span>
      </h3>

      <ul className="space-y-4">
        {sortedEntries.map((entry) => {
          const isOpen = selectedEntry?._id === entry._id;

          return (
            <li
              key={entry._id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow transition"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex items-start gap-3 text-sm text-gray-800">
                  <i
                    className={`fas ${
                      actionIcons[entry.action]
                    } text-teal-500 mt-1`}
                  />
                  <div>
                    <p className="font-medium text-teal-600">
                      {translateAction[entry.action]}
                    </p>
                    <p>
                      {formatDate(entry.createdAt)} por{" "}
                      <span className="font-semibold">
                        {entry.doctor?.username || "Desconocido"}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEntry(isOpen ? null : entry)}
                  className="cursor-pointer text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline transition"
                >
                  {isOpen ? "Ocultar detalles" : "Ver detalles"}
                </button>
              </div>

              {isOpen && (
                <div className="mt-4 px-2 text-gray-700 space-y-2 border-t pt-4 text-sm">
                  <p>
                    <strong className="text-teal-600">Inicio:</strong>{" "}
                    {formatDate(entry.treatmentSnapshot.startDate)}
                  </p>
                  <p>
                    <strong className="text-teal-600">Fin:</strong>{" "}
                    {formatDate(entry.treatmentSnapshot.endDate)}
                  </p>
                  <p>
                    <strong className="text-teal-600">Notas:</strong>{" "}
                    {entry.treatmentSnapshot.notes || "-"}
                  </p>
                  <div>
                    <strong className="text-teal-600">Medicamentos:</strong>
                    {entry.treatmentSnapshot.medications.length > 0 ? (
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {entry.treatmentSnapshot.medications.map((med, idx) => (
                          <li key={idx}>
                            <span className="font-medium">{med.name}</span> -{" "}
                            {med.dosage} - {med.frequency}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        Sin medicamentos registrados.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TreatmentGroup;
