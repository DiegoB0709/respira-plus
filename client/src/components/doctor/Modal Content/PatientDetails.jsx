import { useState, useEffect } from "react";
import { useDoctor } from "../../../context/DoctorContext";
import Input from "../../common/Imput/Input";
import Button from "../../common/Buttons/Button";
import { useExport } from "../../../context/ExportContext";
import Toast from "@/components/common/Toast/Toast";

function PatientDetails({ setActiveModal, setPatientId }) {
  const { selectedPatient, setSelectedPatient, updatePatient, errors } =
    useDoctor();
  const { handleExportPDF, handleExportExcel, handleExportCSV } = useExport();
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
  });
  const [onEdit, setOnEdit] = useState(false);
  const [onExport, setOnExport] = useState(false);

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
    <>
      {errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white dark:bg-neutral-800 transition-colors duration-300 ease-in-out p-6 rounded-lg border border-gray-100 dark:border-neutral-700 shadow-sm"
        >
          {["username", "phone", "email"].map((field) => {
            const labels = {
              username: "Nombre de Paciente",
              phone: "Teléfono",
              email: "Correo",
            };

            const icons = {
              username: "fa-user",
              phone: "fa-phone-alt",
              email: "fa-envelope",
            };

            return (
              <div key={field}>
                <Input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  label={labels[field]}
                  icon={icons[field]}
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={!onEdit}
                  placeholder={`Ingrese ${labels[field].toLowerCase()}`}
                />
              </div>
            );
          })}

          <div className="flex flex-col gap-3">
            {onEdit && (
              <Button
                type="bg1"
                icon="fa-floppy-disk"
                label="Actualizar"
                submit={true}
                full={true}
                classes="text-sm py-3 px-4 inline-flex hover:brightness-110"
              />
            )}
            <div className="flex flex-row justify-between w-full">
              <button
                type="button"
                onClick={onEdit ? handleOffEdit : handleOnEdit}
                className="cursor-pointer text-sm font-medium bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent hover:scale-102 transition ease-in duration-200"
              >
                {onEdit ? "Cancelar" : "Editar Datos"}
              </button>
              {!onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setOnExport(true);
                  }}
                  className="cursor-pointer text-sm font-medium bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent hover:scale-102 transition ease-in duration-200"
                >
                  Exportar Reporte Clínico
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              label: "Tratamientos",
              icon: "fa-pills",
              modal: "treatments",
              type: "bg1",
            },
            {
              label: "Datos Clínicos",
              icon: "fa-notes-medical",
              modal: "clinical",
              type: "bg2",
            },
            {
              label: "Evaluar Paciente",
              icon: "fa-heartbeat",
              modal: "evaluate",
              type: "bg3",
            },
            {
              label: "Contenido Visto",
              icon: "fa-book-reader",
              modal: "educate",
              type: "bg4",
            },
            {
              label: "Citas Médicas",
              icon: "fa-calendar-check",
              modal: "appointments",
              type: "bg5",
            },
            {
              label: "Alertas",
              icon: "fa-bell",
              modal: "alerts",
              type: "alert",
            },
          ].map((item) => (
            <Button
              key={item.modal}
              type={item.type}
              icon={item.icon}
              label={item.label}
              onClick={() => {
                setActiveModal(item.modal);
                setPatientId(selectedPatient._id);
              }}
              classes="text-sm py-3 px-4 inline-flex hover:brightness-110"
            />
          ))}
        </div>
        {onExport && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setOnExport(false)}
          >
            <div
              className="bg-white dark:bg-neutral-900 transition-colors duration-300 ease-in-out rounded-2xl shadow-2xl p-8 text-center space-y-4 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full mx-auto bg-teal-100 text-teal-500 transition-colors duration-300 ease-in-out">
                <i className="fa-solid fa-download text-lg" />
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50 transition-colors duration-300 ease-in-out text-center mb-2">
                Reporte Clínico
              </h2>

              <p className="text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-300 ease-in-out">
                Selecciona el formato de exportación.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => handleExportPDF(selectedPatient._id)}
                  className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-md bg-gradient-to-r from-red-500 to-red-600 transition-transform transform hover:scale-102 "
                >
                  <i className="fa-solid fa-file-pdf text-white" />
                  PDF
                </button>
                <button
                  onClick={() => handleExportExcel(selectedPatient._id)}
                  className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-md bg-gradient-to-r from-green-500 to-emerald-600 transition-transform transform hover:scale-102"
                >
                  <i className="fa-solid fa-file-excel text-white" />
                  Excel
                </button>
                <button
                  onClick={() => handleExportCSV(selectedPatient._id)}
                  className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-md bg-gradient-to-r from-blue-500 to-indigo-600 transition-transform transform hover:scale-102 "
                >
                  <i className="fa-solid fa-file-csv text-white" />
                  CSV
                </button>
              </div>

              <button
                onClick={() => setOnExport(false)}
                className="cursor-pointer w-full px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 transition "
              >
                Volver
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PatientDetails;
