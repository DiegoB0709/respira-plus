import { useState, useEffect } from "react";
import { useEducational } from "../../../context/EducationalContext";
import Input from "../../common/Imput/Input";
import Button from "../../common/Buttons/Button";
import Modal from "../../common/Modals/Modal";
import Toast from "@/components/common/Toast/Toast";

function EducationalForm({ setActiveModal, contentId = null }) {
  const {
    createEducationalContent,
    editEducationalContent,
    fetchEducationalContentById,
    contentDetails,
    errors,
  } = useEducational();

  const [form, setForm] = useState({
    title: "",
    description: "",
    isPublic: false,
    file: null,
    relatedSymptoms: "",
    treatmentStage: "indefinido",
    clinicalTags: [],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const tagsOptions = [
    { value: "riesgo_abandono_alto", label: "Riesgo de abandono alto" },
    { value: "posible_resistencia", label: "Posible resistencia" },
    { value: "adh_baja", label: "Adherencia baja" },
    { value: "abandono_probable", label: "Abandono probable" },
  ];

  const fields = [
    {
      type: "text",
      name: "title",
      label: "Título *",
      icon: "fa-heading",
      required: true,
      placeholder: "Escribe un título descriptivo",
    },
    {
      type: "textarea",
      name: "description",
      label: "Descripción *",
      icon: "fa-align-left",
      required: true,
      placeholder: "Agrega una descripción detallada del contenido...",
    },
    {
      type: "text",
      name: "relatedSymptoms",
      label: "Síntomas Relacionados",
      icon: "fa-stethoscope",
      placeholder: "Ej: Tos, Fiebre, Dolor de cabeza",
    },
    {
      type: "select",
      name: "treatmentStage",
      label: "Etapa del Tratamiento",
      icon: "fa-pills",
      options: [
        { value: "inicio", label: "Inicio del tratamiento" },
        { value: "intermedio", label: "Etapa intermedia" },
        { value: "final", label: "Etapa final" },
        { value: "indefinido", label: "Indefinido" },
      ],
    },
  ];

  useEffect(() => {
    if (contentId) fetchEducationalContentById(contentId);
  }, [contentId]);

  useEffect(() => {
    if (contentId && contentDetails) {
      setForm({
        title: contentDetails.title || "",
        description: contentDetails.description || "",
        isPublic: contentDetails.isPublic || false,
        file: null,
        relatedSymptoms: contentDetails.relatedSymptoms?.join(", ") || "",
        treatmentStage: contentDetails.treatmentStage || "indefinido",
        clinicalTags: contentDetails.clinicalTags || [],
      });
    }
  }, [contentDetails, contentId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") setForm((prev) => ({ ...prev, [name]: checked }));
    else if (type === "file")
      setForm((prev) => ({ ...prev, file: files[0] || null }));
    else setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tagValue) => {
    setForm((prev) => ({
      ...prev,
      clinicalTags: prev.clinicalTags.includes(tagValue)
        ? prev.clinicalTags.filter((t) => t !== tagValue)
        : [...prev.clinicalTags, tagValue],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (contentId) {
        await editEducationalContent(contentId, {
          title: form.title,
          description: form.description,
          isPublic: form.isPublic,
          relatedSymptoms: form.relatedSymptoms
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .join(","),
          treatmentStage: form.treatmentStage,
          clinicalTags: form.clinicalTags.join(","),
        });
      } else {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("isPublic", form.isPublic ? "true" : "false");
        formData.append("file", form.file);
        formData.append(
          "fileType",
          form.file.type.includes("video") ? "video" : "image"
        );
        if (form.relatedSymptoms) {
          formData.append(
            "relatedSymptoms",
            form.relatedSymptoms
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
              .join(",")
          );
        }
        formData.append("treatmentStage", form.treatmentStage);
        if (form.clinicalTags.length > 0)
          formData.append("clinicalTags", form.clinicalTags.join(","));
        await createEducationalContent(formData);
      }
      setLoading(false);
      if (contentId) fetchEducationalContentById(contentId);
      setSuccess(true);
    } catch {
      setLoading(false);
      setErrorModal(true);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      isPublic: false,
      file: null,
      relatedSymptoms: "",
      treatmentStage: "indefinido",
      clinicalTags: [],
    });
    setSuccess(false);
    setActiveModal(null);
  };

  return (
    <>
      {errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="p-1 max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-neutral-900 rounded-lg p-6 pt-0 space-y-4 mt-4 transition-colors duration-300 ease-in-out"
        >
          {fields.map((field, i) => (
            <Input
              key={i}
              type={field.type}
              name={field.name}
              label={field.label}
              icon={field.icon}
              placeholder={field.placeholder}
              options={field.options}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          ))}

          <div className="flex flex-col">
            <label className="block text-gray-700 dark:text-neutral-50 font-medium mb-1 flex items-center gap-2 text-sm transition-colors duration-300 ease-in-out">
              <i className="fa fa-tags bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent" />
              Etiquetas Clínicas
            </label>
            <div className="flex flex-wrap gap-2">
              {tagsOptions.map((tag) => (
                <button
                  type="button"
                  key={tag.value}
                  onClick={() => toggleTag(tag.value)}
                  className={`px-3 py-1 rounded-full border text-sm transition-colors duration-300 ease-in-out ${
                    form.clinicalTags.includes(tag.value)
                      ? "bg-gradient-to-r from-teal-400 to-sky-500 text-white"
                      : "bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border-gray-300 dark:border-neutral-700 hover:bg-teal-50 dark:hover:bg-neutral-700"
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {!contentId && !form.file && (
            <Input
              type="file"
              name="file-upload"
              label="Archivo *"
              icon="fa-file-upload"
              onChange={handleChange}
            />
          )}

          {form.file && (
            <div className="flex items-center justify-between bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl px-4 py-3 mt-3 transition-colors duration-300 ease-in-out">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex items-center justify-center w-10 h-10 bg-teal-100 text-teal-500 rounded-full">
                  <i className="fa fa-file text-lg bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent" />
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-neutral-50 truncate max-w-[180px] sm:max-w-[260px] transition-colors duration-300 ease-in-out">
                  {form.file.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, file: null }))}
                className="cursor-pointer flex items-center gap-2 text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
              >
                <i className="fa fa-times-circle text-base" />
                Eliminar
              </button>
            </div>
          )}

          {contentId && contentDetails && (
            <div className="flex flex-col gap-2 mb-4">
              {contentDetails.fileType === "image" ? (
                <img
                  src={contentDetails.mediaUrls[0]}
                  alt={contentDetails.title}
                  className="w-full object-contain rounded-xl border border-teal-200 p-1"
                />
              ) : (
                <video
                  src={contentDetails.mediaUrls[0]}
                  controls
                  className="w-full object-contain rounded-xl border border-teal-200 p-1"
                />
              )}
              <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1 transition-colors duration-300 ease-in-out">
                Este archivo no se puede modificar.
              </p>
            </div>
          )}

          <label
            htmlFor="isPublic"
            className="flex items-center cursor-pointer select-none mt-2"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={form.isPublic}
                onChange={handleChange}
                className="sr-only peer"
              />

              <div
                className="
            w-11 h-6 rounded-full shadow-inner
            bg-gray-300 dark:bg-neutral-700
            transition-colors duration-300 ease-in-out
            peer-checked:bg-gradient-to-r peer-checked:from-teal-400 peer-checked:to-cyan-500
          "
              ></div>

              <div
                className="
            absolute top-0 left-0 w-6 h-6 bg-white  rounded-full shadow
            transform transition-transform duration-300
            peer-checked:translate-x-full
          "
              ></div>
            </div>

            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-neutral-50 transition-colors duration-300 ease-in-out">
              {form.isPublic ? "Contenido público" : "Contenido privado"}
            </span>
          </label>

          <Button
            submit={true}
            type="bg1"
            icon="fa-upload"
            disabled={loading}
            label={
              loading
                ? contentId
                  ? "Actualizando..."
                  : "Subiendo..."
                : contentId
                ? "Actualizar Contenido"
                : "Subir Contenido"
            }
          />
        </form>

        {loading && (
          <Modal
            type="loading"
            title="Cargando"
            message="Por favor espere..."
          />
        )}

        {success && (
          <Modal
            type="success"
            title={contentId ? "Contenido actualizado" : "Contenido subido"}
            message={
              contentId
                ? "El contenido fue actualizado exitosamente."
                : "El contenido fue subido exitosamente."
            }
            onSubmit={resetForm}
          />
        )}

        {errorModal && (
          <Modal
            title={"Ocurrió un error"}
            type="error"
            message="Ocurrió un error al subir el contenido. Intenta nuevamente."
            onSubmit={() => setErrorModal(false)}
          />
        )}
      </div>
    </>
  );
}

export default EducationalForm;
