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
import Title from "../../Title";
import Input from "../Imput/Input";
import Button from "../Buttons/Button";

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
    isDoctor
      ? "Pendientes de confirmación por el paciente"
      : "Soliciatadas por el doctor",
    isDoctor
      ? "Pendientes de confirmación por el doctor"
      : "Solicitadas al doctor",
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

  const fields = [
    {
      type: "text",
      name: "patientName",
      label: "Nombre del paciente",
      icon: "fa-user",
      placeholder: "Ej. Juan Pérez",
      disabled: position !== 0,
      show: isDoctor,
    },
    {
      type: "date",
      name: "startDate",
      label: "Desde (fecha de cita)",
      icon: "fa-calendar-day",
      disabled: position !== 0,
    },
    {
      type: "date",
      name: "endDate",
      label: "Hasta (fecha de cita)",
      icon: "fa-calendar-alt",
      disabled: position !== 0,
    },
    {
      type: "select",
      name: "status",
      label: "Estado de la cita",
      icon: "fa-info-circle",
      disabled: position !== 0,
      placeholder: "Todos los estados",
      options: statusOptions.map((status) => ({
        value: status,
        label: status.charAt(0).toUpperCase() + status.slice(1),
      })),
    },
  ];


  return (
    <>
      <div className="p-4 max-w-7xl mx-auto overflow-x-hidden transition-colors duration-300 ease-in-out">
        <Title icon="fa-calendar-check" title="Citas Médicas" />

        <h3 className="text-lg font-semibold text-gray-700 dark:text-neutral-50 transition-colors duration-300 ease-in-out mb-2 col-span-full">
          Filtrar por:
        </h3>

        <div
          className={`grid gap-4 mb-6 ${
            isDoctor ? "sm:grid-cols-4" : "sm:grid-cols-3"
          }`}
        >
          {fields
            .filter((f) => f.show === undefined || f.show)
            .map((field, i) => (
              <Input
                key={i}
                {...field}
                value={
                  field.name === "status" && position !== 0
                    ? ""
                    : filters[field.name]
                }
                onChange={handleChange}
              />
            ))}
        </div>

        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <div
              className="relative w-16 h-5 bg-gray-300 dark:bg-neutral-700 rounded-full cursor-pointer transition-colors duration-300 ease-in-out"
              onClick={handleClick}
            >
              <div
                className="absolute top-1/2 left-0 w-5 h-5 bg-white  rounded-full shadow-md transition-all duration-300 -translate-y-1/2"
                style={{
                  transform: `translateX(${
                    position * ((64 - 20) / (options.length - 1))
                  }px) `,
                }}
              />
            </div>
            <span className="ml-3 text-sm text-gray-700 dark:text-neutral-50 font-medium transition-colors duration-300 ease-in-out">
              {options[position]}
            </span>
          </div>
          <Button
            type="bg1"
            onClick={() => setActiveModal("createAppointment")}
            icon="fa-plus-circle"
            label={isDoctor ? "Crear nueva cita" : "Solicitar una cita"}
            full={false}
          />
        </div>

        {errors.length > 0 && (
          <div className="mt-4 bg-red-100 dark:bg-neutral-800 border border-red-300 dark:border-neutral-700 text-red-700 dark:text-neutral-300 p-4 rounded-lg transition-colors duration-300 ease-in-out">
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
      </div>

      {activeModal === "createAppointment" && (
        <ModalContainer
          onClose={() => setActiveModal(null)}
          title={isDoctor ? "Crear nueva cita" : "Solicitar una cita"}
          icon="fa-calendar-plus"
        >
          <AppointmentForm
            setActiveModal={() => setActiveModal(null)}
            onAppointmentCreated={handleAppointmentCreated}
          />
        </ModalContainer>
      )}
      {activeModal === "appointDetail" && (
        <ModalContainer
          onClose={() => setActiveModal(null)}
          title="Detalles de la Cita"
          icon="fa-notes-medical"
        >
          <AppointDetail
            selectedAppointment={selectedAppointment}
            setActiveModal={setActiveModal}
            onAppointmentDeleted={handleAppointmentCreated}
          />
        </ModalContainer>
      )}
      {activeModal === "editAppointment" && (
        <ModalContainer
          onClose={() => setActiveModal("appointDetail")}
          title={"Reprogramar Cita"}
          icon={"fa-edit"}
        >
          <AppointmentForm
            setActiveModal={() => setActiveModal(null)}
            selectedAppointment={selectedAppointment}
          />
        </ModalContainer>
      )}
      {activeModal === "historyAppoint" && (
        <ModalContainer
          onClose={() => setActiveModal("appointDetail")}
          title={"Historial"}
          icon={"fa-history"}
        >
          <HistoryAppointment selectedAppointment={selectedAppointment} />
        </ModalContainer>
      )}
      {activeModal === "updateAppointStatus" && (
        <ModalContainer
          onClose={() => setActiveModal("appointDetail")}
          title={"Actualizar Estado"}
          icon={"fa-edit"}
        >
          <UpdateStatusAppo
            selectedAppointment={selectedAppointment}
            activeModal={() => setActiveModal(null)}
          />
        </ModalContainer>
      )}
    </>
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
