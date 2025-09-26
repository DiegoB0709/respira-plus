import { useEffect, useState } from "react";
import { useEducational } from "../../../context/EducationalContext";
import dayjs from "dayjs";
import EducContent from "../../common/Modals/EducContent";
import ModalContainer from "../../common/Modals/ModalContainer";
import Button from "../../common/Buttons/Button";
import Toast from "@/components/common/Toast/Toast";

function ViewedContent({ patientId }) {
  const { history, fetchEducationalHistory, errors } = useEducational();
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
      <>
        {errors.length > 0 &&
          errors.map((e, i) => <Toast key={i} type="error" message={e} />)}
        <div className="p-6 max-w-5xl mx-auto space-y-8 transition-colors duration-300 ease-in-out">
          <div className="p-12 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-neutral-800 rounded-xl border border-dashed border-gray-300 dark:border-neutral-700 transition-colors duration-300 ease-in-out">
            <i className="fa fa-book-open text-5xl text-gray-400 dark:text-neutral-400 mb-4" />
            <p className="text-gray-600 dark:text-neutral-300 text-lg max-w-md leading-relaxed">
              El paciente aún no ha visto contenidos.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="p-6 max-w-5xl mx-auto space-y-8 transition-colors duration-300 ease-in-out">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {history.map((item) => {
            const { content, viewedAt } = item;

            if (!content) {
              return (
                <div
                  key={item._id}
                  className="justify-center rounded-2xl bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 p-6 flex flex-col text-center text-gray-500 dark:text-neutral-300 transition-colors duration-300 ease-in-out"
                >
                  <p>El contenido fue eliminado.</p>
                  <p className="text-xs text-gray-400 dark:text-neutral-400 mt-2">
                    Visto el {dayjs(viewedAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={item._id}
                className="rounded-2xl bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    {content.fileType === "video" && (
                      <i className="fa-solid fa-video bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent text-xl" />
                    )}
                    {content.fileType === "image" && (
                      <i className="fa-solid fa-image bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent text-xl" />
                    )}
                    {content.fileType === "pdf" && (
                      <i className="fa-solid fa-file-pdf bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent text-xl" />
                    )}
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-50 leading-snug transition-colors duration-300 ease-in-out">
                      {content.title}
                    </h2>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-neutral-300 line-clamp-2 transition-colors duration-300 ease-in-out">
                    {content.description}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-neutral-400 transition-colors duration-300 ease-in-out">
                    <span className="font-medium text-gray-700 dark:text-neutral-50">
                      Etapa:
                    </span>{" "}
                    {content.treatmentStage}
                  </p>

                  {content.clinicalTags?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-neutral-50 mb-2 tracking-wide transition-colors duration-300 ease-in-out">
                        Etiquetas clínicas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {content.clinicalTags.map((tag, idx) => {
                          const label =
                            clinicalTagLabels[tag] || tag.replaceAll("_", " ");
                          let style =
                            "bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 transition-colors duration-300 ease-in-out";

                          if (tag === "riesgo_abandono_alto")
                            style =
                              "bg-red-100 dark:bg-neutral-700 text-red-700 dark:text-red-400 transition-colors duration-300 ease-in-out";
                          else if (tag === "posible_resistencia")
                            style =
                              "bg-yellow-100 dark:bg-neutral-700 text-yellow-700 dark:text-yellow-400 transition-colors duration-300 ease-in-out";
                          else if (tag === "adh_baja")
                            style =
                              "bg-orange-100 dark:bg-neutral-700 text-orange-700 dark:text-orange-400 transition-colors duration-300 ease-in-out";
                          else if (tag === "abandono_probable")
                            style =
                              "bg-pink-100 dark:bg-neutral-700 text-pink-700 dark:text-pink-400 transition-colors duration-300 ease-in-out";

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

                  <p className="text-xs text-gray-400 dark:text-neutral-400 transition-colors duration-300 ease-in-out">
                    Visto el {dayjs(viewedAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>

                <div className="border-t border-gray-100 dark:border-neutral-700 px-6 py-4 flex justify-end transition-colors duration-300 ease-in-out">
                  <Button
                    type="bg1"
                    icon="fa-eye"
                    label="Ver"
                    full={true}
                    classes="!py-2 duration-300 ease-out active:scale-95 text-sm rounded-xl"
                    onClick={() => {
                      setOpenModal(true);
                      setSelectedContent(content._id);
                    }}
                  />
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
