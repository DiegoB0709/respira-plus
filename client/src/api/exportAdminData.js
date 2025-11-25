import axios from "./axios";

export const exportAllData = () =>
  axios.get(`/adminData/`, { responseType: "blob" });

export const exportDataById = (patientId) =>
  axios.get(`/adminData/${patientId}`, { responseType: "blob" });
