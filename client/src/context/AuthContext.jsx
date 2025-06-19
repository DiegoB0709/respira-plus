import { createContext, useContext, useState, useEffect } from "react";
import {
  register,
  login,
  verify,
  logout as logoutRequest,
  generateToken,
} from "../api/auth";
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
      handleErrors(error);
    }
  };

  const signin = async (credentials) => {
    try {
      const res = await login(credentials);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      handleErrors(error);
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
      handleErrors(error);
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
        console.error("Error al verificar el usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleErrors = (error) => {
    if (Array.isArray(error.response?.data)) {
      setErrors(error.response.data);
    } else if (error.response?.data?.message) {
      setErrors([error.response.data.message]);
    } else {
      setErrors(["Ocurrió un error inesperado"]);
    }
  };

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
