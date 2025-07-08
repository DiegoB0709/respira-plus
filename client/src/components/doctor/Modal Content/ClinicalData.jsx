import { useEffect } from "react";
import { useClinicalDetails } from "../../../context/ClinicalDetailsContext";

function ClinicalData({ patientId, setActiveModal }) {
  const { clinicalDetails, fetchClinicalDetails } = useClinicalDetails();

  useEffect(() => {
    fetchClinicalDetails(patientId);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "No registrado";
    return new Date(dateStr).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const Row = ({ icon, label, value, color = "teal" }) => (
    <div className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-none">
      <i className={`fa ${icon} text-${color}-500 mt-1`} />
      <div className="flex flex-col text-sm sm:text-base">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="text-gray-800">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-teal-500 text-center mb-6 flex items-center justify-center gap-2">
        <i className="fa fa-notes-medical text-teal-400" />
        Datos Clínicos
      </h1>

      {clinicalDetails ? (
        <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-teal-600 font-semibold text-lg border-b pb-1">
              Datos básicos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Row
                icon="fa-weight"
                label="Peso:"
                value={`${clinicalDetails.weight} kg`}
              />
              <Row
                icon="fa-ruler-vertical"
                label="Talla:"
                value={`${clinicalDetails.height} cm`}
              />
              <Row
                icon="fa-calculator"
                label="IMC:"
                value={clinicalDetails.bmi}
              />
              <Row
                icon="fa-calendar-alt"
                label="Fecha de diagnóstico:"
                value={formatDate(clinicalDetails.diagnosisDate)}
                color="blue"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-teal-600 font-semibold text-lg border-b pb-1">
              Estado clínico
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Row
                icon="fa-vials"
                label="Estado bacteriológico:"
                value={clinicalDetails.bacteriologicalStatus}
                color="purple"
              />
              <Row
                icon="fa-pills"
                label="Esquema de tratamiento:"
                value={clinicalDetails.treatmentScheme}
                color="purple"
              />
              <Row
                icon="fa-hourglass-half"
                label="Fase:"
                value={clinicalDetails.phase}
                color="indigo"
              />
              <Row
                icon="fa-stethoscope"
                label="Síntomas:"
                value={clinicalDetails.symptoms?.join(", ") || "Ninguno"}
                color="rose"
              />
              <Row
                icon="fa-exclamation-circle"
                label="Riesgo de adherencia:"
                value={clinicalDetails.adherenceRisk}
                color="red"
              />
              <Row
                icon="fa-file-medical-alt"
                label="Notas clínicas:"
                value={clinicalDetails.clinicalNotes || "Sin notas"}
                color="gray"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-teal-600 font-semibold text-lg border-b pb-1">
              Antecedentes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Row
                icon="fa-heartbeat"
                label="Comorbilidades:"
                value={clinicalDetails.comorbidities?.join(", ") || "Ninguna"}
                color="rose"
              />
              <Row
                icon="fa-virus"
                label="Estado VIH:"
                value={clinicalDetails.hivStatus}
                color="red"
              />
              <Row
                icon="fa-smoking"
                label="Fuma:"
                value={clinicalDetails.smoking ? "Sí" : "No"}
                color="yellow"
              />
              <Row
                icon="fa-wine-bottle"
                label="Consumo de alcohol:"
                value={clinicalDetails.alcoholUse ? "Sí" : "No"}
                color="amber"
              />
              <Row
                icon="fa-head-side-mask"
                label="Contacto con TB:"
                value={clinicalDetails.contactWithTb ? "Sí" : "No"}
                color="cyan"
              />
              <Row
                icon="fa-history"
                label="Tratamiento previo de TB:"
                value={clinicalDetails.priorTbTreatment ? "Sí" : "No"}
                color="cyan"
              />
            </div>
          </div>

          <div className="pt-6 text-center">
            <button
              onClick={setActiveModal}
              className="cursor-pointer inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base py-2 px-5 rounded-md shadow transition"
            >
              <i className="fa fa-pen" />
              Editar Datos Clínicos
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center mt-10 bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600 mb-4">
            No se encontraron datos clínicos registrados para este paciente.
          </p>
          <button
            onClick={setActiveModal}
            className="cursor-pointer inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base py-2 px-5 rounded-md shadow transition"
          >
            <i className="fa fa-plus" />
            Añadir Datos Clínicos
          </button>
        </div>
      )}
    </div>
  );
}

export default ClinicalData;
