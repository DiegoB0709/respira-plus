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

  const actionStyles = {
    create: {
      text: "text-emerald-500",
      icon: "text-emerald-400",
      border: "border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50",
    },
    update: {
      text: "text-blue-500",
      icon: "text-blue-400",
      border: "border-blue-200 hover:border-blue-300 hover:bg-blue-50",
    },
    delete: {
      text: "text-rose-500",
      icon: "text-rose-400",
      border: "border-rose-200 hover:border-rose-300 hover:bg-rose-50",
    },
    finished: {
      text: "text-teal-500",
      icon: "text-teal-400",
      border: "border-teal-200 hover:border-teal-300 hover:bg-teal-50",
    },
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

  const treatmentId = sortedEntries[0]?.treatment;

  const translateRole = (role) => {
    switch (role) {
      case "doctor":
        return "Médico";
      case "server":
        return "Servidor";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl space-y-6">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-teal-500 flex items-center gap-2 flex-wrap">
        <i className="fas fa-notes-medical text-teal-400" />
        ID de Tratamiento:{" "}
        <span className="text-gray-800 font-normal break-all">
          {treatmentId}
        </span>
      </h3>

      <ul className="space-y-4">
        {sortedEntries.map((entry) => {
          const isOpen = selectedEntry?._id === entry._id;
          const styles = actionStyles[entry.action] || actionStyles.create;

          return (
            <li
              key={entry._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 gap-3">
                <div className="flex items-start gap-3">
                  <i
                    className={`fas ${actionIcons[entry.action]} ${
                      styles.icon
                    } text-2xl`}
                  />
                  <div>
                    <p className={`font-medium ${styles.text}`}>
                      {translateAction[entry.action]}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(entry.createdAt)} por{" "}
                      <span className="font-semibold">
                        {entry.actionBy?.username || "Desconocido"} (
                        {translateRole(entry.actionBy?.role) || "Desconocido"})
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEntry(isOpen ? null : entry)}
                  className={`cursor-pointer mt-2 sm:mt-0 px-4 py-1 rounded-full border transition-all font-medium text-sm ${styles.text} ${styles.border}`}
                >
                  {isOpen ? "Ocultar" : "Ver"}
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 px-6 ${
                  isOpen ? "max-h-screen py-4" : "max-h-0"
                } text-gray-700 space-y-2 border-t border-gray-100 text-sm`}
              >
                <p>
                  <strong className={styles.text}>Inicio:</strong>{" "}
                  {formatDate(entry.treatmentSnapshot.startDate)}
                </p>
                <p>
                  <strong className={styles.text}>Fin:</strong>{" "}
                  {formatDate(entry.treatmentSnapshot.endDate)}
                </p>
                <p>
                  <strong className={styles.text}>Notas:</strong>{" "}
                  {entry.treatmentSnapshot.notes || "-"}
                </p>
                <div>
                  <strong className={styles.text}>Medicamentos:</strong>
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TreatmentGroup;
