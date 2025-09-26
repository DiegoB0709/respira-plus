import { useState, useEffect } from "react";
import { useClinicalDetails } from "../../../context/ClinicalDetailsContext";
import Button from "../../common/Buttons/Button";
import Modal from "../../common/Modals/Modal";
import Input from "../../common/Imput/Input";
import Toast from "@/components/common/Toast/Toast";

function ClinicalForm({ patientId, setActiveModal }) {
  const { clinicalDetails, saveClinicalDetails, errors } = useClinicalDetails();
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
    <>
      {errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="p-8 max-w-4xl mx-auto transition-colors duration-300 ease-in-out dark:bg-neutral-900 dark:text-neutral-50">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              type="number"
              name="weight"
              label="Peso (kg)"
              icon="fa-weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="Ingrese el peso"
            />

            <Input
              type="number"
              name="height"
              label="Talla (cm)"
              icon="fa-ruler-vertical"
              value={form.height}
              onChange={handleChange}
              placeholder="Ingrese la talla"
            />

            <Input
              type="number"
              step="0.1"
              name="bmi"
              label="IMC"
              icon="fa-calculator"
              value={form.bmi}
              readOnly
              disabled
            />

            <Input
              type="date"
              name="diagnosisDate"
              label="Fecha de diagnóstico"
              icon="fa-calendar-alt"
              value={form.diagnosisDate}
              onChange={handleChange}
            />

            <Input
              type="select"
              name="bacteriologicalStatus"
              label="Estado bacteriológico"
              icon="fa-vials"
              value={form.bacteriologicalStatus}
              onChange={handleChange}
              options={[
                { value: "positivo", label: "Positivo" },
                { value: "negativo", label: "Negativo" },
              ]}
            />

            <Input
              name="treatmentScheme"
              label="Esquema de tratamiento"
              icon="fa-pills"
              value={form.treatmentScheme}
              onChange={handleChange}
              placeholder="Ingrese el esquema"
            />

            <Input
              type="select"
              name="phase"
              label="Fase"
              icon="fa-hourglass-half"
              value={form.phase}
              onChange={handleChange}
              options={[
                { value: "inicio", label: "Inicio del tratamiento" },
                { value: "intermedio", label: "Etapa intermedia" },
                { value: "final", label: "Etapa final" },
                { value: "indefinido", label: "Indefinido" },
              ]}
            />

            <Input
              type="select"
              name="hivStatus"
              label="Estado VIH"
              icon="fa-virus"
              value={form.hivStatus}
              onChange={handleChange}
              options={[
                { value: "positivo", label: "Positivo" },
                { value: "negativo", label: "Negativo" },
              ]}
            />
          </div>

          <Input
            name="comorbidities"
            label="Comorbilidades"
            icon="fa-heartbeat"
            value={form.comorbidities.join(", ")}
            onChange={(e) => handleMultiSelect("comorbidities", e.target.value)}
            placeholder="Ingrese comorbilidades"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out">
              <input
                type="checkbox"
                name="smoking"
                checked={form.smoking}
                onChange={handleChange}
              />
              <span>
                <i className="fa fa-smoking text-yellow-500" /> Fuma
              </span>
            </label>

            <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out">
              <input
                type="checkbox"
                name="alcoholUse"
                checked={form.alcoholUse}
                onChange={handleChange}
              />
              <span>
                <i className="fa fa-wine-bottle text-amber-500" /> Consumo de
                alcohol
              </span>
            </label>

            <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out">
              <input
                type="checkbox"
                name="contactWithTb"
                checked={form.contactWithTb}
                onChange={handleChange}
              />
              <span>
                <i className="fa fa-head-side-mask text-cyan-500" /> Contacto
                con TB
              </span>
            </label>

            <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out">
              <input
                type="checkbox"
                name="priorTbTreatment"
                checked={form.priorTbTreatment}
                onChange={handleChange}
              />
              <span>
                <i className="fa fa-history text-cyan-500" /> Tratamiento previo
                de TB
              </span>
            </label>
          </div>

          <Input
            name="symptoms"
            label="Síntomas"
            icon="fa-stethoscope"
            value={form.symptoms.join(", ")}
            onChange={(e) => handleMultiSelect("symptoms", e.target.value)}
            placeholder="Ingrese síntomas"
          />

          <Input
            type="textarea"
            name="clinicalNotes"
            label="Notas clínicas"
            icon="fa-file-medical-alt"
            value={form.clinicalNotes}
            onChange={handleChange}
            rows={3}
            placeholder="Ingrese notas clínicas"
          />

          <Input
            type="select"
            name="adherenceRisk"
            label="Riesgo de adherencia"
            icon="fa-exclamation-circle"
            value={form.adherenceRisk}
            onChange={handleChange}
            options={[
              { value: "alto", label: "Alto" },
              { value: "medio", label: "Medio" },
              { value: "bajo", label: "Bajo" },
            ]}
          />

          <div className="text-center">
            <Button
              type="bg1"
              icon="fa-save"
              label="Guardar"
              submit={true}
              full={true}
              classes="mt-6 px-8 py-3 text-sm sm:text-base"
            />
          </div>
        </form>

        {showSuccess && (
          <Modal
            type="success"
            title="¡Datos clínicos guardados!"
            message="La información fue registrada correctamente."
            onSubmit={handleCloseSuccess}
            onClose={handleCloseSuccess}
          />
        )}
      </div>
    </>
  );
}

export default ClinicalForm;
