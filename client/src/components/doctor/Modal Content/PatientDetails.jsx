import { useState, useEffect } from "react";
import { useDoctor } from "../../../context/DoctorContext";

function PatientDetails({ setActiveModal, setPatientId }) {
  const { selectedPatient, setSelectedPatient, updatePatient, errors } =
    useDoctor();
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
  });
  const [onEdit, setOnEdit] = useState(false);

  const handleOnEdit = () => {
    setOnEdit(true);
  };

  const handleOffEdit = () => {
    setFormData({
      username: selectedPatient.username || "",
      phone: selectedPatient.phone || "",
      email: selectedPatient.email || "",
    });
    setOnEdit(false);
  };

  useEffect(() => {
    if (selectedPatient) {
      setFormData({
        username: selectedPatient.username || "",
        phone: selectedPatient.phone || "",
        email: selectedPatient.email || "",
      });
    }
  }, [selectedPatient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    await updatePatient(selectedPatient._id, formData);
    setSelectedPatient((prev) => ({ ...prev, ...formData }));
    handleOffEdit();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center text-teal-500 mb-6 flex flex-wrap items-center justify-center gap-2">
        <i className="fas fa-user-injured text-teal-400 text-2xl shrink-0"></i>
        Perfil del Paciente
      </h1>

      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md space-y-1 text-sm">
          {errors.map((err, idx) => (
            <p key={idx} className="flex items-center gap-2">
              <i className="fas fa-exclamation-circle text-red-500"></i>
              {err}
            </p>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-lg border border-gray-100 shadow-sm"
      >
        {["username", "phone", "email"].map((field) => {
          const labels = {
            username: "Nombre de Paciente",
            phone: "Teléfono",
            email: "Correo",
          };
          const icons = {
            username: "fas fa-user",
            phone: "fas fa-phone-alt",
            email: "fas fa-envelope",
          };
          return (
            <div key={field}>
              <label
                className={`block text-sm font-medium flex items-center gap-2 ${
                  onEdit ? "text-teal-500" : "text-gray-700"
                }`}
              >
                <i
                  className={`${icons[field]} ${
                    onEdit ? "text-teal-400" : "text-gray-400"
                  }`}
                ></i>
                {labels[field]}
              </label>
              <input
                disabled={!onEdit}
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-xl text-sm ${
                  onEdit
                    ? "border-teal-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    : "bg-gray-100 cursor-not-allowed border border-gray-200"
                }`}
              />
            </div>
          );
        })}

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={onEdit ? handleOffEdit : handleOnEdit}
            className="cursor-pointer text-sm text-teal-500 hover:underline"
          >
            {onEdit ? "Cancelar" : "Editar Datos"}
          </button>
          {onEdit && (
            <button
              type="submit"
              className="cursor-pointer bg-teal-500 text-white text-sm px-4 py-2 rounded-xl hover:bg-teal-400 transition hover:brightness-110 font-medium flex items-center justify-center gap-2 border"
            >
              <i className="fa-solid fa-floppy-disk text-white hidden sm:inline-flex"></i>
              Actualizar
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            label: "Tratamientos",
            icon: "fas fa-pills",
            modal: "treatments",
            color: "bg-teal-500",
          },
          {
            label: "Datos Clínicos",
            icon: "fas fa-notes-medical",
            modal: "clinical",
            color: "bg-teal-500",
          },
          {
            label: "Evaluar Paciente",
            icon: "fas fa-heartbeat",
            modal: "evaluate",
            color: "bg-teal-500",
          },
          {
            label: "Contenido Visto",
            icon: "fas fa-book-reader",
            modal: "educate",
            color: "bg-teal-500",
          },
          {
            label: "Citas Médicas",
            icon: "fas fa-calendar-check",
            modal: "appointments",
            color: "bg-teal-500",
          },
          {
            label: "Alertas",
            icon: "fas fa-bell",
            modal: "alerts",
            color: "bg-rose-600",
          },
        ].map((item) => (
          <button
            key={item.modal}
            type="button"
            onClick={() => {
              setActiveModal(item.modal);
              setPatientId(selectedPatient._id);
            }}
            className={`cursor-pointer w-full ${item.color} text-white py-3 px-4 rounded-lg hover:brightness-110 transition font-medium flex items-center justify-center gap-2 text-sm`}
          >
            <i className={`${item.icon} text-white hidden sm:inline-flex`}></i>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PatientDetails;
