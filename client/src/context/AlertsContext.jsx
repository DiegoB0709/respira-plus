import { createContext, useContext, useState } from "react";
import {
  getAlertsByDoctor as getAlertsByDoctorRequest,
  getAlertsByPatient as getAlertsByPatientRequest,
  getAlertById as getAlertByIdRequest,
  updateAlertStatus as updateAlertStatusRequest,
} from "../api/alerts";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";


const AlertsContext = createContext();

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts solo puede usarse dentro de un AlertsProvider");
  }
  return context;
};

export const AlertsProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [errors, setErrors] = useState([]);

  const fetchAlertsByDoctor = async () => {
    setErrors([]);
    try {
      const res = await getAlertsByDoctorRequest();
      setAlerts(res.data);
    } catch (error) {
      handleApiError(error, "Error al obtener alertas del doctor", setErrors);
    }
  };

  const fetchAlertsByPatient = async (patientId) => {
    setErrors([]);
    try {
      const res = await getAlertsByPatientRequest(patientId);
      setAlerts(res.data);
    } catch (error) {
      handleApiError(error, "Error al obtener alertas del paciente", setErrors);
    }
  };

  const fetchAlertById = async (alertId) => {
    setErrors([]);
    try {
      const res = await getAlertByIdRequest(alertId);
      setSelectedAlert(res.data);
    } catch (error) {
      handleApiError(
        error,
        "Error al obtener los detalles de la alerta",
        setErrors
      );
    }
  };

  const updateAlertStatus = async (id, status, actionTaken) => {
    setErrors([]);
    try {
      const res = await updateAlertStatusRequest(id, status, actionTaken);
      setSelectedAlert(res.data.alert);
      setAlerts((prev) =>
        prev.map((alert) => (alert._id === id ? res.data.alert : alert))
      );
    } catch (error) {
      handleApiError(
        error,
        "Error al actualizar el estado de la alerta",
        setErrors
      );
    }
  };

  useAutoClearErrors(errors, setErrors);

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        selectedAlert,
        errors,
        fetchAlertsByDoctor,
        fetchAlertsByPatient,
        fetchAlertById,
        updateAlertStatus,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};
