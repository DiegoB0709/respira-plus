import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageContainer from "../components/common/PageContainer";
import Notification from "../components/common/Modals/Notification";
import CitasMedicas from "../components/common/Citas Medicas/CitasMedicas";
import EducationalContent from "../components/patient/EducationalContent";
import ModalContainer from "../components/common/Modals/ModalContainer";
import ProfileContainer from "../components/common/Modals/ProfileContainer";
import useUnreadCounts from "../hooks/useUnreadCounts";
import ClinicalData from "../components/common/Modals/ClinicalData";
import PatientTreatment from "../components/common/Modals/PatientTreatment";
import TreatmentsHistory from "../components/common/Modals/TreatmentsHistory";
import SidebarToggle from "../components/common/SideBar/SidebarToggle";
import Sidebar from "../components/common/SideBar/Sidebar";
import SidebarItem from "../components/common/SideBar/SidebarItem";

function PatientPage() {
  const { signout } = useAuth();
  const [activeSection, setActiveSection] = useState("Citas Medicas");
  const [activeModal, setActiveModal] = useState(null);
  const { unreadNotifCount } = useUnreadCounts();
  const [open, setOpen] = useState(false);

  const { user } = useAuth();

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
    if (section === "Tratamiento") {
      setActiveModal("treatment");
      return;
    }
    if (section === "Datos Clinicos") {
      setActiveModal("ClinicalDetails");
      return;
    }
    setActiveSection(section);
  };

  const handleSignout = async () => {
    await signout();
  };

  const menuOptions = [
    { name: "Citas Medicas", icon: "fa-calendar-check", number: 0 },
    { name: "Tratamiento", icon: "fa-capsules", number: 0 },
    { name: "Datos Clinicos", icon: "fa-file-medical", number: 0 },
    { name: "Contenido Educativo", icon: "fa-book-open-reader", number: 0 },
    { name: "Notificaciones", icon: "fa-bell", number: unreadNotifCount },
    { name: "Perfil", icon: "fa-user", number: 0 },
    { name: "Cerrar Sesion", icon: "fa-right-from-bracket", number: 0 },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Citas Medicas":
        return <CitasMedicas />;
      case "Contenido Educativo":
        return <EducationalContent />;
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
      {activeModal === "treatment" && (
        <ModalContainer
          onClose={() => setActiveModal(null)}
          title={"Tratamiento"}
          icon={"fa-capsules"}
        >
          <PatientTreatment
            patientId={user.id}
            setActiveModal={setActiveModal}
          />
        </ModalContainer>
      )}
      {activeModal === "treatmentHistory" && (
        <ModalContainer
          onClose={() => setActiveModal("treatment")}
          title={"Historial de Tratamientos"}
          icon={"fa-history"}
        >
          <TreatmentsHistory
            patientId={user.id}
            setActiveModal={() => setActiveModal("treatment")}
          />
        </ModalContainer>
      )}
      {activeModal === "ClinicalDetails" && (
        <ModalContainer
          onClose={() => setActiveModal(null)}
          title={"Datos Clinicos"}
          icon={"fa-file-medical"}
        >
          <ClinicalData patientId={user.id} />
        </ModalContainer>
      )}
    </PageContainer>
  );
}

export default PatientPage;
