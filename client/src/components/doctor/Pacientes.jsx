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
import PatientTreatment from "./Modal Content/PatientTreatment";
import ClinicalData from "./Modal Content/ClinicalData";
import ViewedContent from "./Modal Content/ViewedContent";
import PatientAppointments from "./Modal Content/PatientAppointments";
import ClinicalForm from "./Modal Content/ClinicalForm";
import TreatmentForm from "./Modal Content/TreatmentForm";
import TreatmentsHistory from "./Modal Content/TreatmentsHistory";
import PatientAlerts from "./Modal Content/PatientAlerts";
import UpdateAlert from "./Modal Content/UpdateAlert";
import AppointmentForm from "./Modal Content/AppointmentForm";
import HistoryAppointment from "./Modal Content/HistoryAppointment";
import UpdateStatusAppo from "./Modal Content/UpdateStatusAppo";

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

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto overflow-x-hidden">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-teal-500 flex items-center gap-3">
          <i className="fas fa-user-injured text-teal-400 text-2xl"></i>
          Pacientes
        </h2>

        <h3 className="text-lg font-semibold text-gray-700 mb-2 col-span-full">
          Filtrar por:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <i className="fas fa-user text-gray-500"></i>
              Nombre
            </label>
            <input
              type="text"
              name="username"
              placeholder="Ej. Diego Barreto"
              value={filters.username}
              onChange={handleChange}
              disabled={onlyWithToken}
              className="border rounded-lg px-3 py-2 w-full disabled:bg-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <i className="fas fa-envelope text-gray-500"></i>
              Email
            </label>
            <input
              type="text"
              name="email"
              placeholder="Ej. correo@ejemplo.com"
              value={filters.email}
              onChange={handleChange}
              disabled={onlyWithToken}
              className="border rounded-lg px-3 py-2 w-full disabled:bg-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <i className="fas fa-phone text-gray-500"></i>
              Teléfono
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Ej. 999 999 999"
              value={filters.phone}
              onChange={handleChange}
              disabled={onlyWithToken}
              className="border rounded-lg px-3 py-2 w-full disabled:bg-gray-100"
            />
          </div>
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
              <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner peer-checked:bg-teal-500 transition-colors duration-300"></div>
              <div className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 peer-checked:translate-x-full"></div>
            </div>
            <span className="ml-3 text-sm text-gray-700 font-medium">
              Mostrar tokens de registro
            </span>
          </label>

          <button
            onClick={() => setActiveModal("generator")}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm transition font-bold cursor-pointer inline-flex items-center gap-2"
          >
            <i className="fas fa-key"></i>
            Generar token de registro
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Errores:</h4>
            <ul className="list-disc list-inside text-sm">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

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
        <ModalContainer onClose={() => setActiveModal(null)}>
          <RegisterToken patientId={patientId} />
        </ModalContainer>
      )}
      {activeModal === "patient" && (
        <ModalContainer onClose={() => setActiveModal(null)}>
          <PatientDetails
            patientId={patientId}
            setPatientId={setPatientId}
            setActiveModal={setActiveModal}
          />
        </ModalContainer>
      )}
      {activeModal === "treatments" && (
        <ModalContainer onClose={() => setActiveModal("patient")}>
          <PatientTreatment
            patientId={patientId}
            setActiveModal={setActiveModal}
          />
        </ModalContainer>
      )}
      {activeModal === "treatmentForm" && (
        <ModalContainer onClose={() => setActiveModal("treatments")}>
          <TreatmentForm
            patientId={patientId}
            setActiveModal={() => setActiveModal("treatments")}
          />
        </ModalContainer>
      )}
      {activeModal === "treatmentHistory" && (
        <ModalContainer onClose={() => setActiveModal("treatments")}>
          <TreatmentsHistory
            patientId={patientId}
            setActiveModal={() => setActiveModal("treatments")}
          />
        </ModalContainer>
      )}
      {activeModal === "clinical" && (
        <ModalContainer onClose={() => setActiveModal("patient")}>
          <ClinicalData
            patientId={patientId}
            setActiveModal={() => setActiveModal("clinicalForm")}
          />
        </ModalContainer>
      )}
      {activeModal === "clinicalForm" && (
        <ModalContainer onClose={() => setActiveModal("clinical")}>
          <ClinicalForm
            patientId={patientId}
            setActiveModal={() => setActiveModal("clinical")}
          />
        </ModalContainer>
      )}
      {activeModal === "evaluate" && (
        <ModalContainer onClose={() => setActiveModal("patient")}>
          <EvaluatePatient patientId={patientId} />
        </ModalContainer>
      )}
      {activeModal === "educate" && (
        <ModalContainer onClose={() => setActiveModal("patient")}>
          <ViewedContent patientId={patientId} />
        </ModalContainer>
      )}
      {activeModal === "appointments" && (
        <ModalContainer onClose={() => setActiveModal("patient")}>
          <PatientAppointments
            patientId={patientId}
            setActiveModal={setActiveModal}
            setSelectedAppointment={setSelectedAppointment}
          />
        </ModalContainer>
      )}
      {activeModal === "createAppointment" && (
        <ModalContainer onClose={() => setActiveModal("appointments")}>
          <AppointmentForm
            setActiveModal={() => setActiveModal("appointments")}
            patientId={patientId}
          />
        </ModalContainer>
      )}
      {activeModal === "editAppointment" && (
        <ModalContainer onClose={() => setActiveModal("appointments")}>
          <AppointmentForm
            setActiveModal={() => setActiveModal("appointments")}
            selectedAppointment={selectedAppointment}
          />
        </ModalContainer>
      )}
      {activeModal === "historyAppoint" && (
        <ModalContainer onClose={() => setActiveModal("appointments")}>
          <HistoryAppointment selectedAppointment={selectedAppointment} />
        </ModalContainer>
      )}
      {activeModal === "updateAppointStatus" && (
        <ModalContainer onClose={() => setActiveModal("appointments")}>
          <UpdateStatusAppo
            selectedAppointment={selectedAppointment}
            activeModal={() => setActiveModal("appointments")}
          />
        </ModalContainer>
      )}
      {activeModal === "alerts" && (
        <ModalContainer onClose={() => setActiveModal("patient")}>
          <PatientAlerts
            patientId={patientId}
            setAlertId={setAlertId}
            setActiveModal={setActiveModal}
          />
        </ModalContainer>
      )}
      {activeModal === "UpdateAlert" && (
        <ModalContainer onClose={() => setActiveModal("alerts")}>
          <UpdateAlert setActiveModal={setActiveModal} alertId={alertId} />
        </ModalContainer>
      )}
    </>
  );
}

export default Pacientes;
