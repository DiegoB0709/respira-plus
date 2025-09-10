import { createContext, useContext, useState } from "react";
import * as api from "../api/educational";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

const EducationalContext = createContext();

export const useEducational = () => {
  const context = useContext(EducationalContext);
  if (!context)
    throw new Error("useEducational debe usarse dentro de EducationalProvider");
  return context;
};

export const EducationalProvider = ({ children }) => {
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [publicContent, setPublicContent] = useState([]);
  const [publicMeta, setPublicMeta] = useState(null);
  const [doctorUploads, setDoctorUploads] = useState({
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [contentDetails, setContentDetails] = useState(null);
  const [history, setHistory] = useState([]);
  const [errors, setErrors] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const fetchEducationalContentForPatient = async (filters = {}) => {
    setErrors([]);
    try {
      const res = await api.getEducationalContentForPatient(filters);
      setRecommendedContent(res.data.recommended || []);
      setPublicContent(res.data.public || []);
      setAnalysis(res.data.analysis || null);
      setPublicMeta(res.data.pagination || null);
    } catch (error) {
      handleApiError(
        error,
        "Error al obtener contenidos educativos del paciente",
        setErrors
      );
    }
  };

  const markContentAsViewed = async (contentId) => {
    setErrors([]);
    try {
      await api.registerContentView(contentId);
    } catch (error) {
      handleApiError(error, "Error al registrar visualización", setErrors);
    }
  };

  const fetchEducationalHistory = async (id) => {
    setErrors([]);
    try {
      const res = await api.getEducationalHistory(id);
      setHistory(res.data.history || []);
    } catch (error) {
      handleApiError(error, "Error al obtener historial educativo", setErrors);
    }
  };

  const fetchMyUploads = async (filters = {}) => {
    setErrors([]);
    try {
      const res = await api.getDoctorUploads(filters);
      setDoctorUploads({
        items: res.data.uploads || [],
        total: res.data.total || 0,
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1,
      });
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
      await api.uploadEducationalContent(data);
      fetchMyUploads();
    } catch (error) {
      handleApiError(error, "Error al subir contenido educativo", setErrors);
    }
  };

  const editEducationalContent = async (id, data) => {
    setErrors([]);
    try {
      await api.updateEducationalContent(id, data);
      fetchMyUploads();
    } catch (error) {
      handleApiError(error, "Error al actualizar contenido", setErrors);
    }
  };

  const removeEducationalContent = async (id) => {
    setErrors([]);
    try {
      await api.deleteEducationalContent(id);
      fetchMyUploads();
    } catch (error) {
      handleApiError(error, "Error al eliminar contenido", setErrors);
    }
  };

  const fetchEducationalContentById = async (id) => {
    setErrors([]);
    try {
      const res = await api.getEducationalContentById(id);
      setContentDetails(res.data.content || null);
    } catch (error) {
      handleApiError(
        error,
        "Error al obtener detalles del contenido",
        setErrors
      );
    }
  };

  const fetchEducationalHistoryByContent = async (contentId) => {
    setErrors([]);
    try {
      const res = await api.getEducationalHistoryByContent(contentId);
      return res.data.history || null;
    } catch (error) {
      handleApiError(
        error,
        "Error al obtener historial por contenido",
        setErrors
      );
      return null;
    }
  };

  useAutoClearErrors(errors, setErrors);

  return (
    <EducationalContext.Provider
      value={{
        recommendedContent,
        publicContent,
        publicMeta,
        doctorUploads,
        contentDetails,
        history,
        errors,
        analysis,
        fetchEducationalContentForPatient,
        markContentAsViewed,
        fetchEducationalHistory,
        fetchMyUploads,
        createEducationalContent,
        editEducationalContent,
        removeEducationalContent,
        fetchEducationalContentById,
        fetchEducationalHistoryByContent,
      }}
    >
      {children}
    </EducationalContext.Provider>
  );
};
