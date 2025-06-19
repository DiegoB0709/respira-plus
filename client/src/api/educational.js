import axios from "./axios";

export const getRecommendedContentForPatient = () =>
  axios.get("/educational/recommendations");

export const registerContentView = (contentId) =>
  axios.post(`/educational/view/${contentId}`);

export const getEducationalHistory = () => axios.get("/educational/history");

export const getPublicEducationalContent = () =>
  axios.get("/educational/public");

export const uploadEducationalContent = (data) =>
  axios.post("/educational/upload", data);

export const getDoctorUploads = () => axios.get("/educational/my-uploads");

export const updateEducationalContent = (id, data) =>
  axios.put(`/educational/edit/${id}`, data);

export const deleteEducationalContent = (id) =>
  axios.delete(`/educational/delete/${id}`);

export const getEducationalContentById = (id) =>
  axios.get(`/educational/${id}`);
