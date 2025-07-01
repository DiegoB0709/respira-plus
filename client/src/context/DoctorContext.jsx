import { createContext, useContext, useState } from "react";
import {
  getMyPatients as getMyPatientsRequest,
  updatePatientInfo as updatePatientInfoRequest,
} from "../api/doctor";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

const DoctorContext = createContext();

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error("useDoctor solo puede usarse dentro de un DoctorProvider");
  }
  return context;
};

export const DoctorProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [errors, setErrors] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchMyPatients = async (filters = {}) => {
    setErrors([]);
    try {
      const res = await getMyPatientsRequest(filters);
      setPatients(res.data.patients || []);
      setTotalPatients(res.data.total || 0);
    } catch (error) {
      handleApiError(error, "Error al obtener pacientes asignados", setErrors);
    }
  };

  const updatePatient = async (patientId, data) => {
    setErrors([]);
    try {
      const res = await updatePatientInfoRequest(patientId, data);
      setPatients((prev) =>
        prev.map((p) => (p._id === patientId ? res.data.patient : p))
      );
    } catch (error) {
      handleApiError(
        error,
        "Error al actualizar información del paciente",
        setErrors
      );
    }
  };

  useAutoClearErrors(errors, setErrors);

  return (
    <DoctorContext.Provider
      value={{
        patients,
        selectedPatient,
        setSelectedPatient,
        errors,
        fetchMyPatients,
        updatePatient,
        totalPatients,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};
