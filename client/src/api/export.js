import axios from "./axios";

export const exportClinicalDataExcel = (patientId) =>
  axios.get(`/export/excel/${patientId}`, { responseType: "blob" });

export const exportClinicalDataPDF = (patientId) =>
  axios.get(`/export/pdf/${patientId}`, { responseType: "blob" });

export const exportClinicalDataCSV = (patientId) =>
  axios.get(`/export/csv/${patientId}`, { responseType: "blob" });
