import { useState } from "react";
import PageContainer from "../components/common/PageContainer";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../components/doctor/Dashboard";
import Pacientes from "../components/doctor/Pacientes";
import Alertas from "../components/doctor/Modal Content/Alertas";
import CitasMedicas from "../components/common/Citas Medicas/CitasMedicas";
import ContenidoMedico from "../components/doctor/ContenidoMedico";
import Notification from "../components/common/Modals/Notification";
import ModalContainer from "../components/common/Modals/ModalContainer";
import ProfileContainer from "../components/common/Modals/ProfileContainer";
import UpdateAlert from "../components/doctor/Modal Content/UpdateAlert";
import useUnreadCounts from "../hooks/useUnreadCounts";
import SidebarToggle from "../components/common/SideBar/SidebarToggle";
import Sidebar from "../components/common/SideBar/Sidebar";
import SidebarItem from "../components/common/SideBar/SidebarItem";

function DoctorPage() {
  const { signout } = useAuth();
  const [activeSection, setActiveSection] = useState("DashBoard");
  const [activeModal, setActiveModal] = useState(null);
  const [alertId, setAlertId] = useState("");
  const { unresolvedAlertCount, unreadNotifCount } = useUnreadCounts();
  const [open, setOpen] = useState(false);

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
    { name: "DashBoard", icon: "fa-chart-simple", number: 0 },
    { name: "Pacientes", icon: "fa-user-injured", number: 0 },
    { name: "Citas Medicas", icon: "fa-calendar-check", number: 0 },
    { name: "Contenido Medico", icon: "fa-book-medical", number: 0 },
    {
      name: "Alertas",
      icon: "fa-triangle-exclamation",
      number: unresolvedAlertCount,
    },
    {
      name: "Notificaciones",
      icon: "fa-bell",
      number: unreadNotifCount,
    },
    { name: "Perfil", icon: "fa-user", number: 0 },
    { name: "Cerrar Sesion", icon: "fa-right-from-bracket", number: 0 },
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
      <SidebarToggle isOpen={open} onClick={() => setOpen(!open)} />
      <Sidebar isOpen={open}>
        {menuOptions.map((option) => (
          <SidebarItem
            key={option.name}
            label={option.name}
            icon={option.icon}
            badge={option.number}
            active={activeSection === option.name}
            handleSectionClick={handleSectionClick}
          />
        ))}
      </Sidebar>

      <main className="overflow-y-auto p-[min(30px,7%)]">
        <div>{renderContent()}</div>
      </main>
      {activeModal === "notification" && (
        <ModalContainer
          onClose={() => setActiveModal(null)}
          title={"Notificaciones"}
          icon={"fa-bell"}
          unread={unreadNotifCount}
        >
          <Notification />
        </ModalContainer>
      )}
      {activeModal === "profile" && (
        <ModalContainer onClose={() => setActiveModal(null)}>
          <ProfileContainer />
        </ModalContainer>
      )}
      {activeModal === "alerts" && (
        <ModalContainer
          onClose={() => setActiveModal(null)}
          title={"Alertas"}
          icon={"fa-triangle-exclamation"}
          unresolved={unresolvedAlertCount}
        >
          <Alertas setAlertId={setAlertId} setActiveModal={setActiveModal} />
        </ModalContainer>
      )}
      {activeModal === "UpdateAlert" && (
        <ModalContainer
          onClose={() => setActiveModal("alerts")}
          title={"Actualizar Alerta"}
          icon={"fa-triangle-exclamation"}
        >
          <UpdateAlert setActiveModal={setActiveModal} alertId={alertId} />
        </ModalContainer>
      )}
    </PageContainer>
  );
}

export default DoctorPage;
