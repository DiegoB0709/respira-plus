import { useState, useMemo, useEffect } from "react";
import { useAppointments } from "../../../context/AppointmentContext";
import { useAuth } from "../../../context/AuthContext";
import ResponsiveTable from "../Table/ResponsiveTable";
import TableRow from "../Table/TableRow";
import Card from "../Table/Card";
import ActionButton from "../Buttons/ActionButton";
import ModalContainer from "../Modals/ModalContainer";
import AppointDetail from "../Modals/AppointDetail";
import UpdateStatusAppo from "../Modals/UpdateStatusAppo";
import AppointmentForm from "../../common/Modals/AppointmentForm";
import HistoryAppointment from "../../doctor/Modal Content/HistoryAppointment";

function CitasMedicas() {
  const { user } = useAuth();
  const { appointments, fetchAppointments, errors, totalAppointments } =
    useAppointments();

  const isDoctor = user?.role === "doctor";

  const statusOptions = ["asistió", "no asistió", "cancelada"];

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

    useEffect(() => {
      fetchAppointments(filters);
    }, []);

  const headers = useMemo(() => {
    return isDoctor
      ? ["Fecha", "Paciente", "Motivo", "Estado", "Acciones"]
      : ["Fecha", "Motivo", "Estado", "Doctor", "Acciones"];
  }, [isDoctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: name === "limit" || name === "page" ? parseInt(value) : value,
      page: 1,
    };
    setFilters(newFilters);
    fetchAppointments(newFilters);
  };

  const handlePageChange = (newPage) => {
    const updated = { ...filters, page: newPage };
    setFilters(updated);
    fetchAppointments(updated);
  };

  const handleLimitChange = (newLimit) => {
    const updated = { ...filters, limit: newLimit, page: 1 };
    setFilters(updated);
    fetchAppointments(updated);
  };

  const filteredAppointments = useMemo(() => {
    if (!filters.status) return appointments;
    return appointments.filter((appt) => appt.status === filters.status);
  }, [appointments, filters.status]);

  const handleAppointmentCreated = () => {
    fetchAppointments(filters);
  };

  const [position, setPosition] = useState(0);

  const options = [
    "Todas",
    "Próximas",
    "Pendientes de confirmación",
    "Solicitadas al doctor",
  ];


  const handleClick = () => {
    const newPosition = (position + 1) % options.length;
    setPosition(newPosition);

    let newFilters = { ...filters, page: 1, status: "" };

    switch (newPosition) {
      case 1:
        newFilters.status = "confirmada";
        break;
      case 2:
        newFilters.status = "pendiente";
        break;
      case 3:
        newFilters.status = "solicitada";
        break;
      default:
        newFilters.status = "";
    }

    setFilters(newFilters);
    fetchAppointments(newFilters);
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

      <div
        className={`grid gap-4 mb-6 ${
          isDoctor ? "sm:grid-cols-4" : "sm:grid-cols-3"
        }`}
      >
        {isDoctor && (
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <i className="fas fa-user text-gray-500"></i>
              Nombre del paciente
            </label>
            <input
              type="text"
              name="patientName"
              value={filters.patientName}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none disabled:bg-gray-100"
              disabled={position !== 0}
            />
          </div>
        )}

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
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none disabled:bg-gray-100"
            disabled={position !== 0}
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
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none disabled:bg-gray-100"
            disabled={position !== 0}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <i className="fas fa-info-circle text-gray-500"></i>
            Estado de la cita
          </label>
          <select
            name="status"
            value={position === 0 ? filters.status : ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none disabled:bg-gray-100"
            disabled={position !== 0}
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
        <div className="flex items-center space-x-2">
          <div
            className="relative w-16 h-5 bg-gray-300 rounded-full cursor-pointer"
            onClick={handleClick}
          >
            <div
              className="absolute top-1/2 left-0 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 -translate-y-1/2"
              style={{
                transform: `translateX(${
                  position * ((64 - 20) / (options.length - 1))
                }px) `,
              }}
            />
          </div>
          <span className="ml-3 text-sm text-gray-700 font-medium">
            {options[position]}
          </span>
        </div>
        <button
          onClick={() => setActiveModal("createAppointment")}
          className="bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-2xl text-sm transition font-bold cursor-pointer inline-flex items-center gap-2"
        >
          <i className="fas fa-plus-circle text-white text-base"></i>
          {isDoctor ? "Crear nueva cita" : "Solicitar una cita"}
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
            columns={
              isDoctor
                ? [
                    new Date(appt.date).toLocaleString("es-PE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }),
                    appt.patient?.username,
                    appt.reason,
                    capitalize(appt.status),
                    <ActionButton
                      key={`view-${appt._id}`}
                      type="view"
                      title="Visualizar"
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setActiveModal("appointDetail");
                      }}
                    />,
                  ]
                : [
                    new Date(appt.date).toLocaleString("es-PE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }),
                    appt.reason,
                    capitalize(appt.status),
                    appt.doctor?.username,
                    <ActionButton
                      key={`view-${appt._id}`}
                      type="view"
                      title="Visualizar"
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setActiveModal("appointDetail");
                      }}
                    />,
                  ]
            }
          />
        )}
        renderCard={(appt) => (
          <Card
            key={appt._id}
            fields={
              isDoctor
                ? [
                    { label: "Fecha", value: formatDate(appt.date) },
                    { label: "Paciente", value: appt.patient?.username },
                    { label: "Motivo", value: appt.reason },
                    { label: "Estado", value: capitalize(appt.status) },
                    {
                      label: "Acción",
                      value: (
                        <ActionButton
                          key={`view-${appt._id}`}
                          type="view"
                          title="Visualizar"
                          onClick={() => {
                            setSelectedAppointment(appt);
                            setActiveModal("appointDetail");
                          }}
                        />
                      ),
                    },
                  ]
                : [
                    { label: "Fecha", value: formatDate(appt.date) },
                    { label: "Motivo", value: appt.reason },
                    { label: "Estado", value: capitalize(appt.status) },
                    { label: "Doctor", value: appt.doctor?.username },
                    {
                      label: "Acción",
                      value: (
                        <ActionButton
                          key={`view-${appt._id}`}
                          type="view"
                          title="Visualizar"
                          onClick={() => {
                            setSelectedAppointment(appt);
                            setActiveModal("appointDetail");
                          }}
                        />
                      ),
                    },
                  ]
            }
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
      {activeModal === "editAppointment" && (
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

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatDate(date) {
  return new Date(date).toLocaleString("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default CitasMedicas;
