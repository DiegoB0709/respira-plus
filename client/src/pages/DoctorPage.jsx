import { useState } from "react";
import PageContainer from "../components/common/PageContainer";
import Logo from "../components/common/SideBar/Logo";
import Option from "../components/common/SideBar/Option";
import SideBar from "../components/common/SideBar/SideBar";
import { useAuth } from "../context/AuthContext";
import { toggleSidebar } from "../utils/SideBar";
import Dashboard from "../components/doctor/Dashboard";
import Pacientes from "../components/doctor/Pacientes";
import EvaluatePatients from "../components/doctor/EvaluatePatients";
import Alertas from "../components/doctor/Alertas";
import CitasMedicas from "../components/doctor/CitasMedicas";
import ContenidoMedico from "../components/doctor/ContenidoMedico";
import Treatment from "../components/doctor/Treatment";
import Notification from "../components/common/Modals/Notification";
import ModalContainer from "../components/common/Modals/ModalContainer";
import ProfileContainer from "../components/common/Modals/ProfileContainer";

function DoctorPage() {
  const { signout } = useAuth();
  const [activeSection, setActiveSection] = useState("DashBoard");
  const [activeNotification, setActiveNotification] = useState(false);
  const [activeProfile, setActiveProfile] = useState(false);

  const handleOpenNotification = () => setActiveNotification(true);
  const handleCloseNotification = () => setActiveNotification(false);

  const handleOpenProfile = () => setActiveProfile(true);
  const handleCloseProfile = () => setActiveProfile(false);

  const handleSectionClick = (section) => {
    if (section === "Cerrar Sesion") {
      handleSignout();
      return;
    }
    if (section === "Notificaciones") {
      handleOpenNotification();
      return;
    }
    if (section === "Perfil") {
      handleOpenProfile();
      return;
    }
    setActiveSection(section);
  };

  const handleSignout = async () => {
    await signout();
  };

  const menuOptions = [
    { name: "DashBoard", icon: "chart-simple" },
    { name: "Pacientes", icon: "user-injured" },
    { name: "Evaluar Pacientes", icon: "clipboard-check" },
    { name: "Alertas", icon: "triangle-exclamation" },
    { name: "Citas Medicas", icon: "calendar-check" },
    { name: "Contenido Medico", icon: "book-medical" },
    { name: "Tratamiento de Pacientes", icon: "notes-medical" },
    { name: "Notificaciones", icon: "bell" },
    { name: "Perfil", icon: "user" },
    { name: "Cerrar Sesion", icon: "power-off" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "DashBoard":
        return <Dashboard />;
      case "Pacientes":
        return <Pacientes />;
      case "Evaluar Pacientes":
        return <EvaluatePatients />;
      case "Alertas":
        return <Alertas />;
      case "Citas Medicas":
        return <CitasMedicas />;
      case "Contenido Medico":
        return <ContenidoMedico />;
      case "Tratamiento de Pacientes":
        return <Treatment />;
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
            <ModalContainer onClose={handleCloseNotification}>
              <Notification />
            </ModalContainer>
          )}
          {activeProfile && (
            <ModalContainer onClose={handleCloseProfile}>
              <ProfileContainer />
            </ModalContainer>
          )}
        </div>
      </main>
    </PageContainer>
  );
}

export default DoctorPage;
