import { useEffect, useState } from "react";
import { useEducational } from "../../../context/EducationalContext";
import dayjs from "dayjs";
import EducContent from "../../common/Modals/EducContent";
import ModalContainer from "../../common/Modals/ModalContainer";

function ViewedContent({ patientId }) {
  const { history, fetchEducationalHistory } = useEducational();
  const [openModal, setOpenModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    fetchEducationalHistory(patientId);
  }, [patientId]);

  const clinicalTagLabels = {
    riesgo_abandono_alto: "Riesgo de abandono alto",
    posible_resistencia: "Posible resistencia",
    adh_baja: "Adherencia baja",
    abandono_probable: "Abandono probable",
  };

  if (!history || history.length === 0) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-teal-500 text-center flex items-center justify-center gap-3">
          <i className="fa-solid fa-eye text-teal-400 text-2xl" />
          Contenido Visualizado
        </h1>
        <div className="p-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <i className="fa fa-book-open text-5xl text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg max-w-md leading-relaxed">
            El paciente aún no ha visto contenidos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-teal-500 text-center flex items-center justify-center gap-3">
          <i className="fa-solid fa-eye text-teal-400 text-2xl" />
          Contenido Visualizado
        </h1>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {history.map((item) => {
            const { content, viewedAt } = item;

            if (!content) {
              return (
                <div
                  key={item._id}
                  className="rounded-2xl bg-white border border-gray-100 p-6 flex flex-col justify-between text-center text-gray-500"
                >
                  <p>El contenido fue eliminado.</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Visto el {dayjs(viewedAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={item._id}
                className="rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    {content.fileType === "video" && (
                      <i className="fa-solid fa-video text-teal-500 text-xl" />
                    )}
                    {content.fileType === "image" && (
                      <i className="fa-solid fa-image text-teal-500 text-xl" />
                    )}
                    {content.fileType === "pdf" && (
                      <i className="fa-solid fa-file-pdf text-teal-500 text-xl" />
                    )}
                    <h2 className="text-lg font-semibold text-gray-800 leading-snug">
                      {content.title}
                    </h2>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {content.description}
                  </p>

                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Etapa:</span>{" "}
                    {content.treatmentStage}
                  </p>

                  {content.clinicalTags?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2 tracking-wide">
                        Etiquetas clínicas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {content.clinicalTags.map((tag, idx) => {
                          const label =
                            clinicalTagLabels[tag] || tag.replaceAll("_", " ");
                          let style = "bg-gray-100 text-gray-700";

                          if (tag === "riesgo_abandono_alto")
                            style = "bg-red-100 text-red-700";
                          else if (tag === "posible_resistencia")
                            style = "bg-yellow-100 text-yellow-700";
                          else if (tag === "adh_baja")
                            style = "bg-orange-100 text-orange-700";
                          else if (tag === "abandono_probable")
                            style = "bg-pink-100 text-pink-700";

                          return (
                            <span
                              key={idx}
                              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-medium ${style}`}
                            >
                              <i className="fa-solid fa-tag text-[10px]" />
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    Visto el {dayjs(viewedAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>

                <div className="border-t border-gray-100 px-6 py-4 flex justify-end">
                  <button
                    className="duration-300 ease-out cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-teal-500 text-white hover:bg-teal-400 active:scale-95 transition"
                    onClick={() => {
                      setOpenModal(true);
                      setSelectedContent(content._id);
                    }}
                  >
                    <i className="fa-solid fa-eye text-sm" />
                    Ver
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {openModal && (
        <ModalContainer
          onClose={() => {
            setOpenModal(false);
            setSelectedContent(null);
          }}
          educational={true}
        >
          <EducContent
            onClose={() => {
              setOpenModal(false);
              setSelectedContent(null);
            }}
            contentId={selectedContent}
          />
        </ModalContainer>
      )}
    </>
  );
}

export default ViewedContent;
