import { useState, useEffect } from "react";
import { useEducational } from "../../../context/EducationalContext";

function EducationalForm({ setActiveModal, contentId = null }) {
  const {
    createEducationalContent,
    editEducationalContent,
    fetchEducationalContentById,
    contentDetails,
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
    <div className="p-1 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-teal-500 mb-8 flex items-center justify-center gap-2">
        <i className="fa fa-book-medical text-teal-400 text-3xl sm:text-2xl" />
        <span>{contentId ? "Editar Contenido" : "Subir Contenido"}</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 pt-0 space-y-4"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
            <i className="fa fa-heading text-teal-500" />
            Título *
          </label>
          <input
            type="text"
            name="title"
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
            <i className="fa fa-align-left text-teal-500" />
            Descripción *
          </label>
          <textarea
            name="description"
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            rows="4"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        {!contentId && !form.file && (
          <div>
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
              <i className="fa fa-file-upload text-teal-500" />
              Archivo *
            </label>
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-teal-400 rounded-xl cursor-pointer hover:bg-teal-50 transition"
            >
              <i className="fa fa-cloud-upload-alt text-teal-500 text-2xl mr-2" />
              <span className="text-gray-600">
                Haz clic para seleccionar un archivo
              </span>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleChange}
              />
            </label>
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
            <p className="text-gray-500 text-sm mt-1">
              Este archivo no se puede modificar.
            </p>
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
            <i className="fa fa-stethoscope text-teal-500" />
            Síntomas Relacionados
          </label>
          <input
            type="text"
            name="relatedSymptoms"
            placeholder="Ej: Tos, Fiebre, Dolor de cabeza"
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            value={form.relatedSymptoms}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
            <i className="fa fa-pills text-teal-500" />
            Etapa del Tratamiento
          </label>
          <select
            name="treatmentStage"
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            value={form.treatmentStage}
            onChange={handleChange}
          >
            <option value="inicio">Inicio del tratamiento</option>
            <option value="intermedio">Etapa intermedia</option>
            <option value="final">Etapa final</option>
            <option value="indefinido">Indefinido</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
            <i className="fa fa-tags text-teal-500" />
            Etiquetas Clínicas
          </label>
          <div className="flex flex-wrap gap-2">
            {tagsOptions.map((tag) => (
              <button
                type="button"
                key={tag.value}
                onClick={() => toggleTag(tag.value)}
                className={`px-3 py-1 rounded-full border transition ${
                  form.clinicalTags.includes(tag.value)
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-teal-50"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

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
            <div className="w-11 h-6 bg-gray-300 rounded-full shadow-inner peer-checked:bg-teal-500 transition-colors duration-300"></div>
            <div className="absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 peer-checked:translate-x-full"></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700">
            {form.isPublic ? "Contenido público" : "Contenido privado"}
          </span>
        </label>

        <button
          type="submit"
          className="cursor-pointer w-full bg-teal-500 text-white py-2.5 px-4 rounded-2xl font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 mt-4"
          disabled={loading}
        >
          <i className="fa fa-upload mr-2" />
          {loading
            ? contentId
              ? "Actualizando..."
              : "Subiendo..."
            : contentId
            ? "Actualizar Contenido"
            : "Subir Contenido"}
        </button>
      </form>

      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center space-y-3 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-500 mx-auto">
              <i className="fa fa-spinner fa-spin text-xl" />
            </div>
            <p className="text-gray-700">Cargando, por favor espere...</p>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center space-y-4 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-500 mx-auto">
              <i className="fa fa-check text-xl" />
            </div>
            <p className="text-gray-700 font-medium">
              {contentId
                ? "Contenido actualizado exitosamente"
                : "Contenido subido exitosamente"}
            </p>
            <button
              onClick={resetForm}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {errorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center space-y-4 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mx-auto">
              <i className="fa fa-times text-xl" />
            </div>
            <p className="text-gray-700 font-medium">
              Ocurrió un error al subir el contenido. Intenta nuevamente.
            </p>
            <button
              onClick={() => setErrorModal(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EducationalForm;
