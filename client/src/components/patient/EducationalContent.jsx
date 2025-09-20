import { useEffect, useState } from "react";
import { useEducational } from "../../context/EducationalContext";
import ResponsiveTable from "../common/Table/ResponsiveTable";
import TableRow from "../common/Table/TableRow";
import Card from "../common/Table/Card";
import EducContent from "../common/Modals/EducContent";
import ModalContainer from "../common/Modals/ModalContainer";
import ActionButton from "../common/Buttons/ActionButton";
import Title from "../Title";
import Input from "../common/Imput/Input";

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

  const fields = [
    {
      type: "text",
      name: "title",
      label: "Título",
      icon: "fa-heading",
      placeholder: "Ej. Nutrición básica",
    },
    {
      type: "text",
      name: "symptom",
      label: "Síntoma",
      icon: "fa-notes-medical",
      placeholder: "Ej. Dolor de cabeza",
    },
    {
      type: "select",
      name: "treatmentStage",
      label: "Etapa de tratamiento",
      icon: "fa-stethoscope",
      placeholder: "Todas",
      options: [
        { value: "inicio", label: "Inicio" },
        { value: "intermedio", label: "Intermedio" },
        { value: "final", label: "Final" },
        { value: "indefinido", label: "Indefinido" },
      ],
    },
  ];


  return (
    <>
      <div className="p-4 max-w-7xl mx-auto transition-colors duration-300 ease-in-out">
        <Title icon="fa-book-medical" title="Contenido Educativo" />

        {recommendedContent.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-50 mt-8 mb-2 transition-colors duration-300 ease-in-out">
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
          <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-50 mb-2 transition-colors duration-300 ease-in-out">
            Contenido Público
          </h3>

          <h3 className="text-lg font-semibold text-gray-700 dark:text-neutral-300 mb-2 transition-colors duration-300 ease-in-out">
            Filtrar por:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {fields.map((field, i) => (
              <Input
                key={i}
                {...field}
                value={filters[field.name]}
                onChange={handleChange}
              />
            ))}
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
