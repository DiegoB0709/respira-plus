import { useEffect, useState } from "react";
import { useEducational } from "../../context/EducationalContext";
import ResponsiveTable from "../common/Table/ResponsiveTable";
import TableRow from "../common/Table/TableRow";
import Card from "../common/Table/Card";
import EducContent from "../common/Modals/EducContent";
import ModalContainer from "../common/Modals/ModalContainer";
import ActionButton from "../common/Buttons/ActionButton";

function EducationalContent() {
  const {
    fetchEducationalContentForPatient,
    fetchEducationalHistoryByContent,
    publicContent,
    recommendedContent,
    publicMeta,
  } = useEducational();

  const [filters, setFilters] = useState({
    title: "",
    symptom: "",
    treatmentStage: "",
    page: 1,
    limit: 10,
  });

  const [activeModal, setActiveModal] = useState(null);
  const [contentId, setContentId] = useState(null);
  const [viewedContents, setViewedContents] = useState({});

  const headers = ["Título", "Tipo", "Etapa", "Razón", "Acción"];

  const formatFileType = (type) => {
    if (!type) return "";
    return type.toLowerCase() === "image"
      ? "Imagen"
      : type.toLowerCase() === "video"
      ? "Video"
      : type.toUpperCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === "limit" || name === "page" ? parseInt(value) : value,
      page: name === "limit" ? 1 : prev.page,
    }));
  };

  useEffect(() => {
    fetchEducationalContentForPatient(filters);
  }, [filters]);

  useEffect(() => {
    const fetchViewed = async () => {
      const contents = [...publicContent, ...recommendedContent];
      const results = await Promise.all(
        contents.map(async (item) => {
          const history = await fetchEducationalHistoryByContent(item._id);
          return { id: item._id, viewed: !!history };
        })
      );
      const mapped = results.reduce((acc, curr) => {
        acc[curr.id] = curr.viewed;
        return acc;
      }, {});
      setViewedContents(mapped);
    };
    if (publicContent.length || recommendedContent.length) {
      fetchViewed();
    }
  }, [publicContent, recommendedContent]);

  const openViewModal = (id) => {
    setContentId(id);
    setActiveModal("viewContent");
  };

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto">
        <div className="mb-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal-500 flex items-center gap-3">
            <i className="fa-solid fa-book-medical text-teal-400 text-2xl"></i>
            Contenido Educativo
          </h2>
        </div>

        {recommendedContent.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-2">
              Recomendado para ti
            </h3>
            <ResponsiveTable
              headers={headers}
              data={recommendedContent}
              total={recommendedContent.length}
              page={1}
              totalPages={1}
              limit={recommendedContent.length}
              renderRow={(item) => (
                <TableRow
                  key={item._id}
                  columns={[
                    item.title,
                    formatFileType(item.fileType),
                    item.treatmentStage,
                    item.razon,
                    <ActionButton
                      key={`view-${item._id}`}
                      type={viewedContents[item._id] ? "viewed" : "view"}
                      title="Vizualizar"
                      onClick={() => openViewModal(item._id)}
                    />,
                  ]}
                />
              )}
              renderCard={(item) => (
                <Card
                  key={item._id}
                  fields={[
                    { label: "Título", value: item.title },
                    { label: "Tipo", value: formatFileType(item.fileType) },
                    { label: "Etapa", value: item.treatmentStage },
                    { label: "Razón", value: item.razon },
                    {
                      label: "Acción",
                      value: (
                        <div className="flex justify-center">
                          <ActionButton
                            key={`view-${item._id}`}
                            type={viewedContents[item._id] ? "viewed" : "view"}
                            title="Vizualizar"
                            onClick={() => openViewModal(item._id)}
                          />
                        </div>
                      ),
                    },
                  ]}
                />
              )}
            />
          </>
        )}

        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Contenido Público
          </h3>

          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Filtrar por:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                name="title"
                placeholder="Ej. Nutrición básica"
                value={filters.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Síntoma
              </label>
              <input
                type="text"
                name="symptom"
                placeholder="Ej. Dolor de cabeza"
                value={filters.symptom}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Etapa de tratamiento
              </label>
              <select
                name="treatmentStage"
                value={filters.treatmentStage}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none"
              >
                <option value="">Todas</option>
                <option value="inicio">Inicio</option>
                <option value="intermedio">Intermedio</option>
                <option value="final">Final</option>
                <option value="indefinido">Indefinido</option>
              </select>
            </div>
          </div>

          <ResponsiveTable
            headers={["Título", "Tipo", "Etapa", "Acción"]}
            data={publicContent}
            total={publicMeta?.total || 0}
            page={filters.page}
            totalPages={publicMeta?.totalPages || 1}
            limit={filters.limit}
            onPageChange={(newPage) =>
              setFilters((prev) => ({ ...prev, page: newPage }))
            }
            onLimitChange={(newLimit) =>
              setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }))
            }
            renderRow={(item) => (
              <TableRow
                key={item._id}
                columns={[
                  item.title,
                  formatFileType(item.fileType),
                  item.treatmentStage,
                  <ActionButton
                    key={`view-${item._id}`}
                    type={viewedContents[item._id] ? "viewed" : "view"}
                    title="Vizualizar"
                    onClick={() => openViewModal(item._id)}
                  />,
                ]}
              />
            )}
            renderCard={(item) => (
              <Card
                key={item._id}
                fields={[
                  { label: "Título", value: item.title },
                  { label: "Tipo", value: item.fileType.toUpperCase() },
                  { label: "Etapa", value: item.treatmentStage },
                  {
                    label: "Acción",
                    value: (
                      <ActionButton
                        key={`view-${item._id}`}
                        type={viewedContents[item._id] ? "viewed" : "view"}
                        title="Vizualizar"
                        onClick={() => openViewModal(item._id)}
                      />
                    ),
                  },
                ]}
              />
            )}
          />
        </div>
      </div>

      {activeModal === "viewContent" && (
        <ModalContainer onClose={() => setActiveModal(null)} educational>
          <EducContent
            contentId={contentId}
            onClose={() => setActiveModal(null)}
          />
        </ModalContainer>
      )}
    </>
  );
}

export default EducationalContent;
