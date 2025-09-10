import { useEffect, useState } from "react";
import ModalContainer from "../common/Modals/ModalContainer";
import EducationalForm from "./Modal Content/EducationalForm";
import { useEducational } from "../../context/EducationalContext";
import ResponsiveTable from "../common/Table/ResponsiveTable";
import TableRow from "../common/Table/TableRow";
import Card from "../common/Table/Card";
import ActionButton from "../common/Buttons/ActionButton";
import EducContent from "../common/Modals/EducContent";

function ContenidoMedico() {
  const { fetchMyUploads, doctorUploads } = useEducational();
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

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal-500 flex items-center gap-3">
            <i className="fa-solid fa-book-medical text-teal-400 text-2xl"></i>
            Contenido Médico
          </h2>

          <button
            onClick={() => setActiveModal("subirContenido")}
            className="cursor-pointer w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-2xl text-sm font-bold transition inline-flex items-center gap-2"
          >
            <i className="fas fa-upload"></i>
            Subir Contenido
          </button>
        </div>

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
        <ModalContainer onClose={() => setActiveModal(null)}>
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
