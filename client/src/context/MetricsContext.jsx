import { createContext, useContext, useState } from "react";
import {
  getMetricsForDoctor,
  exportDoctorMetricsPDF,
  getMetricsForAdmin,
  exportAdminMetricsExcel,
  exportAdminMetricsCSV,
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
      setDoctorMetrics(data.metrics);
    } catch (err) {
      handleApiError(err, "Error al obtener métricas del doctor", setError);
    }
  };

  const fetchAdminMetrics = async () => {
    try {
      const { data } = await getMetricsForAdmin();
      setAdminMetrics(data.metrics);
    } catch (err) {
      handleApiError(
        err,
        "Error al obtener métricas del administrador",
        setError
      );
    }
  };

  const downloadFile = (data, fileName, type) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportDoctorPDF = async () => {
    try {
      const { data } = await exportDoctorMetricsPDF();
      downloadFile(data, "doctor_metrics.pdf", "application/pdf");
    } catch (err) {
      handleApiError(err, "Error al exportar PDF del doctor", setError);
    }
  };

  const handleExportAdminExcel = async () => {
    try {
      const { data } = await exportAdminMetricsExcel();
      downloadFile(
        data,
        "admin_metrics.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (err) {
      handleApiError(
        err,
        "Error al exportar Excel del administrador",
        setError
      );
    }
  };

  const handleExportAdminCSV = async () => {
    try {
      const { data } = await exportAdminMetricsCSV();
      downloadFile(data, "admin_metrics.csv", "text/csv");
    } catch (err) {
      handleApiError(err, "Error al exportar CSV del administrador", setError);
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
        handleExportDoctorPDF,
        handleExportAdminExcel,
        handleExportAdminCSV,
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
};
