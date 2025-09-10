import ClinicalDetails from "../models/clinicalDetails.model.js";
import EducationalContent from "../models/educationalContent.model.js";
import { evaluatePatient } from "./ai.service.js";

export const getRecommendedContent = async (patientId) => {
  const evaluation = await evaluatePatient(patientId);
  const clinical = await ClinicalDetails.findOne({ patient: patientId });

  const conditionsForEducation = new Set();
  if (evaluation.flags.abandono)
    conditionsForEducation.add("riesgo_abandono_alto");
  if (evaluation.flags.resistencia)
    conditionsForEducation.add("posible_resistencia");
  if (evaluation.adherenceLevel === "baja")
    conditionsForEducation.add("adh_baja");
  if (evaluation.dropoutRisk === "alto")
    conditionsForEducation.add("abandono_probable");

  const privateContents = await EducationalContent.find({
    isPublic: false,
    $or: [
      { clinicalTags: { $in: Array.from(conditionsForEducation) } },
      { treatmentStage: clinical?.phase },
      { relatedSymptoms: { $in: clinical?.symptoms || [] } },
    ],
  }).select("title fileType treatmentStage relatedSymptoms clinicalTags");

  return privateContents.map((item) => {
    const reasons = [];
    if (item.clinicalTags.some((tag) => conditionsForEducation.has(tag))) {
      reasons.push("Basado en tus riesgos y adherencia al tratamiento");
    }
    if (item.relatedSymptoms.some((s) => clinical?.symptoms?.includes(s))) {
      reasons.push("Relacionado con tus síntomas actuales");
    }
    if (item.treatmentStage === clinical?.phase) {
      reasons.push("Corresponde a tu fase de tratamiento");
    }
    return {
      _id: item._id,
      title: item.title,
      fileType: item.fileType,
      treatmentStage: item.treatmentStage,
      relatedSymptoms: item.relatedSymptoms,
      razon: reasons.join(", "),
    };
  });
};
