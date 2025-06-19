import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import DoctorPage from "./pages/DoctorPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import PatientPage from "./pages/PatientPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/patient" element={<PatientPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
