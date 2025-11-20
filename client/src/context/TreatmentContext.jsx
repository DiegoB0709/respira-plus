import { createContext, useContext, useState, useCallback } from "react";
import {
  createOrUpdateTreatment,
  getTreatmentByPatient,
  getAllTreatmentsForDoctor,
  deleteTreatment,
  getTreatmentHistory,
  recordDailyCompliance,
  checkDailyCompliance,
  finishTreatment,
} from "../api/treatment";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

const TreatmentContext = createContext();

export const useTreatment = () => useContext(TreatmentContext);

export const TreatmentProvider = ({ children }) => {
  const [treatment, setTreatment] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState([]);
  const [complianceStatus, setComplianceStatus] = useState(false);

  const fetchTreatmentByPatient = useCallback(async (patientId) => {
    setTreatment(null);
    setError([]);
    try {
      const { data } = await getTreatmentByPatient(patientId);
      setTreatment(data);
    } catch (err) {
      handleApiError(
        err,
        "Error al obtener el tratamiento del paciente",
        setError
      );
    }
  }, []);

  const fetchAllTreatmentsForDoctor = useCallback(async () => {
    setTreatments([]);
    setError([]);
    try {
      const { data } = await getAllTreatmentsForDoctor();
      setTreatments(data);
    } catch (err) {
      handleApiError(
        err,
        "Error al obtener los tratamientos del doctor",
        setError
      );
    }
  }, []);

  const saveTreatment = useCallback(async (patientId, treatmentData) => {
    try {
      const { data } = await createOrUpdateTreatment(patientId, treatmentData);
      setTreatment(data);
    } catch (err) {
      handleApiError(err, "Error al guardar el tratamiento", setError);
    }
  }, []);

  const removeTreatment = useCallback(async (patientId, data) => {
    try {
      await deleteTreatment(patientId, data);
    } catch (err) {
      handleApiError(err, "Error al eliminar el tratamiento", setError);
    }
  }, []);

  const fetchTreatmentHistory = useCallback(async (patientId) => {
    setHistory([]);
    setError([]);
    try {
      const { data } = await getTreatmentHistory(patientId);
      setHistory(data);
    } catch (err) {
      handleApiError(
        err,
        "Error al obtener el historial de tratamientos",
        setError
      );
    }
  }, []);

  const finalizeTreatment = useCallback(async (patientId, finishData) => {
    try {
      const { data } = await finishTreatment(patientId, finishData);
      setTreatment(data);
    } catch (err) {
      handleApiError(
        err,
        "Error al añadir las observaciones finales",
        setError
      );
    }
  }, []);

  const recordCompliance = useCallback(async (treatmentId) => {
    try {
      const { data } = await recordDailyCompliance(treatmentId);
      setComplianceStatus(true);
      return data;
    } catch (err) {
      handleApiError(
        err,
        "Error al registrar el cumplimiento diario",
        setError
      );
    }
  }, []);

  const checkCompliance = useCallback(async (treatmentId) => {
    setError([]);
    try {
      const { data: complied } = await checkDailyCompliance(treatmentId);
      setComplianceStatus(complied);
      return complied;
    } catch (err) {
      handleApiError(
        err,
        "Error al verificar el cumplimiento diario",
        setError
      );
      return false;
    }
  }, []);

  useAutoClearErrors(error, setError);

  return (
    <TreatmentContext.Provider
      value={{
        treatment,
        treatments,
        history,
        error,
        fetchTreatmentByPatient,
        fetchAllTreatmentsForDoctor,
        saveTreatment,
        removeTreatment,
        fetchTreatmentHistory,
        finalizeTreatment,
        recordCompliance,
        checkCompliance,
        complianceStatus,
      }}
    >
      {children}
    </TreatmentContext.Provider>
  );
};
