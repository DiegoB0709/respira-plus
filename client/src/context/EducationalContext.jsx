import { createContext, useContext, useState } from "react";
import {
  getRecommendedContentForPatient,
  registerContentView,
  getEducationalHistory,
  getPublicEducationalContent,
  uploadEducationalContent,
  getDoctorUploads,
  updateEducationalContent,
  deleteEducationalContent,
  getEducationalContentById,
} from "../api/educational";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

const EducationalContext = createContext();

export const useEducational = () => {
  const context = useContext(EducationalContext);
  if (!context) {
    throw new Error("useEducational debe usarse dentro de EducationalProvider");
  }
  return context;
};

export const EducationalProvider = ({ children }) => {
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [publicContent, setPublicContent] = useState([]);
  const [myUploads, setMyUploads] = useState([]);
  const [contentDetails, setContentDetails] = useState(null);
  const [history, setHistory] = useState([]);
  const [errors, setErrors] = useState([]);

  const fetchRecommendedContent = async () => {
    setErrors([]);
    try {
      const res = await getRecommendedContentForPatient();
      setRecommendedContent(res.data.recommended);
    } catch (error) {
      handleApiError(
        error,
        "Error al obtener recomendaciones educativas",
        setErrors
      );
    }
  };

  const markContentAsViewed = async (contentId) => {
    setErrors([]);
    try {
      await registerContentView(contentId);
    } catch (error) {
      handleApiError(error, "Error al registrar visualización", setErrors);
    }
  };

  const fetchEducationalHistory = async () => {
    setErrors([]);
    try {
      const res = await getEducationalHistory();
      setHistory(res.data.history);
    } catch (error) {
      handleApiError(error, "Error al obtener historial educativo", setErrors);
    }
  };

  const fetchPublicContent = async () => {
    setErrors([]);
    try {
      const res = await getPublicEducationalContent();
      setPublicContent(res.data.contents);
    } catch (error) {
      handleApiError(error, "Error al obtener contenido público", setErrors);
    }
  };

  const fetchMyUploads = async () => {
    setErrors([]);
    try {
      const res = await getDoctorUploads();
      setMyUploads(res.data.uploads);
    } catch (error) {
      handleApiError(
        error,
        "Error al obtener mis contenidos educativos",
        setErrors
      );
    }
  };

  const createEducationalContent = async (data) => {
    setErrors([]);
    try {
      await uploadEducationalContent(data);
      fetchMyUploads();
    } catch (error) {
      handleApiError(error, "Error al subir contenido educativo", setErrors);
    }
  };

  const editEducationalContent = async (id, data) => {
    setErrors([]);
    try {
      await updateEducationalContent(id, data);
      fetchMyUploads();
    } catch (error) {
      handleApiError(error, "Error al actualizar contenido", setErrors);
    }
  };

  const removeEducationalContent = async (id) => {
    setErrors([]);
    try {
      await deleteEducationalContent(id);
      fetchMyUploads();
    } catch (error) {
      handleApiError(error, "Error al eliminar contenido", setErrors);
    }
  };

  const fetchEducationalContentById = async (id) => {
    setErrors([]);
    try {
      const res = await getEducationalContentById(id);
      setContentDetails(res.data.content);
    } catch (error) {
      handleApiError(
        error,
        "Error al obtener detalles del contenido",
        setErrors
      );
    }
  };

  useAutoClearErrors(errors, setErrors);

  return (
    <EducationalContext.Provider
      value={{
        recommendedContent,
        publicContent,
        myUploads,
        contentDetails,
        history,
        errors,
        fetchRecommendedContent,
        markContentAsViewed,
        fetchEducationalHistory,
        fetchPublicContent,
        fetchMyUploads,
        createEducationalContent,
        editEducationalContent,
        removeEducationalContent,
        fetchEducationalContentById,
      }}
    >
      {children}
    </EducationalContext.Provider>
  );
};
