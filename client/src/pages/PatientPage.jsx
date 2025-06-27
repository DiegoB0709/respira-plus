import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageContainer from "../components/common/PageContainer";
import SideBar from "../components/common/SideBar/SideBar";
import { toggleSidebar } from "../utils/SideBar";
import Logo from "../components/common/SideBar/Logo";
import Option from "../components/common/SideBar/Option";
import Notification from "../components/common/Modals/Notification";
import Perfil from "../components/common/Perfil";
import Home from "../components/patient/Home";
import CitasMedicas from "../components/patient/CitasMedicas";
import Treatment from "../components/patient/Treatment";
import ClinicalDetails from "../components/patient/ClinicalDetails";
import EducationalContent from "../components/patient/EducationalContent";

function PatientPage() {
  const { signout } = useAuth();
  const [activeSection, setActiveSection] = useState("Inicio");
  const [activeNotification, setActiveNotification] = useState(false);

  const handleOpenNotification = () => setActiveNotification(true);
  const handleCloseNotification = () => setActiveNotification(false);

  const handleSectionClick = (section) => {
    if (section === "Cerrar Sesion") {
      handleSignout();
      return;
    }
    if (section === "Notificaciones") {
      handleOpenNotification();
      return;
    }
    setActiveSection(section);
  };

  const handleSignout = async () => {
    await signout();
  };

  const menuOptions = [
    { name: "Inicio", icon: "house" },
    { name: "Citas Medicas", icon: "calendar-check" },
    { name: "Tratamiento", icon: "capsules" },
    { name: "Detalles Clinicos", icon: "file-medical" },
    { name: "Contenido Educativo", icon: "book-open-reader" },
    { name: "Notificaciones", icon: "bell"},
    { name: "Perfil", icon: "user" },
    { name: "Cerrar Sesion", icon: "power-off" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Inicio":
        return <Home />;
      case "Citas Medicas":
        return <CitasMedicas />;
      case "Tratamiento":
        return <Treatment />;
      case "Detalles Clinicos":
        return <ClinicalDetails />;
      case "Contenido Educativo":
        return <EducationalContent />;
      case "Perfil":
        return <Perfil />;
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <SideBar>
        <Logo toggleSidebar={toggleSidebar} />
        {menuOptions.map((option) => (
          <Option
            key={option.name}
            icon={option.icon}
            name={option.name}
            active={activeSection === option.name}
            handleSectionClick={() => handleSectionClick(option.name)}
          />
        ))}
      </SideBar>
      <main>
        <div className="main-content">
          {renderContent()}
          {activeNotification && (
            <Notification onClose={handleCloseNotification} />
          )}
        </div>
      </main>
    </PageContainer>
  );
}

export default PatientPage;
