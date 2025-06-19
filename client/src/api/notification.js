import axios from "./axios";

export const getUserNotifications = () => axios.get("/notifications");

export const markAsRead = (id) => axios.put(`/notifications/${id}/read`);

export const markAllAsRead = () => axios.put("/notifications/read-all");

export const deleteNotification = (id) => axios.delete(`/notifications/${id}`);
