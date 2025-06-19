import axios from "./axios";

export const getMetricsForDoctor = () => axios.get("/metrics/doctor");

export const exportDoctorMetricsPDF = () =>
  axios.get("/metrics/doctor/export/pdf", { responseType: "blob" });

export const getMetricsForAdmin = () => axios.get("/metrics/admin");

export const exportAdminMetricsExcel = () =>
  axios.get("/metrics/admin/export/excel", { responseType: "blob" });

export const exportAdminMetricsCSV = () =>
  axios.get("/metrics/admin/export/csv", { responseType: "blob" });
