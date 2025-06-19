import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DoctorPage from "./pages/DoctorPage";
import AdminPage from "./pages/AdminPage";
import PatientPage from "./pages/PatientPage";
import ProtectedRoute from "./ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
          <Route path="/doctor" element={<DoctorPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
          <Route path="/patient" element={<PatientPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
