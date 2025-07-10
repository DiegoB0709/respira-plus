import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageContainer from "../components/common/PageContainer";
import SideBar from "../components/common/SideBar/SideBar";
import { toggleSidebar } from "../utils/SideBar";
import Logo from "../components/common/SideBar/Logo";
import Option from "../components/common/SideBar/Option";
import Notification from "../components/common/Modals/Notification";
import Home from "../components/patient/Home";
import CitasMedicas from "../components/patient/CitasMedicas";
import Treatment from "../components/patient/Treatment";
import ClinicalDetails from "../components/patient/ClinicalDetails";
import EducationalContent from "../components/patient/EducationalContent";
import ModalContainer from "../components/common/Modals/ModalContainer";
import ProfileContainer from "../components/common/Modals/ProfileContainer";
import useUnreadCounts from "../hooks/useUnreadCounts";

function PatientPage() {
  const { signout } = useAuth();
  const [activeSection, setActiveSection] = useState("Inicio");
  const [activeModal, setActiveModal] = useState(null);
    const { unreadNotifCount } = useUnreadCounts();
  

  const handleSectionClick = (section) => {
    if (section === "Cerrar Sesion") {
      handleSignout();
      return;
    }
    if (section === "Notificaciones") {
      setActiveModal("notification");
      return;
    }
    if (section === "Perfil") {
      setActiveModal("profile");
      return;
    }
    setActiveSection(section);
  };

  const handleSignout = async () => {
    await signout();
  };

  const menuOptions = [
    { name: "Inicio", icon: "house", number: 0 },
    { name: "Citas Medicas", icon: "calendar-check", number: 0 },
    { name: "Tratamiento", icon: "capsules", number: 0 },
    { name: "Detalles Clinicos", icon: "file-medical", number: 0 },
    { name: "Contenido Educativo", icon: "book-open-reader", number: 0 },
    { name: "Notificaciones", icon: "bell", number: unreadNotifCount },
    { name: "Perfil", icon: "user", number: 0 },
    { name: "Cerrar Sesion", icon: "power-off", number: 0 },
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
            number={option.number}
            name={option.name}
            active={activeSection === option.name}
            handleSectionClick={() => handleSectionClick(option.name)}
          />
        ))}
      </SideBar>
      <main>
        <div className="main-content">{renderContent()}</div>
      </main>
      {activeModal === "notification" && (
        <ModalContainer onClose={() => setActiveModal(null)}>
          <Notification />
        </ModalContainer>
      )}
      {activeModal === "profile" && (
        <ModalContainer onClose={() => setActiveModal(null)}>
          <ProfileContainer />
        </ModalContainer>
      )}
    </PageContainer>
  );
}

export default PatientPage;
