import axios from "./axios";

export const getMyPatients = () => axios.get("/doctor/patients");

export const updatePatientInfo = (patientId, data) =>
  axios.put(`/doctor/patient/${patientId}`, data);
