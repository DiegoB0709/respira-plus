import { createContext, useContext, useState } from "react";
import {
  createOrUpdateClinicalDetails as saveClinicalDetailsRequest,
  getClinicalDetailsByPatient as fetchClinicalDetailsRequest,
} from "../api/clinicalDetails";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

const ClinicalDetailsContext = createContext();

export const useClinicalDetails = () => {
  const context = useContext(ClinicalDetailsContext);
  if (!context) {
    throw new Error(
      "useClinicalDetails solo puede usarse dentro de un ClinicalDetailsProvider"
    );
  }
  return context;
};

export const ClinicalDetailsProvider = ({ children }) => {
  const [clinicalDetails, setClinicalDetails] = useState(null);
  const [errors, setErrors] = useState([]);
  const [updated, setUpdated] = useState(false);

  const saveClinicalDetails = async (patientId, data) => {
    setErrors([]);
    setUpdated(false);
    try {
      const res = await saveClinicalDetailsRequest(patientId, data);
      setClinicalDetails(res.data);
      setUpdated(true);
      return res;
    } catch (error) {
      handleApiError(
        error,
        "Error al guardar los detalles clínicos",
        setErrors
      );
    }
  };

  const fetchClinicalDetails = async (patientId) => {
    setErrors([]);
    setClinicalDetails(null);
    try {
      const res = await fetchClinicalDetailsRequest(patientId);
      setClinicalDetails(res.data);
    } catch (error) {
      handleApiError(
        error,
        "Error al obtener los detalles clínicos",
        setErrors
      );
    }
  };

  useAutoClearErrors(errors, setErrors);

  return (
    <ClinicalDetailsContext.Provider
      value={{
        clinicalDetails,
        errors,
        updated,
        saveClinicalDetails,
        fetchClinicalDetails,
      }}
    >
      {children}
    </ClinicalDetailsContext.Provider>
  );
};
