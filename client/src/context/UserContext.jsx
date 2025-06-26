import { createContext, useContext, useState } from "react";
import { getAllUsers, getUserProfile, updateUser } from "../api/user"; // asegúrate que esta ruta sea correcta
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";

export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await getAllUsers(filters);
      setUsers(res.data.users || []);
      setTotalUsers(res.data.total || 0);
    } catch (error) {
      handleApiError(error, "Error al obtener usuarios", setErrors);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await getUserProfile();
      setProfile(res.data);
    } catch (error) {
      handleApiError(error, "Error al obtener perfil de usuario", setErrors);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentUser = async (userData) => {
    try {
      const res = await updateUser(userData);
      setProfile(res.data);
      return res.data;
    } catch (error) {
      handleApiError(error, "Error al actualizar usuario", setErrors);
      return null;
    }
  };

  useAutoClearErrors(errors, setErrors);

  return (
    <UserContext.Provider
      value={{
        users,
        totalUsers,
        profile,
        loading,
        errors,
        fetchUsers,
        fetchUserProfile,
        updateCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
