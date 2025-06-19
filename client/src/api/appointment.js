import axios from "./axios";

export const createAppointment = (data) => axios.post("/appointments", data);

export const getAppointmentsByPatient = (patientId) =>
  axios.get(`/appointments/patient/${patientId}`);

export const getAppointmentsByDoctor = () => axios.get("/appointments/doctor");

export const updateAppointmentStatus = (appointmentId, status) =>
  axios.put(`/appointments/${appointmentId}/status`, { status });

export const getAppointmentHistory = (appointmentId) =>
  axios.get(`/appointments/${appointmentId}/history`);

export const rescheduleAppointment = (appointmentId, data) =>
  axios.put(`/appointments/${appointmentId}/reschedule`, data);

export const deleteAppointment = (appointmentId) =>
  axios.delete(`/appointments/${appointmentId}`);

export const getUpcomingAppointmentsForUser = () =>
  axios.get("/appointments/upcoming");
