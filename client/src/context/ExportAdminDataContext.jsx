import { createContext, useContext, useState } from "react";
import { exportAllData, exportDataById } from "../api/exportAdminData";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";
import { format } from "date-fns";

const ExportAdminDataContext = createContext();

export const useExportAdminData = () => useContext(ExportAdminDataContext);

export const ExportAdminDataProvider = ({ children }) => {
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

  const buildFileName = (prefix, ext) => {
    const fechaHora = format(new Date(), "ddMMyyyy_HHmm");
    return `${prefix}_${fechaHora}.${ext}`;
  };

  const handleExportAllPDF = async () => {
    try {
      const { data } = await exportAllData();
      downloadFile(
        data,
        buildFileName("resumen_general", "pdf"),
        "application/pdf"
      );
    } catch (err) {
      handleApiError(err, "Error al exportar PDF general", setError);
    }
  };

  const handleExportByIdPDF = async (patientId) => {
    try {
      const { data } = await exportDataById(patientId);
      downloadFile(
        data,
        buildFileName(`resumen_individual-${patientId}`, "pdf"),
        "application/pdf"
      );
    } catch (err) {
      handleApiError(
        err,
        `Error al exportar PDF paciente ${patientId}`,
        setError
      );
    }
  };

  return (
    <ExportAdminDataContext.Provider
      value={{
        handleExportAllPDF,
        handleExportByIdPDF,
        error,
      }}
    >
      {children}
    </ExportAdminDataContext.Provider>
  );
};
