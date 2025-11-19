import { createContext, useContext, useState } from "react";
import {
  createAppointment as createAppointmentRequest,
  updateAppointmentStatus as updateAppointmentStatusRequest,
  getAppointmentHistory as getAppointmentHistoryRequest,
  rescheduleAppointment as rescheduleAppointmentRequest,
  deleteAppointment as deleteAppointmentRequest,
  getAppointments,
  updateAppointmentTimes as updateAppointmentTimesRequest,
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
  const [totalAppointments, setTotalAppointments] = useState(0);

  const createAppointment = async (data) => {
    setErrors([]);
    try {
      const res = await createAppointmentRequest(data);
      return res.data;
    } catch (error) {
      handleApiError(error, "Error al crear la cita", setErrors);
    }
  };

  const fetchAppointments = async (filters = {}) => {
    setErrors([]);
    try {
      const res = await getAppointments(filters);
      setAppointments(res.data.appointments);
      setTotalAppointments(res.data.total || 0);
    } catch (error) {
      handleApiError(error, "Error al obtener citas", setErrors);
    }
  };

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

  const fetchAppointmentHistory = async (appointmentId) => {
    setErrors([]);
    try {
      const res = await getAppointmentHistoryRequest(appointmentId);
      setAppointmentHistory(res.data);
    } catch (error) {
      handleApiError(error, "Error al obtener historial de la cita", setErrors);
    }
  };

  const rescheduleAppointment = async (appointmentId, data) => {
    setErrors([]);
    try {
      const res = await rescheduleAppointmentRequest(appointmentId, data);
      setSelectedAppointment(res.data);
      setAppointments((prev) =>
        prev.map((a) => (a._id === appointmentId ? res.data : a))
      );
      return res.data;
    } catch (error) {
      handleApiError(error, "Error al reprogramar la cita", setErrors);
      return null;
    }
  };

  const deleteAppointment = async (appointmentId) => {
    setErrors([]);
    try {
      await deleteAppointmentRequest(appointmentId);
      setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
    } catch (error) {
      handleApiError(error, "Error al eliminar la cita", setErrors);
    }
  };

  const updateAppointmentTimes = async (appointmentId, actionType) => {
    setErrors([]);
    try {
      const res = await updateAppointmentTimesRequest(
        appointmentId,
        actionType
      );
      setSelectedAppointment(res.data);
      setAppointments((prev) =>
        prev.map((a) => (a._id === appointmentId ? res.data : a))
      );
      return res.data;
    } catch (error) {
      handleApiError(
        error,
        "Error al actualizar los tiempos de la cita",
        setErrors
      );
      return null;
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
        updateAppointmentStatus,
        fetchAppointmentHistory,
        rescheduleAppointment,
        deleteAppointment,
        fetchAppointments,
        totalAppointments,
        updateAppointmentTimes,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
