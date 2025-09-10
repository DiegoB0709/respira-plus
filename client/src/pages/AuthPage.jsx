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
    <div className="flex min-h-screen items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-sm md:max-w-md bg-white md:scale-[1.25] rounded-2xl shadow-xl p-12">
        <div className="flex justify-center items-center gap-2 mb-6">
          <i className="fa-solid fa-lungs text-teal-400 text-4xl"></i>
          <p className="text-teal-500 text-3xl font-bold tracking-wide">
            Respira
            <span className="text-teal-400 text-5xl font-bold tracking-wide">
              +
            </span>
          </p>
        </div>

        <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">
          {isRegisterActive ? "Crear perfil" : "Ingresa a tu cuenta"}
        </h2>

        {isRegisterActive ? (
          <RegisterForm
            inputClassName="rounded-xl border-gray-300 focus:ring-teal-400 focus:border-teal-400"
            buttonClassName="rounded-2xl bg-teal-500 hover:bg-teal-400 text-white py-3 px-6 mt-4 w-full"
            labelIcon={(iconClass) => <i className={`${iconClass} mr-2`}></i>}
          />
        ) : (
          <LoginForm
            inputClassName="rounded-xl border-gray-300 focus:ring-teal-400 focus:border-teal-400"
            buttonClassName="rounded-2xl bg-teal-500 hover:bg-teal-400 text-white py-3 px-6 mt-4 w-full"
            labelIcon={(iconClass) => <i className={`${iconClass} mr-2`}></i>}
          />
        )}

        <p className="mt-5 text-center text-sm text-gray-500">
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
