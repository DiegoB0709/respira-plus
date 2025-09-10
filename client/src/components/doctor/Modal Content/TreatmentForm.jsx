import { useEffect, useState } from "react";
import { useTreatment } from "../../../context/TreatmentContext";

function TreatmentForm({ patientId, setActiveModal }) {
  const { saveTreatment, treatment, error } = useTreatment();
  const [showSuccess, setShowSuccess] = useState(false);

  const isEditing = !!patientId;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "" },
  ]);

  useEffect(() => {
    if (treatment) {
      setStartDate(
        treatment.startDate ? treatment.startDate.split("T")[0] : ""
      );
      setEndDate(treatment.endDate ? treatment.endDate.split("T")[0] : "");
      setNotes(treatment.notes || "");
      setMedications(
        treatment.medications || [{ name: "", dosage: "", frequency: "" }]
      );
    }
  }, [treatment]);

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "" }]);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanMeds = medications.filter(
      (m) => m.name && m.dosage && m.frequency
    );

    await saveTreatment(patientId, {
      startDate,
      endDate,
      medications: cleanMeds,
      notes,
    });
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setActiveModal();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-teal-500 mb-8 flex items-center justify-center gap-2">
        <i className="fa fa-notes-medical text-teal-400" />
        {treatment ? "Editar Tratamiento" : "Nuevo Tratamiento"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-gray-600 mb-1 block"
            >
              <i className="fa fa-calendar-day text-teal-400 mr-1" />
              Fecha de inicio
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full border border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-2xl px-3 py-2 shadow-sm transition"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-gray-600 mb-1 block"
            >
              <i className="fa fa-calendar-check text-teal-500 mr-1" />
              Fecha de fin
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-2xl px-3 py-2 shadow-sm transition"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="text-sm font-medium text-gray-600 mb-1 block"
          >
            <i className="fa fa-sticky-note text-teal-500 mr-1" />
            Notas
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-xl px-3 py-2 shadow-sm transition"
          />
        </div>

        <fieldset className="border border-teal-200 bg-gray-50 rounded-xl p-4">
          <legend className="text-teal-500 font-semibold text-base flex items-center gap-2">
            <i className="fa fa-pills" />
            Medicamentos
          </legend>
          <div className="space-y-4 mt-4">
            {medications.map((med, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={med.name}
                    onChange={(e) =>
                      handleMedicationChange(i, "name", e.target.value)
                    }
                    required
                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:border-teal-500 focus:ring-teal-500 shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Dosis"
                    value={med.dosage}
                    onChange={(e) =>
                      handleMedicationChange(i, "dosage", e.target.value)
                    }
                    required
                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:border-teal-500 focus:ring-teal-500 shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Frecuencia"
                    value={med.frequency}
                    onChange={(e) =>
                      handleMedicationChange(i, "frequency", e.target.value)
                    }
                    required
                    className="w-full border border-gray-300 rounded-2xl px-3 py-2 focus:border-teal-500 focus:ring-teal-500 shadow-sm"
                  />
                </div>

                {medications.length > 1 && (
                  <div className="flex items-center justify-center sm:justify-end">
                    <button
                      type="button"
                      onClick={() => removeMedication(i)}
                      className="cursor-pointer text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <i className="fa fa-trash" />
                      <span className="hidden sm:inline-block sr-only">
                        Eliminar
                      </span>
                      <span className="inline-block sm:hidden">Eliminar</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addMedication}
            className="cursor-pointer mt-4 text-teal-500 hover:text-teal-400 hover:underline text-sm font-medium flex items-center gap-1"
          >
            <i className="fa fa-plus-circle" />
            Añadir medicamento
          </button>
        </fieldset>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={setActiveModal}
            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-2xl flex items-center gap-2 justify-center shadow-sm transition"
          >
            <i className="fa fa-arrow-left" />
            Volver
          </button>

          <button
            type="submit"
            className="cursor-pointer bg-teal-500 hover:bg-teal-400 text-white font-medium px-6 py-2 rounded-2xl flex items-center gap-2 justify-center shadow-md transition"
          >
            <i className="fa fa-save" />
            Guardar Tratamiento
          </button>
        </div>
      </form>
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600">
                <i className="fas fa-check text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditing
                  ? "¡Tratamiento actualizado!"
                  : "¡Tratamiento registrado!"}
              </h3>
              <p className="text-sm text-gray-500">
                La acción se completó exitosamente.
              </p>
              <button
                onClick={handleCloseSuccess}
                className="cursor-pointer w-full bg-teal-500 hover:bg-teal-400 text-white py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TreatmentForm;
