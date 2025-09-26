import { createContext, useContext, useState } from "react";
import {
  exportClinicalDataPDF,
  exportClinicalDataExcel,
  exportClinicalDataCSV,
} from "../api/export";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";
import { format } from "date-fns";

const ExportContext = createContext();

export const useExport = () => useContext(ExportContext);

export const ExportProvider = ({ children }) => {
  const [error, setError] = useState([]);

  useAutoClearErrors(error, setError);

  const downloadFile = (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const buildFileName = (patientId, ext) => {
    const fechaHora = format(new Date(), "ddMMyyyy_HHmm");
    return `paciente_${patientId}_${fechaHora}.${ext}`;
  };

  const handleExportPDF = async (patientId) => {
    try {
      const { data } = await exportClinicalDataPDF(patientId);
      downloadFile(data, buildFileName(patientId, "pdf"), "application/pdf");
    } catch (error) {
      handleApiError(error, "Error al exportar PDF", setError);
    }
  };

  const handleExportExcel = async (patientId) => {
    try {
      const { data } = await exportClinicalDataExcel(patientId);
      downloadFile(
        data,
        buildFileName(patientId, "xlsx"),
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (error) {
      handleApiError(error, "Error al exportar Excel", setError);
    }
  };

  const handleExportCSV = async (patientId) => {
    try {
      const { data } = await exportClinicalDataCSV(patientId);
      downloadFile(data, buildFileName(patientId, "csv"), "text/csv");
    } catch (error) {
      handleApiError(error, "Error al exportar CSV", setError);
    }
  };

  useAutoClearErrors(error, setError);

  return (
    <ExportContext.Provider
      value={{
        handleExportPDF,
        handleExportExcel,
        handleExportCSV,
        error,
      }}
    >
      {children}
    </ExportContext.Provider>
  );
};