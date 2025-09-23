import axios from "./axios";

export const getMetricsForDoctor = () => axios.get("/metrics/doctor");

export const getMetricsForAdmin = () => axios.get("/metrics/admin");