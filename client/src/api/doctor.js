import axios from "./axios";

export const getMyPatients = (filters = {}) => { return axios.get("/doctor/patients", { params: filters });}

export const updatePatientInfo = (patientId, data) =>
  axios.put(`/doctor/patient/${patientId}`, data);
