import { useEffect, useState, useMemo } from "react";
import { useAppointments } from "../../context/AppointmentContext";
import ResponsiveTable from "../common/Table/ResponsiveTable";
import TableRow from "../common/Table/TableRow";
import Card from "../common/Table/Card";
import ActionButton from "../common/Buttons/ActionButton";
import ModalContainer from "../common/Modals/ModalContainer";
import AppointDetail from "./Modal Content/AppointDetail";
import UpdateStatusAppo from "./Modal Content/UpdateStatusAppo";
import HistoryAppointment from "./Modal Content/HistoryAppointment";
import AppointmentForm from "./Modal Content/AppointmentForm";

function CitasMedicas() {
  const {
    appointments,
    fetchAppointmentsByDoctor,
    fetchUpcomingAppointments,
    errors,
    totalAppointments,
  } = useAppointments();

  const statusOptions = [
    "",
    "pendiente",
    "confirmada",
    "asistió",
    "no asistió",
    "cancelada",
  ];

  const [onlyUpcoming, setOnlyUpcoming] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    patientName: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const headers = useMemo(() => {
    return ["Fecha", "Paciente", "Motivo", "Estado", "Acciones"];
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: name === "limit" || name === "page" ? parseInt(value) : value,
      page: 1,
    };
    setFilters(newFilters);
    if (!onlyUpcoming) fetchAppointmentsByDoctor(newFilters);
  };

  const handlePageChange = (newPage) => {
    const updated = { ...filters, page: newPage };
    setFilters(updated);
    if (!onlyUpcoming) fetchAppointmentsByDoctor(updated);
  };

  const handleLimitChange = (newLimit) => {
    const updated = { ...filters, limit: newLimit, page: 1 };
    setFilters(updated);
    if (!onlyUpcoming) fetchAppointmentsByDoctor(updated);
  };

  useEffect(() => {
    if (onlyUpcoming) {
      fetchUpcomingAppointments({
        page: filters.page,
        limit: filters.limit,
      });
    } else {
      fetchAppointmentsByDoctor(filters);
    }
  }, [onlyUpcoming, filters.page, filters.limit]);

  const filteredAppointments = useMemo(() => {
    if (!filters.status) return appointments;
    return appointments.filter((appt) => appt.status === filters.status);
  }, [appointments, filters.status]);

  const handleAppointmentCreated = () => {
    if (onlyUpcoming) {
      fetchUpcomingAppointments({
        page: filters.page,
        limit: filters.limit,
      });
    } else {
      fetchAppointmentsByDoctor(filters);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-teal-500 flex items-center gap-3">
        <i className="fas fa-calendar-check text-teal-400 text-2xl"></i>
        Citas Médicas
      </h2>

      <h3 className="text-lg font-semibold text-gray-700 mb-2 col-span-full">
        Filtrar por:
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <i className="fas fa-user text-gray-500"></i>
            Nombre del paciente
          </label>
          <input
            type="text"
            name="patientName"
            placeholder="Ej. Juan Pérez"
            value={filters.patientName}
            onChange={handleChange}
            className="disabled:bg-gray-100 border rounded-lg px-3 py-2 w-full"
            disabled={onlyUpcoming}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <i className="fas fa-calendar-day text-gray-500"></i>
            Desde (fecha de cita)
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="disabled:bg-gray-100 border rounded-lg px-3 py-2 w-full"
            disabled={onlyUpcoming}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <i className="fas fa-calendar-alt text-gray-500"></i>
            Hasta (fecha de cita)
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="disabled:bg-gray-100 border rounded-lg px-3 py-2 w-full"
            disabled={onlyUpcoming}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <i className="fas fa-info-circle text-gray-500"></i>
            Estado de la cita
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="disabled:bg-gray-100 border rounded-lg px-3 py-2 w-full"
            disabled={onlyUpcoming}
          >
            <option value="">Todos los estados</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <label
          htmlFor="onlyUpcoming"
          className="flex items-center cursor-pointer select-none"
        >
          <div className="relative">
            <input
              type="checkbox"
              id="onlyUpcoming"
              checked={onlyUpcoming}
              onChange={() => {
                setOnlyUpcoming((prev) => !prev);
                setFilters((prev) => ({ ...prev, page: 1 }));
              }}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner peer-checked:bg-teal-500 transition-colors duration-300"></div>
            <div className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 peer-checked:translate-x-full"></div>
          </div>
          <span className="ml-3 text-sm text-gray-700 font-medium">
            Ver solo próximas citas
          </span>
        </label>

        <button
          onClick={() => {
            setActiveModal("createAppointment");
          }}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm transition font-bold cursor-pointer inline-flex items-center gap-2"
        >
          <i className="fas fa-plus-circle text-white text-base"></i>
          Crear nueva cita
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-lg">
          <ul className="list-disc list-inside text-sm">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <ResponsiveTable
        headers={headers}
        data={filteredAppointments}
        page={filters.page}
        limit={filters.limit}
        total={totalAppointments}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        renderRow={(appt) => (
          <TableRow
            key={appt._id}
            columns={[
              new Date(appt.date).toLocaleString("es-PE", {
                dateStyle: "medium",
                timeStyle: "short",
              }),
              appt.patient?.username,
              appt.reason,
              appt.status.charAt(0).toUpperCase() + appt.status.slice(1),
              <ActionButton
                key={`view-${appt._id}`}
                type="info"
                title="Ver Detalles"
                onClick={() => {
                  setSelectedAppointment(appt);
                  setActiveModal("appointDetail");
                }}
              />,
            ]}
          />
        )}
        renderCard={(appt) => (
          <Card
            key={appt._id}
            fields={[
              {
                label: "Fecha",
                value: new Date(appt.date).toLocaleString("es-PE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }),
              },
              {
                label: "Paciente",
                value: appt.patient?.username,
              },
              { label: "Motivo", value: appt.reason },
              {
                label: "Estado",
                value:
                  appt.status.charAt(0).toUpperCase() + appt.status.slice(1),
              },
              {
                label: "Acción",
                value: (
                  <ActionButton
                    key={`view-${appt._id}`}
                    type="info"
                    title="Ver Detalles"
                    onClick={() => {
                      setSelectedAppointment(appt);
                      setActiveModal("appointDetail");
                    }}
                  />
                ),
              },
            ]}
          />
        )}
      />
      {activeModal === "createAppointment" && (
        <ModalContainer onClose={() => setActiveModal(null)}>
          <AppointmentForm
            setActiveModal={() => setActiveModal(null)}
            onAppointmentCreated={handleAppointmentCreated}
          />
        </ModalContainer>
      )}
      {activeModal === "appointDetail" && (
        <ModalContainer onClose={() => setActiveModal(null)}>
          <AppointDetail
            selectedAppointment={selectedAppointment}
            setActiveModal={setActiveModal}
            onAppointmentDeleted={handleAppointmentCreated}
          />
        </ModalContainer>
      )}
      {activeModal === "editAppointmen" && (
        <ModalContainer onClose={() => setActiveModal("appointDetail")}>
          <AppointmentForm
            setActiveModal={() => setActiveModal(null)}
            selectedAppointment={selectedAppointment}
          />
        </ModalContainer>
      )}
      {activeModal === "historyAppoint" && (
        <ModalContainer onClose={() => setActiveModal("appointDetail")}>
          <HistoryAppointment selectedAppointment={selectedAppointment} />
        </ModalContainer>
      )}
      {activeModal === "updateAppointStatus" && (
        <ModalContainer onClose={() => setActiveModal("appointDetail")}>
          <UpdateStatusAppo
            selectedAppointment={selectedAppointment}
            activeModal={() => setActiveModal(null)}
          />
        </ModalContainer>
      )}
    </div>
  );
}

export default CitasMedicas;
