import { useState } from "react";
import PageContainer from "../components/common/PageContainer";
import Logo from "../components/common/SideBar/Logo";
import Option from "../components/common/SideBar/Option";
import SideBar from "../components/common/SideBar/SideBar";
import { useAuth } from "../context/AuthContext";
import { toggleSidebar } from "../utils/SideBar";
import Dashboard from "../components/doctor/Dashboard";
import Pacientes from "../components/doctor/Pacientes";
import Alertas from "../components/doctor/Modal Content/Alertas";
import CitasMedicas from "../components/doctor/CitasMedicas";
import ContenidoMedico from "../components/doctor/ContenidoMedico";
import Notification from "../components/common/Modals/Notification";
import ModalContainer from "../components/common/Modals/ModalContainer";
import ProfileContainer from "../components/common/Modals/ProfileContainer";
import UpdateAlert from "../components/doctor/Modal Content/UpdateAlert";
import useUnreadCounts from "../hooks/useUnreadCounts";

function DoctorPage() {
  const { signout } = useAuth();
  const [activeSection, setActiveSection] = useState("Pacientes");
  const [activeModal, setActiveModal] = useState(null);
  const [alertId, setAlertId] = useState("");
  const { unresolvedAlertCount, unreadNotifCount } = useUnreadCounts();

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
    if (section === "Alertas") {
      setActiveModal("alerts");
      return;
    }
    setActiveSection(section);
  };

  const handleSignout = async () => {
    await signout();
  };

  const menuOptions = [
    { name: "DashBoard", icon: "chart-simple", number: 0 },
    { name: "Pacientes", icon: "user-injured", number: 0 },
    { name: "Citas Medicas", icon: "calendar-check", number: 0 },
    { name: "Contenido Medico", icon: "book-medical", number: 0 },
    {
      name: "Alertas",
      icon: "triangle-exclamation",
      number: unresolvedAlertCount,
    },
    {
      name: "Notificaciones",
      icon: "bell",
      number: unreadNotifCount,
    },
    { name: "Perfil", icon: "user", number: 0 },
    { name: "Cerrar Sesion", icon: "power-off", number: 0 },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "DashBoard":
        return <Dashboard />;
      case "Pacientes":
        return <Pacientes />;
      case "Citas Medicas":
        return <CitasMedicas />;
      case "Contenido Medico":
        return <ContenidoMedico />;
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
            number={option.number}
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
      {activeModal === "alerts" && (
        <ModalContainer onClose={() => setActiveModal(null)}>
          <Alertas setAlertId={setAlertId} setActiveModal={setActiveModal} />
        </ModalContainer>
      )}
      {activeModal === "UpdateAlert" && (
        <ModalContainer onClose={() => setActiveModal("alerts")}>
          <UpdateAlert setActiveModal={setActiveModal} alertId={alertId} />
        </ModalContainer>
      )}
    </PageContainer>
  );
}

export default DoctorPage;
