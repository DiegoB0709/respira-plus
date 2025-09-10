import { useEffect, useState } from "react";
import { useEducational } from "../../../context/EducationalContext";
import { useAuth } from "../../../context/AuthContext";
import EducationalForm from "../../doctor/Modal Content/EducationalForm";
import ModalContainer from "./ModalContainer";

function EducContent({ onClose, contentId }) {
  const { user } = useAuth();
  const {
    fetchEducationalContentById,
    fetchEducationalHistoryByContent,
    contentDetails,
    removeEducationalContent,
    markContentAsViewed,
  } = useEducational();

  const [showConfirm, setShowConfirm] = useState(false);
  const [activeEdit, setActiveEdit] = useState(null);
  const [alreadyViewed, setAlreadyViewed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contentId) {
      setLoading(true);
      fetchEducationalContentById(contentId).finally(() => setLoading(false));

      if (user?.role === "patient") {
        fetchEducationalHistoryByContent(contentId).then((history) => {
          if (history) setAlreadyViewed(true);
        });
      }
    }
  }, [contentId]);

  if (loading) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center gap-3 text-gray-500">
        <i className="fas fa-spinner fa-spin text-3xl" />
        <p className="text-lg">Cargando contenido...</p>
      </div>
    );
  }

  if (!contentDetails) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center gap-3 text-gray-600">
        <i className="fas fa-circle-exclamation text-4xl text-yellow-500" />
        <div className="text-center max-w-sm">
          <h3 className="text-lg font-semibold mb-1">
            Contenido no disponible
          </h3>
          <p className="text-sm">Este contenido fue eliminado o no existe.</p>
        </div>
      </div>
    );
  }


  const {
    title,
    description,
    mediaUrls = [],
    fileType,
    relatedSymptoms = [],
    treatmentStage,
    clinicalTags = [],
    isPublic,
    createdAt,
    updatedAt,
    uploadBy,
  } = contentDetails;

  const clinicalTagLabels = {
    riesgo_abandono_alto: "Riesgo de abandono alto",
    posible_resistencia: "Posible resistencia",
    adh_baja: "Adherencia baja",
    abandono_probable: "Abandono probable",
  };

  const renderMedia = () => {
    if (mediaUrls.length === 0) {
      return <p className="text-gray-500">No hay archivos disponibles</p>;
    }

    return mediaUrls.map((url, idx) => {
      if (fileType === "image") {
        return (
          <img
            key={idx}
            src={url}
            alt={`${title} - ${idx + 1}`}
            className="w-full object-contain rounded-lg"
          />
        );
      }
      if (fileType === "video") {
        return (
          <video
            key={idx}
            src={url}
            controls
            className="w-full object-contain rounded-lg"
          />
        );
      }
      return (
        <p key={idx} className="text-gray-500">
          Tipo de archivo no soportado
        </p>
      );
    });
  };

  const handleDelete = async () => {
    try {
      await removeEducationalContent(contentId);
      setShowConfirm(false);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsViewed = async () => {
    await markContentAsViewed(contentId);
    setAlreadyViewed(true);
    onClose();
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto max-h-[75vh] overflow-auto">
        <div className="lg:col-span-2 bg-gray-100 rounded-lg overflow-y-auto h-full p-4 flex flex-col gap-4 items-center justify-center">
          {renderMedia()}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 shadow-md overflow-y-auto h-full flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-teal-600 mb-2">{title}</h2>
            <p className="text-gray-700 mb-4">{description}</p>

            {relatedSymptoms.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">
                  Síntomas relacionados:
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                  {relatedSymptoms.map((symptom, idx) => (
                    <li key={idx}>{symptom}</li>
                  ))}
                </ul>
              </div>
            )}

            {treatmentStage && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">
                  Etapa de tratamiento:
                </h3>
                <span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">
                  {treatmentStage}
                </span>
              </div>
            )}

            {clinicalTags.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">
                  Etiquetas clínicas:
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {clinicalTags.map((tag, idx) => {
                    const label =
                      clinicalTagLabels[tag] || tag.replaceAll("_", " ");
                    let style = "bg-gray-100 text-gray-700";

                    if (tag === "riesgo_abandono_alto") {
                      style = "bg-red-100 text-red-700";
                    } else if (tag === "posible_resistencia") {
                      style = "bg-yellow-100 text-yellow-700";
                    } else if (tag === "adh_baja") {
                      style = "bg-orange-100 text-orange-700";
                    } else if (tag === "abandono_probable") {
                      style = "bg-pink-100 text-pink-700";
                    }

                    return (
                      <span
                        key={idx}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-medium shadow-sm ${style}`}
                      >
                        <i className="fa-solid fa-tag text-[10px]" />
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">Visibilidad:</h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm ${
                  isPublic
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isPublic ? "Público" : "Privado"}
              </span>
            </div>

            <div className="text-gray-500 text-sm">
              <p>Creado: {new Date(createdAt).toLocaleString()}</p>
              <p>Actualizado: {new Date(updatedAt).toLocaleString()}</p>
              {user.role === "patient" && (
                <p>Subido por: {uploadBy?.username || "Desconocido"}</p>
              )}
            </div>
          </div>

          {user?.role === "doctor" && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setActiveEdit("editarContenido");
                }}
                className="transition inline-flex cursor-pointer px-4 py-2 bg-teal-500 text-white rounded-2xl hover:bg-teal-400"
              >
                Editar
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="transition inline-flex cursor-pointer px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          )}

          {user?.role !== "doctor" && !alreadyViewed && (
            <div className="mt-4">
              <button
                onClick={handleMarkAsViewed}
                className="flex items-center gap-2 transition cursor-pointer px-4 py-2 bg-teal-500 text-white rounded-2xl hover:bg-teal-400"
              >
                <i className="fas fa-check-circle" aria-hidden="true"></i>
                Marcar como visto
              </button>
            </div>
          )}

          {showConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="p-6 flex flex-col items-center space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600">
                    <i className="fas fa-exclamation-triangle text-lg" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 text-center">
                    ¿Estás seguro de eliminar este contenido?
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
      </div>
      {activeEdit === "editarContenido" && (
        <ModalContainer onClose={() => setActiveEdit(null)}>
          <EducationalForm
            setActiveModal={setActiveEdit}
            contentId={contentId}
          />
        </ModalContainer>
      )}
    </>
  );
}

export default EducContent;
