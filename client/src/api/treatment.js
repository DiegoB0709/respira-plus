import axios from "./axios";

export const createOrUpdateTreatment = (patientId, data) =>
  axios.put(`/treatments/${patientId}`, data);

export const getTreatmentByPatient = (patientId) =>
  axios.get(`/treatments/${patientId}`);

export const getAllTreatmentsForDoctor = () => axios.get("/treatments");

export const deleteTreatment = (patientId, data) =>
  axios.put(`/treatments/delete/${patientId}`, data);

export const getTreatmentHistory = (patientId) =>
  axios.get(`/treatments/history/${patientId}`);

export const finishTreatment = (patientId, data) =>
  axios.put(`/treatments/${patientId}/finish`, data);

export const recordDailyCompliance = (treatmentId) =>
  axios.post(`/treatments/record/${treatmentId}`);

export const checkDailyCompliance = (treatmentId) =>
  axios.get(`/treatments/check/${treatmentId}`);