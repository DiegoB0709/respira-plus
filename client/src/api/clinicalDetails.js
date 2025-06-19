import axios from "./axios";

export const createOrUpdateClinicalDetails = (patientId, data) =>
  axios.post(`/clinical-details/${patientId}`, data);

export const getClinicalDetailsByPatient = (patientId) =>
  axios.get(`/clinical-details/${patientId}`);
