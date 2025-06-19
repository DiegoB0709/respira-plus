import axios from "./axios";

export const getAlertsByDoctor = () => axios.get("/alerts/doctor");

export const getAlertsByPatient = (patientId) =>
  axios.get(`/alerts/patient/${patientId}`);

export const getAlertById = (alertId) => axios.get(`/alerts/${alertId}`);

export const updateAlertStatus = (id, status) =>
  axios.patch(`/alerts/${id}/status`, { status });
