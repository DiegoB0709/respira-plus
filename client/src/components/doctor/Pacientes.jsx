import { useEffect, useState, useMemo } from "react";
import ModalContainer from "../common/Modals/ModalContainer";
import RegisterToken from "../common/Modals/RegisterToken";
import { useDoctor } from "../../context/DoctorContext";
import ResponsiveTable from "../common/Table/ResponsiveTable";
import TableRow from "../common/Table/TableRow";
import Card from "../common/Table/Card";
import ActionButton from "../common/Buttons/ActionButton";
import PatientDetails from "./Modal Content/PatientDetails";
import EvaluatePatient from "./Modal Content/EvaluatePatient";
import PatientTreatment from "../common/Modals/PatientTreatment";
import ClinicalData from "../common/Modals/ClinicalData";
import ViewedContent from "./Modal Content/ViewedContent";
import PatientAppointments from "./Modal Content/PatientAppointments";
import ClinicalForm from "./Modal Content/ClinicalForm";
import TreatmentForm from "./Modal Content/TreatmentForm";
import TreatmentsHistory from "../common/Modals/TreatmentsHistory";
import PatientAlerts from "./Modal Content/PatientAlerts";
import UpdateAlert from "./Modal Content/UpdateAlert";
import AppointmentForm from "../common/Modals/AppointmentForm";
import HistoryAppointment from "./Modal Content/HistoryAppointment";
import UpdateStatusAppo from "../common/Modals/UpdateStatusAppo";
import Title from "../Title";
import Input from "../common/Imput/Input";
import Button from "../common/Buttons/Button";
import Toast from "../common/Toast/Toast";

