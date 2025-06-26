import axios from "./axios";

export const getAllUsers = (filters = {}) => {
  return axios.get("/user", { params: filters });
};

export const getUserProfile = () => axios.get(`/user/profile`);

export const updateUser = (user) => axios.patch(`/user/update`, user);