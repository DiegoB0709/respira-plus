import axios from "./axios";

export const createAppointment = (data) => axios.post("/appointments", data);

export const getAppointmentsByPatient = (patientId) =>
  axios.get(`/appointments/patient/${patientId}`);

export const getAppointmentsByDoctor = (filters = {}) =>
  axios.get("/appointments/doctor", { params: filters });

export const updateAppointmentStatus = (appointmentId, newStatus) =>
  axios.put(`/appointments/${appointmentId}/status`, { newStatus });

export const getAppointmentHistory = (appointmentId) =>
  axios.get(`/appointments/${appointmentId}/history`);

export const rescheduleAppointment = (appointmentId, data) =>
  axios.put(`/appointments/${appointmentId}/reschedule`, data);

export const deleteAppointment = (appointmentId) =>
  axios.delete(`/appointments/${appointmentId}`);

export const getUpcomingAppointmentsForUser = (filters = {}) =>
  axios.get("/appointments/upcoming", { params: filters });
