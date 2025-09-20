import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

function AuthPage() {
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "doctor":
          navigate("/doctor");
          break;
        case "patient":
          navigate("/patient");
          break;
        default:
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    document.title = "Respira+";
  }, []);

  const SwitchToRegister = () => setIsRegisterActive(true);
  const SwitchToLogin = () => setIsRegisterActive(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-gray-50 dark:bg-neutral-900 transition-colors duration-300 ease-in-out">
      <div className="w-full max-w-sm md:max-w-md bg-white dark:bg-neutral-800 md:scale-[1.25] rounded-2xl shadow-xl p-12 transition-colors duration-300 ease-in-out">
        <div className="flex justify-center items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
            <i className="fa-solid fa-lungs text-4xl"></i>
            <p className="text-3xl font-extrabold tracking-wide flex items-end">
              Respira
              <span className="text-5xl font-extrabold tracking-wide ml-1">
                +
              </span>
            </p>
          </span>
        </div>

        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-neutral-50 mb-6 transition-colors duration-300 ease-in-out">
          {isRegisterActive ? "Crear tu perfil" : "Ingresa a tu cuenta"}
        </h2>

        {isRegisterActive ? <RegisterForm /> : <LoginForm />}

        <p className="mt-5 text-center text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-300 ease-in-out">
          {isRegisterActive ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <a
            href="#"
            className="font-semibold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent cursor-pointer duration-300 ease-in-out hover:from-cyan-500 hover:to-teal-400"
            onClick={(e) => {
              e.preventDefault();
              isRegisterActive ? SwitchToLogin() : SwitchToRegister();
            }}
          >
            {isRegisterActive ? "Inicia Sesión" : "Regístrate"}
          </a>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
