import { useEffect } from "react";
import { useClinicalDetails } from "../../../context/ClinicalDetailsContext";
import { useAuth } from "../../../context/AuthContext";
import Button from "../Buttons/Button";
import Toast from "../Toast/Toast";

function ClinicalData({ patientId, setActiveModal }) {
  const { clinicalDetails, fetchClinicalDetails, errors } =
    useClinicalDetails();
  const { user } = useAuth();

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

  const Row = ({ icon, label, value, color = "text-teal-400" }) => {
    return (
      <div className="flex items-start gap-3 py-3">
        <i className={`fa ${icon} text-base mt-1 ${color}`} />
        <div className="flex flex-col">
          <span className="text-sm dark:text-gray-300 text-gray-700 font-medium">
            {label}
          </span>
          <span className="text-base dark:text-white text-gray-900">
            {value}
          </span>
        </div>
      </div>
    );
  };

  const Section = ({ title, children }) => (
    <div className="dark:bg-neutral-800 bg-white rounded-xl shadow-md p-6 space-y-4 transition-colors">
      <h2 className="relative font-semibold text-lg pb-1 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
        {title}
        <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-teal-400 to-cyan-500"></span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
    </div>
  );

  return (
    <>
      {errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}

      <div className="px-4 sm:p-6 max-w-4xl mx-auto">
        {clinicalDetails ? (
          <div className="space-y-6">
            <Section title="Datos básicos">
              <Row
                icon="fa-weight"
                label="Peso:"
                value={`${clinicalDetails.weight} kg`}
                color="text-teal-400"
              />
              <Row
                icon="fa-ruler-vertical"
                label="Talla:"
                value={`${clinicalDetails.height} cm`}
                color="text-teal-400"
              />
              <Row
                icon="fa-calculator"
                label="IMC:"
                value={clinicalDetails.bmi}
                color="text-teal-400"
              />
              <Row
                icon="fa-calendar-alt"
                label="Fecha de diagnóstico:"
                value={formatDate(clinicalDetails.diagnosisDate)}
                color="text-blue-400"
              />
            </Section>

            <Section title="Estado clínico">
              <Row
                icon="fa-vials"
                label="Estado bacteriológico:"
                value={clinicalDetails.bacteriologicalStatus}
                color="text-purple-400"
              />
              {user.role === "doctor" && (
                <Row
                  icon="fa-pills"
                  label="Esquema de tratamiento:"
                  value={clinicalDetails.treatmentScheme}
                  color="text-purple-400"
                />
              )}
              <Row
                icon="fa-hourglass-half"
                label="Fase:"
                value={clinicalDetails.phase}
                color="text-indigo-400"
              />
              <Row
                icon="fa-stethoscope"
                label="Síntomas:"
                value={clinicalDetails.symptoms?.join(", ") || "Ninguno"}
                color="text-rose-400"
              />
              {user.role === "doctor" && (
                <Row
                  icon="fa-exclamation-circle"
                  label="Riesgo de adherencia:"
                  value={clinicalDetails.adherenceRisk}
                  color="text-red-400"
                />
              )}
              <Row
                icon="fa-file-medical-alt"
                label="Notas clínicas:"
                value={clinicalDetails.clinicalNotes || "Sin notas"}
                color="text-gray-400"
              />
            </Section>

            <Section title="Antecedentes clínicos">
              <Row
                icon="fa-heartbeat"
                label="Comorbilidades:"
                value={clinicalDetails.comorbidities?.join(", ") || "Ninguna"}
                color="text-rose-400"
              />
              <Row
                icon="fa-virus"
                label="Estado VIH:"
                value={clinicalDetails.hivStatus}
                color="text-red-400"
              />
              <Row
                icon="fa-smoking"
                label="Fuma:"
                value={clinicalDetails.smoking ? "Sí" : "No"}
                color="text-yellow-400"
              />
              <Row
                icon="fa-wine-bottle"
                label="Consumo de alcohol:"
                value={clinicalDetails.alcoholUse ? "Sí" : "No"}
                color="text-amber-400"
              />
              <Row
                icon="fa-head-side-mask"
                label="Contacto con TB:"
                value={clinicalDetails.contactWithTb ? "Sí" : "No"}
                color="text-cyan-400"
              />
              <Row
                icon="fa-history"
                label="Tratamiento previo de TB:"
                value={clinicalDetails.priorTbTreatment ? "Sí" : "No"}
                color="text-cyan-400"
              />
            </Section>

            {user.role === "doctor" && (
              <div className="pt-4">
                <Button
                  onClick={setActiveModal}
                  type="bg1"
                  icon="fa-pen"
                  label="Editar Datos Clínicos"
                  full={true}
                  classes={"text-base"}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center text-center dark:bg-neutral-800 bg-white p-10 rounded-xl shadow-md">
            <i className="fa fa-notes-medical text-5xl dark:text-gray-400 text-gray-600 mb-4" />
            <p className="dark:text-gray-300 text-gray-700 text-lg mb-6 max-w-md">
              No se encontraron datos clínicos registrados para este paciente.
            </p>
            {user.role === "doctor" && (
              <Button
                onClick={setActiveModal}
                type="bg1"
                icon="fa-plus"
                label="Añadir Datos Clínicos"
                full={true}
                classes={"mt-4 px-8 py-3 text-sm sm:text-base"}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ClinicalData;
