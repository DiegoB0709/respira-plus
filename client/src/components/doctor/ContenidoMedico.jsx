import { useEffect, useState } from "react";
import ModalContainer from "../common/Modals/ModalContainer";
import EducationalForm from "./Modal Content/EducationalForm";
import { useEducational } from "../../context/EducationalContext";
import ResponsiveTable from "../common/Table/ResponsiveTable";
import TableRow from "../common/Table/TableRow";
import Card from "../common/Table/Card";
import ActionButton from "../common/Buttons/ActionButton";
import EducContent from "../common/Modals/EducContent";
import Title from "../Title";
import Input from "../common/Imput/Input";
import Button from "../common/Buttons/Button";
import Toast from "../common/Toast/Toast";

function ContenidoMedico() {
  const { fetchMyUploads, doctorUploads, errors } = useEducational();
  const { items: myUploads, total, page, totalPages } = doctorUploads;

  const [activeModal, setActiveModal] = useState(null);
  const [contentId, setContentId] = useState(null);
  const [filters, setFilters] = useState({
    title: "",
    treatmentStage: "",
    symptom: "",
    page: 1,
    limit: 10,
  });

  const headers = ["Título", "Tipo", "Etapa", "Acción"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === "limit" || name === "page" ? parseInt(value) : value,
      page: name === "limit" ? 1 : prev.page,
    }));
  };

  useEffect(() => {
    fetchMyUploads(filters);
  }, [filters]);

  const openViewModal = (id) => {
    setContentId(id);
    setActiveModal("viewContent");
  };

  const formatFileType = (type) => {
    if (!type) return "";
    return type.toLowerCase() === "image"
      ? "Imagen"
      : type.toLowerCase() === "video"
      ? "Video"
      : type.toUpperCase();
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
      {errors.length > 0 &&
        errors.map((e, i) => <Toast key={i} type="error" message={e} />)}
      <div className="p-4 max-w-7xl mx-auto transition-colors duration-300 ease-in-out">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <Title icon="fa-book-medical" title="Contenido Médico" />

          <Button
            onClick={() => setActiveModal("subirContenido")}
            icon="fa-upload"
            label="Subir Contenido"
            full={false}
            type="bg1"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-700 dark:text-neutral-50 mb-2 transition-colors duration-300 ease-in-out">
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
          headers={headers}
          data={myUploads}
          total={total}
          page={page}
          totalPages={totalPages}
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
                  type="view"
                  title="Visualizar"
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
                {
                  label: "Acción",
                  value: (
                    <ActionButton
                      key={`view-${item._id}`}
                      type="view"
                      title="Visualizar"
                      onClick={() => openViewModal(item._id)}
                    />
                  ),
                },
              ]}
            />
          )}
        />
      </div>

      {activeModal === "subirContenido" && (
        <ModalContainer
          onClose={() => setActiveModal(null)}
          title={"Subir Contenido"}
          icon={"fa-upload"}
        >
          <EducationalForm setActiveModal={setActiveModal} />
        </ModalContainer>
      )}
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

export default ContenidoMedico;
