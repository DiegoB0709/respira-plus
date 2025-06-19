import axios from "./axios";

export const evaluatePatient = (patientId) =>
  axios.get(`/ai/evaluate/${patientId}`);
