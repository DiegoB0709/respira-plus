import { createContext, useContext, useState, useEffect } from "react";
import {
  register,
  login,
  verify,
  logout as logoutRequest,
  generateToken,
} from "../api/auth";
import { handleApiError } from "../utils/handleError";
import { useAutoClearErrors } from "../hooks/useAutoClearErrors";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (userData) => {
    try {
      const res = await register(userData);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      handleApiError(error, "Error al registrar", setErrors);
    }
  };

  const signin = async (credentials) => {
    try {
      const res = await login(credentials);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      handleApiError(error, "Error al iniciar sesión", setErrors);
    }
  };

  const signout = async () => {
    try {
      await logoutRequest();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const createRegistrationToken = async (data) => {
    try {
      const res = await generateToken(data);
      return res.data.token;
    } catch (error) {
      handleApiError(error, "Error al generar token", setErrors);
      return null;
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await verify();
        setIsAuthenticated(true);
        setUser(res.data);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        handleApiError(error, "Error al verificar la sesión", setErrors);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  useAutoClearErrors(errors, setErrors);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        errors,
        signup,
        signin,
        signout,
        createRegistrationToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
