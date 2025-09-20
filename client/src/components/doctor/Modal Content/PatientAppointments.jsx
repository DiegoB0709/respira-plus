import { useEffect, useState } from "react";
import { useAppointments } from "../../../context/AppointmentContext";
import Button from "../../common/Buttons/Button";
import Modal from "../../common/Modals/Modal";

function PatientAppointments({
  patientId,
  setActiveModal,
  setSelectedAppointment,
}) {
  const { appointments, fetchAppointments, deleteAppointment, errors } =
    useAppointments();

  const [showConfirm, setShowConfirm] = useState(false);
  const [apptID, setApptID] = useState(null);

  useEffect(() => {
    const filters = {
      patientId: patientId,
      page: 1,
      limit: 1000,
    };

    fetchAppointments(filters);
  }, [patientId]);

  const handleDelete = async () => {
    await deleteAppointment(apptID);
    setShowConfirm(false);
    setActiveModal("appointments");
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const priority = (status) => {
      const s = status?.toLowerCase();
      if (s === "solicitada") return 1;
      if (s === "confirmada") return 2;
      if (s === "pendiente") return 3;
      return 4;
    };
    const aPriority = priority(a.status);
    const bPriority = priority(b.status);
    if (aPriority !== bPriority) return aPriority - bPriority;
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    if (aDate < bDate) return -1;
    if (aDate > bDate) return 1;
    return 0;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto transition-colors duration-300 ease-in-out">
      {errors.length > 0 && (
        <div className="mb-6 bg-red-100 dark:bg-neutral-800 border border-red-300 dark:border-neutral-700 text-red-700 dark:text-red-400 p-4 rounded-xl transition-colors duration-300 ease-in-out">
          {errors.map((err, i) => (
            <p key={i} className="text-sm">
              {err}
            </p>
          ))}
        </div>
      )}

      {sortedAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-gray-50 dark:bg-neutral-800 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700 transition-colors duration-300 ease-in-out">
          <i className="fa fa-calendar-alt text-5xl text-gray-400 dark:text-neutral-400 mb-4" />
          <p className="text-gray-600 dark:text-neutral-300 text-lg mb-6 max-w-md leading-relaxed transition-colors duration-300 ease-in-out">
            El paciente aún no tiene citas médicas registradas
          </p>
          <Button
            type="bg1"
            icon="fa-calendar-plus"
            label="Agendar Cita Médica"
            onClick={() => setActiveModal("createAppointment")}
          />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <Button
              type="bg1"
              icon="fa-calendar-plus"
              label="Agendar Cita Médica"
              onClick={() => setActiveModal("createAppointment")}
            />
          </div>

          <div className="space-y-5">
            {sortedAppointments.map((appt) => {
              const status = appt.status?.toLowerCase();
              const canDelete =
                status === "pendiente" ||
                status === "confirmada" ||
                status === "solicitada";

              return (
                <div
                  key={appt._id}
                  className="border border-gray-200 dark:border-neutral-700 rounded-2xl p-5 bg-white dark:bg-neutral-800 shadow-sm transition hover:shadow-lg transition-colors duration-300 ease-in-out"
                >
                  <div className="space-y-2 text-sm sm:text-base text-gray-800 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
                    <p>
                      <i className="fa fa-calendar-alt bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mr-2" />
                      <span className="font-semibold text-teal-400">
                        Fecha:
                      </span>{" "}
                      {new Date(appt.date).toLocaleString()}
                    </p>
                    <p>
                      <i className="fa fa-comment-medical bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mr-2" />
                      <span className="font-semibold text-teal-400">
                        Motivo:
                      </span>{" "}
                      {appt.reason}
                    </p>
                    <p>
                      <i className="fa fa-clipboard-check bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mr-2" />
                      <span className="font-semibold text-teal-400">
                        Estado:
                      </span>{" "}
                      {appt.status}
                    </p>
                    <p>
                      <i className="fa fa-user-md bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mr-2" />
                      <span className="font-semibold text-teal-400">
                        Doctor:
                      </span>{" "}
                      {appt.doctor.username}
                    </p>
                  </div>

                  <div
                    className={`grid gap-3 mt-6 ${
                      canDelete
                        ? "grid-cols-1 sm:grid-cols-2 auto-rows-max"
                        : "grid-cols-1"
                    }`}
                  >
                    <Button
                      type="bg6"
                      icon="fa-history"
                      label="Historial"
                      full={true}
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setActiveModal("historyAppoint");
                      }}
                      classes={`${
                        status === "solicitada" ? "col-span-full" : ""
                      }`}
                    />

                    {canDelete && (
                      <>
                        {status !== "solicitada" && status !== "pendiente" && (
                          <Button
                            type="bg1"
                            icon="fa-edit"
                            label="Reprogramar"
                            full={true}
                            onClick={() => {
                              setSelectedAppointment(appt);
                              setActiveModal("editAppointment");
                            }}
                          />
                        )}

                        {status !== "pendiente" && (
                          <Button
                            type="bg3"
                            icon="fa-sync-alt"
                            label="Estado"
                            full={true}
                            onClick={() => {
                              setSelectedAppointment(appt);
                              setActiveModal("updateAppointStatus");
                            }}
                          />
                        )}

                        <Button
                          type="alert"
                          icon="fa-ban"
                          label="Cancelar"
                          full={true}
                          onClick={() => {
                            setApptID(appt._id);
                            setShowConfirm(true);
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showConfirm && (
        <Modal
          type="alert"
          title="¿Estás seguro de cancelar esta cita?"
          message="Esta acción no se puede deshacer."
          onClose={() => setShowConfirm(false)}
          onSubmit={handleDelete}
        />
      )}
    </div>
  );
}

export default PatientAppointments;
