import { createContext, useContext, useState } from "react";
import { evaluatePatient as evaluatePatientRequest } from "../api/ai";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

const AiContext = createContext();

export const useAi = () => {
  const context = useContext(AiContext);
  if (!context) {
    throw new Error("useAi solo puede usarse dentro de un AiProvider");
  }
  return context;
};

export const AiProvider = ({ children }) => {
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [clinicalSummary, setClinicalSummary] = useState(null);

  const evaluate = async (patientId) => {
    setErrors([]);
    setEvaluationResult(null);
    setClinicalSummary(null);

    try {
      const res = await evaluatePatientRequest(patientId);
      setEvaluationResult(res.data.evaluation);
      setClinicalSummary(res.data.clinicalSummary);
    } catch (error) {
      handleApiError(error, "Error al evaluar al paciente", setErrors);
    }
  };

  useAutoClearErrors(errors, setErrors);

  return (
    <AiContext.Provider
      value={{
        evaluate,
        evaluationResult,
        clinicalSummary,
        errors,
      }}
    >
      {children}
    </AiContext.Provider>
  );
};
