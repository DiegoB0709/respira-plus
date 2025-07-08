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


  const SwitchToRegister = () => setIsRegisterActive(true);
  const SwitchToLogin = () => setIsRegisterActive(false);
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-white">
      <div className="w-full max-w-sm md:max-w-md md:scale-[1.25]">
        <div className="flex justify-center items-center gap-2">
          <i className="fa-solid fa-lungs text-teal-400 text-4xl"></i>
          <p className="text-teal-500 pb-3 text-3xl font-bold tracking-wide">
            Respira
            <span className="text-teal-400 pb-0 text-5xl font-bold tracking-wide">
              +
            </span>
          </p>
        </div>

        <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
          {isRegisterActive ? "Crear perfil" : "Ingresa a tu cuenta"}
        </h2>

        {isRegisterActive ? <RegisterForm /> : <LoginForm />}

        <p className="mt-10 text-center text-sm text-gray-500">
          {isRegisterActive ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <a
            href="#"
            className="font-semibold text-teal-500 hover:text-teal-400 cursor-pointer duration-150 ease-in-out"
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