function Pacientes() {
  const {
    patients,
    fetchMyPatients,
    totalPatients,
    setSelectedPatient,
    errors,
  } = useDoctor();

  const [activeModal, setActiveModal] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [alertId, setAlertId] = useState("");
  const [onlyWithToken, setOnlyWithToken] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [filters, setFilters] = useState({
    username: "",
    email: "",
    phone: "",
    page: 1,
    limit: 10,
  });

  const headers = useMemo(() => {
    return onlyWithToken
      ? ["Nombre", "Telefono", "Email", "Token"]
      : ["Nombre", "Telefono", "Email", "Accion"];
  }, [onlyWithToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === "limit" || name === "page" ? parseInt(value) : value,
    }));
  };

  useEffect(() => {
    if (onlyWithToken) {
      setFilters((prev) => ({
        ...prev,
        username: "",
        email: "",
        phone: "",
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        username: "",
        email: "",
        page: 1,
        phone: "",
      }));
    }
  }, [onlyWithToken]);

  useEffect(() => {
    const searchParams = onlyWithToken
      ? { page: filters.page, limit: filters.limit, hasToken: true }
      : { ...filters };

    fetchMyPatients(searchParams);
  }, [filters, onlyWithToken]);

  const fields = [
    {
      type: "text",
      name: "username",
      label: "Nombre",
      icon: "fa-user",
      placeholder: "Ej. Diego Barreto",
      disabled: onlyWithToken,
    },
    {
      type: "text",
      name: "email",
      label: "Email",
      icon: "fa-envelope",
      placeholder: "Ej. correo@ejemplo.com",
      disabled: onlyWithToken,
    },
    {
      type: "number",
      name: "phone",
      label: "Teléfono",
      icon: "fa-phone",
      placeholder: "Ej. 999 999 999",
      disabled: onlyWithToken,
    },
  ];

  return (
    <>
      {errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="p-4 max-w-7xl mx-auto overflow-x-hidden transition-colors duration-300 ease-in-out">
        <Title icon="fa-user-injured" title="Pacientes" />

        <h3 className="text-lg font-semibold text-gray-700 dark:text-neutral-300 mb-2 col-span-full transition-colors duration-300 ease-in-out">
          Filtrar por:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {fields.map((field, i) => (
            <Input
              key={i}
              {...field}
              value={filters[field.name]}
              onChange={handleChange}
            />
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <label
            htmlFor="onlyWithToken"
            className="flex items-center cursor-pointer select-none"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="onlyWithToken"
                checked={onlyWithToken}
                onChange={() => setOnlyWithToken((prev) => !prev)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 dark:bg-neutral-700 rounded-full shadow-inner peer-checked:bg-teal-300 transition-colors duration-300 ease-in-out"></div>
              <div className="absolute top-0 left-0 w-5 h-5 bg-white  rounded-full shadow transform transition-transform duration-300 peer-checked:translate-x-full"></div>
            </div>
            <span className="ml-3 text-sm text-gray-700 dark:text-neutral-300 font-medium transition-colors duration-300 ease-in-out">
              Mostrar tokens de registro
            </span>
          </label>
          <Button
            type="bg1"
            onClick={() => setActiveModal("generator")}
            icon="fa-key"
            label="Generar token de registro"
            full={false}
          />
        </div>

        <ResponsiveTable
          headers={headers}
          data={patients}
          total={totalPatients}
          page={filters.page}
          limit={filters.limit}
          onPageChange={(newPage) =>
            setFilters((prev) => ({ ...prev, page: newPage }))
          }
          onLimitChange={(newLimit) =>
            setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }))
          }
          renderRow={(user) => (
            <TableRow
              key={user._id}
              columns={[
                user.username ?? "No definido / Por definir",
                user.phone ?? "No definido / Por definir",
                user.email ?? "No definido / Por definir",
                ...(user.registrationToken ? [user.registrationToken] : []),
                ...(!user.registrationToken
                  ? [
                      <ActionButton
                        key={`view-${user._id}`}
                        type="info"
                        title="Ver Paciente"
                        onClick={() => {
                          setSelectedPatient(user);
                          setActiveModal("patient");
                        }}
                      />,
                    ]
                  : []),
              ]}
            />
          )}
          renderCard={(user) => (
            <Card
              key={user._id}
              fields={[
                {
                  label: "Nombre",
                  value: user.username ?? "No definido / Por definir",
                },
                {
                  label: "Telefono",
                  value: user.phone ?? "No definido / Por definir",
                },
                {
                  label: "Email",
                  value: user.email ?? "No definido / Por definir",
                },
                ...(user.registrationToken
                  ? [
                      {
                        label: "Token",
                        value: user.registrationToken,
                      },
                    ]
                  : [
                      {
                        label: "Acción",
                        value: (
                          <ActionButton
                            key={`view-${user._id}`}
                            type="info"
                            title="Ver Paciente"
                            onClick={() => {
                              setSelectedPatient(user);
                              setActiveModal("patient");
                            }}
                          />
                        ),
                      },
                    ]),
              ]}
            />
          )}
        />
      </div>

      {activeModal === "generator" && (
        <ModalContainer
          onClose={() => setActiveModal(null)}
          title={"Token de Registro"}
          icon={"fa-key"}
        >
          <RegisterToken patientId={patientId} />
        </ModalContainer>
      )}
      {activeModal === "patient" && (
        <ModalContainer
          onClose={() => setActiveModal(null)}
          title={"Perfil del Paciente"}
          icon={"fa-user-injured"}
        >
          <PatientDetails
            patientId={patientId}
            setPatientId={setPatientId}
            setActiveModal={setActiveModal}
          />
        </ModalContainer>
      )}
      {activeModal === "treatments" && (
        <ModalContainer
          onClose={() => setActiveModal("patient")}
          title="Tratamiento"
          icon="fa-pills"
        >
          <PatientTreatment
            patientId={patientId}
            setActiveModal={setActiveModal}
          />
        </ModalContainer>
      )}
      {activeModal === "treatmentForm" && (
        <ModalContainer
          onClose={() => setActiveModal("treatments")}
          title="Tratamiento"
          icon="fa-notes-medical"
        >
          <TreatmentForm
            patientId={patientId}
            setActiveModal={() => setActiveModal("treatments")}
          />
        </ModalContainer>
      )}
      {activeModal === "treatmentHistory" && (
        <ModalContainer
          onClose={() => setActiveModal("treatments")}
          title="Historial de Tratamientos"
          icon="fa-history"
        >
          <TreatmentsHistory
            patientId={patientId}
            setActiveModal={() => setActiveModal("treatments")}
          />
        </ModalContainer>
      )}
      {activeModal === "clinical" && (
        <ModalContainer
          onClose={() => setActiveModal("patient")}
          title="Datos Clínicos"
          icon="fa-notes-medical"
        >
          <ClinicalData
            patientId={patientId}
            setActiveModal={() => setActiveModal("clinicalForm")}
          />
        </ModalContainer>
      )}
      {activeModal === "clinicalForm" && (
        <ModalContainer
          onClose={() => setActiveModal("clinical")}
          title="Editar Datos Clínicos"
          icon="fa-pen"
        >
          <ClinicalForm
            patientId={patientId}
            setActiveModal={() => setActiveModal("clinical")}
          />
        </ModalContainer>
      )}
      {activeModal === "evaluate" && (
        <ModalContainer
          onClose={() => setActiveModal("patient")}
          title="Evaluar Paciente"
          icon="fa-stethoscope"
        >
          <EvaluatePatient patientId={patientId} />
        </ModalContainer>
      )}
      {activeModal === "educate" && (
        <ModalContainer
          onClose={() => setActiveModal("patient")}
          title="Contenido Visualizado"
          icon="fa-book-open"
        >
          <ViewedContent patientId={patientId} />
        </ModalContainer>
      )}
      {activeModal === "appointments" && (
        <ModalContainer
          onClose={() => setActiveModal("patient")}
          title="Citas Médicas"
          icon="fa-calendar-check"
        >
          <PatientAppointments
            patientId={patientId}
            setActiveModal={setActiveModal}
            setSelectedAppointment={setSelectedAppointment}
          />
        </ModalContainer>
      )}
      {activeModal === "createAppointment" && (
        <ModalContainer
          onClose={() => setActiveModal("appointments")}
          title={"Agendar Cita Médica"}
          icon={"fa-calendar-plus"}
        >
          <AppointmentForm
            setActiveModal={() => setActiveModal("appointments")}
            patientId={patientId}
          />
        </ModalContainer>
      )}
      {activeModal === "editAppointment" && (
        <ModalContainer
          onClose={() => setActiveModal("appointments")}
          title={"Reprogramar  Cita Médica"}
          icon={"fa-calendar-plus"}
        >
          <AppointmentForm
            setActiveModal={() => setActiveModal("appointments")}
            selectedAppointment={selectedAppointment}
          />
        </ModalContainer>
      )}
      {activeModal === "historyAppoint" && (
        <ModalContainer
          onClose={() => setActiveModal("appointments")}
          title={"Historial"}
          icon={"fa-history"}
        >
          <HistoryAppointment selectedAppointment={selectedAppointment} />
        </ModalContainer>
      )}
      {activeModal === "updateAppointStatus" && (
        <ModalContainer
          onClose={() => setActiveModal("appointments")}
          title={"Actualizar Estado"}
          icon={"fa-edit"}
        >
          <UpdateStatusAppo
            selectedAppointment={selectedAppointment}
            activeModal={() => setActiveModal("appointments")}
          />
        </ModalContainer>
      )}
      {activeModal === "alerts" && (
        <ModalContainer
          onClose={() => setActiveModal("patient")}
          title={"Alertas Médicas"}
          icon={"fa-bell"}
        >
          <PatientAlerts
            patientId={patientId}
            setAlertId={setAlertId}
            setActiveModal={setActiveModal}
          />
        </ModalContainer>
      )}
      {activeModal === "UpdateAlert" && (
        <ModalContainer
          onClose={() => setActiveModal("alerts")}
          title={"Actualizar Alerta"}
          icon={"fa-edit"}
        >
          <UpdateAlert setActiveModal={setActiveModal} alertId={alertId} />
        </ModalContainer>
      )}
    </>
  );
}

export default Pacientes;
