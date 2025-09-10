import { useState, useEffect } from "react";
import { useClinicalDetails } from "../../../context/ClinicalDetailsContext";

function ClinicalForm({ patientId, setActiveModal }) {
  const { clinicalDetails, saveClinicalDetails } = useClinicalDetails();
  const [showSuccess, setShowSuccess] = useState(false);

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

  useEffect(() => {
    const weight = parseFloat(form.weight);
    const heightCm = parseFloat(form.height);
    if (!isNaN(weight) && !isNaN(heightCm) && heightCm > 0) {
      const heightM = heightCm / 100;
      const bmi = weight / (heightM * heightM);
      setForm((prev) => ({ ...prev, bmi: bmi.toFixed(1) }));
    } else {
      setForm((prev) => ({ ...prev, bmi: "" }));
    }
  }, [form.weight, form.height]);

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
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setActiveModal();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-teal-500 mb-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <i className="fa fa-notes-medical text-teal-400 text-3xl sm:text-2xl" />
        <span>Datos Clínicos</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <i className="fa fa-weight text-teal-500" /> Peso (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <i className="fa fa-ruler-vertical text-teal-500" /> Talla (cm)
            </label>
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <i className="fa fa-calculator text-teal-500" /> IMC
            </label>
            <input
              type="number"
              step="0.1"
              name="bmi"
              value={form.bmi}
              readOnly
              className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-gray-100 text-gray-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <i className="fa fa-calendar-alt text-blue-500" /> Fecha de
              diagnóstico
            </label>
            <input
              type="date"
              name="diagnosisDate"
              value={form.diagnosisDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <i className="fa fa-vials text-purple-500" /> Estado
              bacteriológico
            </label>
            <select
              name="bacteriologicalStatus"
              value={form.bacteriologicalStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Seleccione</option>
              <option value="positivo">Positivo</option>
              <option value="negativo">Negativo</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <i className="fa fa-pills text-purple-500" /> Esquema de
              tratamiento
            </label>
            <input
              name="treatmentScheme"
              value={form.treatmentScheme}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <i className="fa fa-hourglass-half text-indigo-500" /> Fase
            </label>
            <select
              name="phase"
              value={form.phase}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Seleccione</option>
              <option value="inicio">Inicio del tratamiento</option>
              <option value="intermedio">Etapa intermedia</option>
              <option value="final">Etapa final</option>
              <option value="indefinido">Indefinido</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
              <i className="fa fa-virus text-red-500" /> Estado VIH
            </label>
            <select
              name="hivStatus"
              value={form.hivStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Seleccione</option>
              <option value="positivo">Positivo</option>
              <option value="negativo">Negativo</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
            <i className="fa fa-heartbeat text-rose-500" /> Comorbilidades
          </label>
          <input
            name="comorbidities"
            value={form.comorbidities.join(", ")}
            onChange={(e) => handleMultiSelect("comorbidities", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="smoking"
              checked={form.smoking}
              onChange={handleChange}
              className="text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
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
              className="text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
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
              className="text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
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
              className="text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
            />
            <span>
              <i className="fa fa-history text-cyan-500" /> Tratamiento previo
              de TB
            </span>
          </label>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
            <i className="fa fa-stethoscope text-rose-500" /> Síntomas
          </label>
          <input
            name="symptoms"
            value={form.symptoms.join(", ")}
            onChange={(e) => handleMultiSelect("symptoms", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
            <i className="fa fa-file-medical-alt text-gray-500" /> Notas
            clínicas
          </label>
          <textarea
            name="clinicalNotes"
            value={form.clinicalNotes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
            <i className="fa fa-exclamation-circle text-red-500" /> Riesgo de
            adherencia
          </label>
          <select
            name="adherenceRisk"
            value={form.adherenceRisk}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            className="cursor-pointer mt-6 inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 px-8 rounded-2xl text-sm sm:text-base transition-colors"
          >
            <i className="fa fa-save" /> Guardar
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
                ¡Datos clínicos guardados!
              </h3>
              <p className="text-sm text-gray-500">
                La información fue registrada correctamente.
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

export default ClinicalForm;
