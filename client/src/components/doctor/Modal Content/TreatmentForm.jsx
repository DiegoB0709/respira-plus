import { useEffect, useState } from "react";
import { useTreatment } from "../../../context/TreatmentContext";
import Input from "../../common/Imput/Input";
import Button from "../../common/Buttons/Button";
import Modal from "../../common/Modals/Modal";
import Toast from "@/components/common/Toast/Toast";

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
  const [isRecurrence, setIsRecurrence] = useState(false);
  const [recurrenceReason, setRecurrenceReason] = useState("");

  useEffect(() => {
    if (treatment && treatment.status !== "Finalizado") {
      setStartDate(
        treatment.startDate ? treatment.startDate.split("T")[0] : ""
      );
      setEndDate(treatment.endDate ? treatment.endDate.split("T")[0] : "");
      setNotes(treatment.notes || "");
      setMedications(
        treatment.medications || [{ name: "", dosage: "", frequency: "" }]
      );
      setIsRecurrence(treatment.isRecurrence || false);
      setRecurrenceReason(treatment.recurrenceReason || "");
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

  const handleRecurrenceChange = (e) => {
    const checked = e.target.checked;
    setIsRecurrence(checked);
    if (!checked) setRecurrenceReason("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanMeds = medications.filter(
      (m) => m.name && m.dosage && m.frequency
    );

    const payload = {
      startDate,
      endDate,
      medications: cleanMeds,
      notes,
      isRecurrence,
      recurrenceReason: isRecurrence ? recurrenceReason : "",
    };

    await saveTreatment(patientId, payload);
    setShowSuccess(true);
  };

 const handleCloseSuccess = () => {
   setShowSuccess(false);
   setActiveModal();

   setStartDate("");
   setEndDate("");
   setNotes("");
   setMedications([{ name: "", dosage: "", frequency: "" }]);
   setIsRecurrence(false);
   setRecurrenceReason("");
 };

  return (
    <>
      {error.length > 0 &&
        error.map((e, i) => <Toast key={i} type="error" message={e} />)}

      <div className="max-w-3xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              type="date"
              name="startDate"
              label="Fecha de inicio"
              icon="fa-calendar-day"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />

            <Input
              type="date"
              name="endDate"
              label="Fecha de fin"
              icon="fa-calendar-check"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Input
            type="textarea"
            name="notes"
            label="Notas"
            icon="fa-sticky-note"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />

          <fieldset className="border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 space-y-4">
            <legend className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent font-semibold text-base flex items-center gap-2">
              <i className="fa fa-redo bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent" />
              Reincidencia
            </legend>

            <label className="flex items-center gap-3 cursor-pointer select-none relative">
              <input
                id="isRecurrence"
                type="checkbox"
                checked={isRecurrence}
                onChange={handleRecurrenceChange}
                className="
        peer h-5 w-5 appearance-none rounded-md
        border border-gray-300 dark:border-neutral-600
        bg-white dark:bg-neutral-700
        checked:bg-cyan-600 checked:border-cyan-600
        transition-all duration-200
        focus:ring-2 focus:ring-cyan-500
      "
              />

              <span
                className="
        pointer-events-none absolute left-0 top-1/2 -translate-y-1/2
        flex items-center justify-center h-5 w-5
        text-white text-xs font-bold
        opacity-0 peer-checked:opacity-100
        transition-opacity duration-150
      "
              >
                ✓
              </span>

              <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                ¿Es una reincidencia?
              </span>
            </label>

            <div
              className={`
      transition-all duration-300
      ${
        isRecurrence
          ? "opacity-100 max-h-40 mt-2"
          : "opacity-0 max-h-0 overflow-hidden"
      }
    `}
            >
              <div className="p-2 rounded-lg bg-white dark:bg-neutral-800">
                <Input
                  type="textarea"
                  name="recurrenceReason"
                  label="Razón de la reincidencia"
                  icon="fa-redo"
                  value={recurrenceReason}
                  onChange={(e) => setRecurrenceReason(e.target.value)}
                  required={isRecurrence}
                  rows={2}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 rounded-xl p-4">
            <legend className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent font-semibold text-base flex items-center gap-2">
              <i className="fa fa-pills bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent" />
              Medicamentos
            </legend>

            <div className="space-y-4 mt-4">
              {medications.map((med, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      type="text"
                      placeholder="Nombre"
                      value={med.name}
                      onChange={(e) =>
                        handleMedicationChange(i, "name", e.target.value)
                      }
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Dosis"
                      value={med.dosage}
                      onChange={(e) =>
                        handleMedicationChange(i, "dosage", e.target.value)
                      }
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Frecuencia"
                      value={med.frequency}
                      onChange={(e) =>
                        handleMedicationChange(i, "frequency", e.target.value)
                      }
                      required
                    />
                  </div>

                  {medications.length > 1 && (
                    <div className="flex items-center justify-center sm:justify-end">
                      <Button
                        type="alert"
                        icon="fa-trash"
                        onClick={() => removeMedication(i)}
                        full={false}
                        classes="text-sm px-4 py-4 rounded-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="bg3"
              icon="fa-plus-circle"
              label="Añadir medicamento"
              onClick={addMedication}
              full={false}
              classes="mt-4 text-sm font-medium"
            />
          </fieldset>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button
              type="back"
              icon="fa-arrow-left"
              label="Volver"
              onClick={setActiveModal}
              full={false}
              classes="px-6 py-2"
            />
            <Button
              type="bg1"
              icon="fa-save"
              label="Guardar"
              submit={true}
              full={false}
              classes="px-6 py-2"
            />
          </div>
        </form>

        {showSuccess && (
          <Modal
            type="success"
            title={
              isEditing
                ? "¡Tratamiento actualizado!"
                : "¡Tratamiento registrado!"
            }
            message="La acción se completó exitosamente."
            onSubmit={handleCloseSuccess}
          />
        )}
      </div>
    </>
  );
}

export default TreatmentForm;
