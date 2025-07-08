import { createContext, useContext, useState, useCallback } from "react";
import {
  createOrUpdateTreatment,
  getTreatmentByPatient,
  getAllTreatmentsForDoctor,
  deleteTreatment,
  getTreatmentHistory,
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
  useAutoClearErrors(setError);

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

  const removeTreatment = useCallback(async (patientId) => {
    try {
      await deleteTreatment(patientId);
      setTreatment(null);
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
      }}
    >
      {children}
    </TreatmentContext.Provider>
  );
};
