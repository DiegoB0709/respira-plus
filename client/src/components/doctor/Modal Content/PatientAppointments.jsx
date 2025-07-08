import { useEffect, useState } from "react";
import { useAppointments } from "../../../context/AppointmentContext";

function PatientAppointments({
  patientId,
  setActiveModal,
  setSelectedAppointment,
}) {
  const {
    appointments,
    fetchAppointmentsByPatient,
    deleteAppointment,
    errors,
  } = useAppointments();

  const [showConfirm, setShowConfirm] = useState(false);
  const [apptID, setApptID] = useState(null);

  useEffect(() => {
    fetchAppointmentsByPatient(patientId);
  }, []);

  const handleDelete = async () => {
    await deleteAppointment(apptID);
    setShowConfirm(false);
    setActiveModal("appointments");
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const aStatus = a.status?.toLowerCase();
    const bStatus = b.status?.toLowerCase();
    const aCanDelete = aStatus === "pendiente" || aStatus === "confirmada";
    const bCanDelete = bStatus === "pendiente" || bStatus === "confirmada";
    if (aCanDelete && !bCanDelete) return -1;
    if (!aCanDelete && bCanDelete) return 1;
    return 0;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-teal-500 mb-6 flex items-center justify-center gap-2">
        <i className="fa fa-calendar-check text-teal-400" />
        Citas Médicas
      </h1>

      {errors.length > 0 && (
        <div className="mb-4 bg-red-100 border border-red-300 text-red-700 p-4 rounded">
          {errors.map((err, i) => (
            <p key={i} className="text-sm">
              {err}
            </p>
          ))}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setActiveModal("createAppointment")}
          className="w-full cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition inline-flex items-center justify-center gap-2"
        >
          <i className="fa fa-calendar-plus" />
          Agendar Cita Médica
        </button>
      </div>

      <div className="space-y-4">
        {sortedAppointments.map((appt) => {
          const status = appt.status?.toLowerCase();
          const canDelete = status === "pendiente" || status === "confirmada";

          return (
            <div
              key={appt._id}
              className="border border-gray-200 rounded-xl p-4 shadow-md bg-white transition hover:shadow-lg"
            >
              <div className="mb-3 space-y-1 text-sm sm:text-base">
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

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedAppointment(appt);
                    setActiveModal("historyAppoint");
                  }}
                  className={`cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 ${
                    canDelete ? "" : "col-span-2"
                  }`}
                >
                  <i className="fa fa-history" />
                  <span className="hidden sm:inline">Historial</span>
                </button>

                {canDelete && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setActiveModal("editAppointment");
                      }}
                      className="cursor-pointer bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <i className="fa fa-edit" />
                      <span className="hidden sm:inline">Reprogramar</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAppointment(appt);
                        setActiveModal("updateAppointStatus");
                      }}
                      className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <i className="fa fa-sync-alt" />
                      <span className="hidden sm:inline">Estado</span>
                    </button>

                    <button
                      onClick={() => {
                        setApptID(appt._id);
                        setShowConfirm(true);
                      }}
                      className="cursor-pointer bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <i className="fa fa-trash" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              ¿Eliminar esta cita?
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="cursor-pointer px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="cursor-pointer px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientAppointments;
