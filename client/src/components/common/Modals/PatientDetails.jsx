  import { useState, useEffect } from "react";
  import { useDoctor } from "../../../context/DoctorContext";

  function PatientDetails() {
    const [activeModal, setActiveModal] = useState(null);
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
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Perfil del Paciente
        </h1>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errors.map((err, idx) => (
              <p key={idx}>{err}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium ${
                onEdit ? "text-teal-600" : "text-gray-700"
              }`}
            >
              Nombre de usuario
            </label>
            <input
              disabled={!onEdit}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-md text-sm ${
                onEdit
                  ? "border-gray-300 focus:ring-2 focus:ring-teal-500"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                onEdit ? "text-teal-600" : "text-gray-700"
              }`}
            >
              Teléfono
            </label>
            <input
              disabled={!onEdit}
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-md text-sm ${
                onEdit
                  ? "border-gray-300 focus:ring-2 focus:ring-teal-500"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${
                onEdit ? "text-teal-600" : "text-gray-700"
              }`}
            >
              Correo
            </label>
            <input
              disabled={!onEdit}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-md text-sm ${
                onEdit
                  ? "border-gray-300 focus:ring-2 focus:ring-teal-500"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={onEdit ? handleOffEdit : handleOnEdit}
              className="cursor-pointer text-sm text-teal-600 hover:underline"
            >
              {onEdit ? "Cancelar" : "Editar Datos"}
            </button>
            {onEdit && (
              <button
                type="submit"
                className="cursor-pointer bg-teal-600 text-white text-sm px-4 py-2 rounded-md hover:bg-teal-700 transition"
              >
                Actualizar
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Tratamientos", modal: "treatments" },
            { label: "Detalles Clínicos", modal: "clinical" },
            { label: "Evaluar Paciente", modal: "evaluate" },
            { label: "Contenido Visto", modal: "educate" },
            {
              label: "Citas Médicas del Paciente",
              modal: "appointments",
              fullWidth: true,
            },
          ].map((item) => (
            <button
              key={item.modal}
              type="button"
              onClick={() => setActiveModal(item.modal)}
              className={`cursor-pointer w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition font-medium ${
                item.fullWidth ? "sm:col-span-2" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  export default PatientDetails;
