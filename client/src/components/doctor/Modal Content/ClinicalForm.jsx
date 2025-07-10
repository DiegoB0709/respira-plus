import { useState, useEffect } from "react";
import { useClinicalDetails } from "../../../context/ClinicalDetailsContext";

function ClinicalForm({ patientId, setActiveModal }) {
  const { clinicalDetails, saveClinicalDetails } = useClinicalDetails();

  const [form, setForm] = useState({
    weight: "",
    height: "",
    bmi: "",
    diagnosisDate: "",
    bacteriologicalStatus: "",
    treatmentScheme: "",
    phase: "",
    comorbidities: [],
    hivStatus: "",
    smoking: false,
    alcoholUse: false,
    contactWithTb: false,
    priorTbTreatment: false,
    symptoms: [],
    clinicalNotes: "",
    adherenceRisk: "",
  });

  useEffect(() => {
    if (clinicalDetails) {
      setForm({
        ...clinicalDetails,
        diagnosisDate: clinicalDetails.diagnosisDate
          ? new Date(clinicalDetails.diagnosisDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [clinicalDetails]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleMultiSelect = (name, value) => {
    const items = value.split(",").map((v) => v.trim());
    setForm({ ...form, [name]: items });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericForm = {
      ...form,
      weight: parseFloat(form.weight),
      height: parseFloat(form.height),
      bmi: parseFloat(form.bmi),
    };
    saveClinicalDetails(patientId, numericForm);
    setActiveModal();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-teal-500 mb-8 flex flex-col sm:flex-row items-center justify-center gap-2">
        <i className="fa fa-notes-medical text-teal-400 text-3xl sm:text-2xl" />
        <span>Datos Clínicos</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fa fa-weight text-teal-500" /> Peso (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fa fa-ruler-vertical text-teal-500" /> Talla (cm)
            </label>
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fa fa-calculator text-teal-500" /> IMC
            </label>
            <input
              type="number"
              step="0.1"
              name="bmi"
              value={form.bmi}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fa fa-calendar-alt text-blue-500" /> Fecha de
              diagnóstico
            </label>
            <input
              type="date"
              name="diagnosisDate"
              value={form.diagnosisDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fa fa-vials text-purple-500" /> Estado
              bacteriológico
            </label>
            <select
              name="bacteriologicalStatus"
              value={form.bacteriologicalStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Seleccione</option>
              <option value="positivo">Positivo</option>
              <option value="negativo">Negativo</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fa fa-pills text-purple-500" /> Esquema de
              tratamiento
            </label>
            <input
              name="treatmentScheme"
              value={form.treatmentScheme}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fa fa-hourglass-half text-indigo-500" /> Fase
            </label>
            <select
              name="phase"
              value={form.phase}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Seleccione</option>
              <option value="intensiva">Intensiva</option>
              <option value="continuación">Continuación</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <i className="fa fa-virus text-red-500" /> Estado VIH
            </label>
            <select
              name="hivStatus"
              value={form.hivStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Seleccione</option>
              <option value="positivo">Positivo</option>
              <option value="negativo">Negativo</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <i className="fa fa-heartbeat text-rose-500" /> Comorbilidades
          </label>
          <input
            name="comorbidities"
            value={form.comorbidities.join(", ")}
            onChange={(e) => handleMultiSelect("comorbidities", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="smoking"
              checked={form.smoking}
              onChange={handleChange}
              className="text-teal-500"
            />
            <span>
              <i className="fa fa-smoking text-yellow-500" /> Fuma
            </span>
          </label>

          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="alcoholUse"
              checked={form.alcoholUse}
              onChange={handleChange}
              className="text-teal-500"
            />
            <span>
              <i className="fa fa-wine-bottle text-amber-500" /> Consumo de
              alcohol
            </span>
          </label>

          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="contactWithTb"
              checked={form.contactWithTb}
              onChange={handleChange}
              className="text-teal-500"
            />
            <span>
              <i className="fa fa-head-side-mask text-cyan-500" /> Contacto con
              TB
            </span>
          </label>

          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="priorTbTreatment"
              checked={form.priorTbTreatment}
              onChange={handleChange}
              className="text-teal-500"
            />
            <span>
              <i className="fa fa-history text-cyan-500" /> Tratamiento previo
              de TB
            </span>
          </label>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <i className="fa fa-stethoscope text-rose-500" /> Síntomas
          </label>
          <input
            name="symptoms"
            value={form.symptoms.join(", ")}
            onChange={(e) => handleMultiSelect("symptoms", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <i className="fa fa-file-medical-alt text-gray-500" /> Notas
            clínicas
          </label>
          <textarea
            name="clinicalNotes"
            value={form.clinicalNotes}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <i className="fa fa-exclamation-circle text-red-500" /> Riesgo de
            adherencia
          </label>
          <select
            name="adherenceRisk"
            value={form.adherenceRisk}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
          >
            <option value="">Seleccione</option>
            <option value="alto">Alto</option>
            <option value="medio">Medio</option>
            <option value="bajo">Bajo</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="cursor-pointer mt-6 inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2 px-6 rounded shadow text-sm sm:text-base"
          >
            <i className="fa fa-save" /> Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClinicalForm;
