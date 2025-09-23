import { createContext, useContext, useState } from "react";
import {
  getMetricsForDoctor,
  getMetricsForAdmin,
} from "../api/metrics";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

const MetricsContext = createContext();

export const useMetrics = () => useContext(MetricsContext);

export const MetricsProvider = ({ children }) => {
  const [doctorMetrics, setDoctorMetrics] = useState(null);
  const [adminMetrics, setAdminMetrics] = useState(null);
  const [error, setError] = useState([]);

  useAutoClearErrors(error, setError);

  const fetchDoctorMetrics = async () => {
    try {
      const { data } = await getMetricsForDoctor();
      setDoctorMetrics(data);
    } catch (err) {
      handleApiError(err, "Error al obtener métricas del doctor", setError);
    }
  };

  const fetchAdminMetrics = async () => {
    try {
      const { data } = await getMetricsForAdmin();
      setAdminMetrics(data);
    } catch (err) {
      handleApiError(
        err,
        "Error al obtener métricas del administrador",
        setError
      );
    }
  };

  return (
    <MetricsContext.Provider
      value={{
        doctorMetrics,
        adminMetrics,
        error,
        fetchDoctorMetrics,
        fetchAdminMetrics,
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
};
