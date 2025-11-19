import axios from "./axios";

export const createOrUpdateTreatment = (patientId, data) =>
  axios.put(`/treatments/${patientId}`, data);

export const getTreatmentByPatient = (patientId) =>
  axios.get(`/treatments/${patientId}`);

export const getAllTreatmentsForDoctor = () => axios.get("/treatments");

export const deleteTreatment = (patientId) =>
  axios.delete(`/treatments/${patientId}`);

export const getTreatmentHistory = (patientId) =>
  axios.get(`/treatments/history/${patientId}`);

export const recordDailyCompliance = (patientId, data) =>
  axios.post(`/treatments/${patientId}/compliance`, data);

export const finishTreatment = (patientId, data) =>
  axios.put(`/treatments/${patientId}/finish`, data);