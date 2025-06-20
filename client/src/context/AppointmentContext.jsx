import { createContext, useContext, useState } from "react";
import {
  createAppointment as createAppointmentRequest,
  getAppointmentsByPatient as getAppointmentsByPatientRequest,
  getAppointmentsByDoctor as getAppointmentsByDoctorRequest,
  updateAppointmentStatus as updateAppointmentStatusRequest,
  getAppointmentHistory as getAppointmentHistoryRequest,
  rescheduleAppointment as rescheduleAppointmentRequest,
  deleteAppointment as deleteAppointmentRequest,
  getUpcomingAppointmentsForUser as getUpcomingAppointmentsRequest,
} from "../api/appointment";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

const AppointmentContext = createContext();

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointments debe usarse dentro de un AppointmentProvider"
    );
  }
  return context;
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [errors, setErrors] = useState([]);

  // Crear nueva cita
  const createAppointment = async (data) => {
    setErrors([]);
    try {
      const res = await createAppointmentRequest(data);
      return res.data;
    } catch (error) {
      handleApiError(error, "Error al crear la cita", setErrors);
    }
  };

  // Obtener citas por paciente
  const fetchAppointmentsByPatient = async (patientId) => {
    setErrors([]);
    try {
      const res = await getAppointmentsByPatientRequest(patientId);
      setAppointments(res.data);
    } catch (error) {
      handleApiError(error, "Error al obtener citas del paciente", setErrors);
    }
  };

  // Obtener citas por doctor
  const fetchAppointmentsByDoctor = async () => {
    setErrors([]);
    try {
      const res = await getAppointmentsByDoctorRequest();
      setAppointments(res.data);
    } catch (error) {
      handleApiError(error, "Error al obtener citas del doctor", setErrors);
    }
  };

  // Actualizar estado de una cita
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    setErrors([]);
    try {
      const res = await updateAppointmentStatusRequest(
        appointmentId,
        newStatus
      );
      setSelectedAppointment(res.data);
      setAppointments((prev) =>
        prev.map((a) => (a._id === appointmentId ? res.data : a))
      );
    } catch (error) {
      handleApiError(
        error,
        "Error al actualizar el estado de la cita",
        setErrors
      );
    }
  };

  // Obtener historial de una cita
  const fetchAppointmentHistory = async (appointmentId) => {
    setErrors([]);
    try {
      const res = await getAppointmentHistoryRequest(appointmentId);
      setAppointmentHistory(res.data);
    } catch (error) {
      handleApiError(error, "Error al obtener historial de la cita", setErrors);
    }
  };

  // Reprogramar una cita
  const rescheduleAppointment = async (appointmentId, data) => {
    setErrors([]);
    try {
      const res = await rescheduleAppointmentRequest(appointmentId, data);
      setSelectedAppointment(res.data);
      setAppointments((prev) =>
        prev.map((a) => (a._id === appointmentId ? res.data : a))
      );
    } catch (error) {
      handleApiError(error, "Error al reprogramar la cita", setErrors);
    }
  };

  // Eliminar una cita
  const deleteAppointment = async (appointmentId) => {
    setErrors([]);
    try {
      await deleteAppointmentRequest(appointmentId);
      setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
    } catch (error) {
      handleApiError(error, "Error al eliminar la cita", setErrors);
    }
  };

  // Obtener próximas citas del usuario
  const fetchUpcomingAppointments = async () => {
    setErrors([]);
    try {
      const res = await getUpcomingAppointmentsRequest();
      setAppointments(res.data);
    } catch (error) {
      handleApiError(error, "Error al obtener próximas citas", setErrors);
    }
  };

  useAutoClearErrors(errors, setErrors);

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        selectedAppointment,
        appointmentHistory,
        errors,
        createAppointment,
        fetchAppointmentsByPatient,
        fetchAppointmentsByDoctor,
        updateAppointmentStatus,
        fetchAppointmentHistory,
        rescheduleAppointment,
        deleteAppointment,
        fetchUpcomingAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
