import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DoctorPage from "./pages/DoctorPage";
import AdminPage from "./pages/AdminPage";
import PatientPage from "./pages/PatientPage";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./pages/NotFound";

function ThemeToggleButton({ onClick, isDark }) {
  return (
    <button
      onClick={onClick}
      aria-label="Cambiar tema"
      className={`fixed bottom-8 right-8 z-50
        w-14 h-14 flex items-center justify-center
        rounded-full shadow-lg cursor-pointer
        focus:outline-none
        transform transition-all duration-500 ease-in-out
        hover:scale-110 active:scale-95
        ${
          isDark
            ? "bg-sky-300 hover:bg-sky-400 hover:text-yellow-300"
            : "bg-slate-900 hover:bg-slate-950 hover:text-yellow-400"
        }`}
    >
      <i
        className={`fa-solid transition-transform duration-500 ease-in-out
          ${
            isDark
              ? "fa-sun text-yellow-200 rotate-0"
              : "fa-moon text-yellow-300 rotate-220"
          }
          text-xl`}
      ></i>
    </button>
  );
}

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      if (savedTheme === "dark") {
        document.body.classList.add("dark");
        setIsDark(true);
      }
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.classList.add("dark");
        setIsDark(true);
        localStorage.setItem("theme", "dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
          <Route path="/doctor" element={<DoctorPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
          <Route path="/patient" element={<PatientPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ThemeToggleButton onClick={toggleTheme} isDark={isDark} />
    </BrowserRouter>
  );
}

export default App;
