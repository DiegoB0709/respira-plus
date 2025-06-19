import axios from "./axios";

export const register = (user) => axios.post(`/auth/register`, user);

export const login = (user) => axios.post(`/auth/login`, user);

export const verify = () => axios.get(`/auth/verify`);

export const logout = () => axios.post(`/auth/logout`);

export const generateToken = (user) => axios.post(`/auth/generate-token`, user);
