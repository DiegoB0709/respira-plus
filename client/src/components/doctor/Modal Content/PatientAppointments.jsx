import { useEffect, useState } from "react";
import { useAppointments } from "../../../context/AppointmentContext";

function PatientAppointments({
  patientId,
  setActiveModal,
  setSelectedAppointment,
}) {
  const {
    appointments,
    fetchAppointments,
    deleteAppointment,
    errors,
  } = useAppointments();

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-teal-500 mb-8 flex items-center justify-center gap-3">
        <i className="fa fa-calendar-check text-teal-400 text-2xl" />
        Citas Médicas
      </h1>

      {errors.length > 0 && (
        <div className="mb-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl">
          {errors.map((err, i) => (
            <p key={i} className="text-sm">
              {err}
            </p>
          ))}
        </div>
      )}

      {sortedAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <i className="fa fa-calendar-alt text-5xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-6 max-w-md leading-relaxed">
            El paciente aún no tiene citas médicas registradas
          </p>
          <button
            onClick={() => setActiveModal("createAppointment")}
            className="cursor-pointer bg-teal-500 hover:bg-teal-400 text-white px-6 py-3 rounded-2xl text-sm sm:text-base font-medium transition inline-flex items-center justify-center gap-2 shadow-md"
          >
            <i className="fa fa-calendar-plus" />
            Agendar Cita Médica
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <button
              onClick={() => setActiveModal("createAppointment")}
              className="w-full cursor-pointer bg-teal-500 hover:bg-teal-400 text-white px-4 py-3 rounded-2xl text-sm sm:text-base font-medium transition inline-flex items-center justify-center gap-2 shadow-md"
            >
              <i className="fa fa-calendar-plus" />
              Agendar Cita Médica
            </button>
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
                  className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="space-y-2 text-sm sm:text-base">
                    <p>
                      <i className="fa fa-calendar-alt text-teal-500 mr-2" />
                      <span className="font-semibold text-gray-700">
                        Fecha:
                      </span>{" "}
                      {new Date(appt.date).toLocaleString()}
                    </p>
                    <p>
                      <i className="fa fa-comment-medical text-teal-500 mr-2" />
                      <span className="font-semibold text-gray-700">
                        Motivo:
                      </span>{" "}
                      {appt.reason}
                    </p>
                    <p>
                      <i className="fa fa-clipboard-check text-teal-500 mr-2" />
                      <span className="font-semibold text-gray-700">
                        Estado:
                      </span>{" "}
                      {appt.status}
                    </p>
                    <p>
                      <i className="fa fa-user-md text-teal-500 mr-2" />
                      <span className="font-semibold text-gray-700">
                        Doctor:
                      </span>{" "}
                      {appt.doctor.username}
                    </p>
                  </div>

                  <div
                    className={`grid gap-3 mt-6 ${
                      canDelete ? "grid-cols-2 auto-rows-max" : "grid-cols-1"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setActiveModal("historyAppoint");
                      }}
                      className={`cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-2xl transition flex items-center justify-center ${
                        canDelete ? "gap-1 " : "justify-center gap-2"
                      } ${status === "solicitada" ? "col-span-full" : ""}`}
                    >
                      <i className="fa fa-history" />
                      <span className="hidden sm:inline">Historial</span>
                    </button>

                    {canDelete && (
                      <>
                        {status !== "solicitada" && status !== "pendiente" ? (
                          <button
                            onClick={() => {
                              setSelectedAppointment(appt);
                              setActiveModal("editAppointment");
                            }}
                            className={`cursor-pointer bg-teal-500 hover:bg-teal-400 text-white font-medium py-2 px-4 rounded-2xl transition flex items-center justify-center gap-2`}
                          >
                            <i className="fa fa-edit" />
                            <span className="hidden sm:inline">
                              Reprogramar
                            </span>
                          </button>
                        ) : (
                          ""
                        )}

                        {status !== "pendiente" ? (
                          <button
                            onClick={() => {
                              setSelectedAppointment(appt);
                              setActiveModal("updateAppointStatus");
                            }}
                            className={`cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-2xl transition flex items-center justify-center gap-2`}
                          >
                            <i className="fa fa-sync-alt" />
                            <span className="hidden sm:inline">Estado</span>
                          </button>
                        ) : (
                          ""
                        )}

                        <button
                          onClick={() => {
                            setApptID(appt._id);
                            setShowConfirm(true);
                          }}
                          className={`cursor-pointer bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-2xl transition flex items-center justify-center gap-2`}
                        >
                          <i className="fa fa-ban" />
                          <span className="hidden sm:inline">Cancelar</span>
                        </button>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
                <i className="fas fa-exclamation-triangle text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                ¿Estás seguro de cancelar esta cita?
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex w-full gap-3 pt-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="cursor-pointer w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="cursor-pointer w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientAppointments;
