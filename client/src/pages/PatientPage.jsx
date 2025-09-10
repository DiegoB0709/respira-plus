import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PageContainer from "../components/common/PageContainer";
import SideBar from "../components/common/SideBar/SideBar";
import { toggleSidebar } from "../utils/SideBar";
import Logo from "../components/common/SideBar/Logo";
import Option from "../components/common/SideBar/Option";
import Notification from "../components/common/Modals/Notification";
import CitasMedicas from "../components/common/Citas Medicas/CitasMedicas";
import EducationalContent from "../components/patient/EducationalContent";
import ModalContainer from "../components/common/Modals/ModalContainer";
import ProfileContainer from "../components/common/Modals/ProfileContainer";
import useUnreadCounts from "../hooks/useUnreadCounts";
import ClinicalData from "../components/common/Modals/ClinicalData";
import PatientTreatment from "../components/common/Modals/PatientTreatment";
import TreatmentsHistory from "../components/common/Modals/TreatmentsHistory";

function PatientPage() {
  const { signout } = useAuth();
  const [activeSection, setActiveSection] = useState("Citas Medicas");
  const [activeModal, setActiveModal] = useState(null);
  const { unreadNotifCount } = useUnreadCounts();

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
    { name: "Citas Medicas", icon: "calendar-check", number: 0 },
    { name: "Tratamiento", icon: "capsules", number: 0 },
    { name: "Datos Clinicos", icon: "file-medical", number: 0 },
    { name: "Contenido Educativo", icon: "book-open-reader", number: 0 },
    { name: "Notificaciones", icon: "bell", number: unreadNotifCount },
    { name: "Perfil", icon: "user", number: 0 },
    { name: "Cerrar Sesion", icon: "power-off", number: 0 },
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
      {activeModal === "treatment" && (
        <ModalContainer onClose={() => setActiveModal(null)}>
          <PatientTreatment
            patientId={user.id}
            setActiveModal={setActiveModal}
          />
        </ModalContainer>
      )}
      {activeModal === "treatmentHistory" && (
        <ModalContainer onClose={() => setActiveModal("treatment")}>
          <TreatmentsHistory
            patientId={user.id}
            setActiveModal={() => setActiveModal("treatment")}
          />
        </ModalContainer>
      )}
      {activeModal === "ClinicalDetails" && (
        <ModalContainer onClose={() => setActiveModal(null)}>
          <ClinicalData patientId={user.id} />
        </ModalContainer>
      )}
    </PageContainer>
  );
}

export default PatientPage;
