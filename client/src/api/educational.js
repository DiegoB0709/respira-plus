import axios from "./axios";

export const getEducationalContentForPatient = (filters) =>
  axios.get("/educational/recommendations", { params: filters });

export const registerContentView = (contentId) =>
  axios.post(`/educational/view/${contentId}`);

export const getEducationalHistory = (id) =>
  axios.get(`/educational/history/patient/${id}`);

export const uploadEducationalContent = (data) =>
  axios.post("/educational/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getDoctorUploads = (filters) =>
  axios.get("/educational/my-uploads", { params: filters });

export const updateEducationalContent = (id, data) =>
  axios.put(`/educational/edit/${id}`, data);

export const deleteEducationalContent = (id) =>
  axios.delete(`/educational/delete/${id}`);

export const getEducationalContentById = (id) =>
  axios.get(`/educational/${id}`);

export const getEducationalHistoryByContent = (contentId) =>
  axios.get(`/educational/history/${contentId}`);
