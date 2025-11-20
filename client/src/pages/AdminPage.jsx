import PageContainer from "../components/common/PageContainer";
import { useState } from "react";
import Dashboard from "../components/admin/Dashboard";
import Usuarios from "../components/admin/Usuarios";
import ProfileContainer from "../components/common/Modals/ProfileContainer";
import { useAuth } from "../context/AuthContext";
import ModalContainer from "../components/common/Modals/ModalContainer";
import SidebarToggle from "../components/common/SideBar/SidebarToggle";
import Sidebar from "../components/common/SideBar/Sidebar";
import SidebarItem from "../components/common/SideBar/SidebarItem";

function AdminPage() {
  const { signout } = useAuth();
  const [activeSection, setActiveSection] = useState("DashBoard");

  const [activeProfile, setActiveProfile] = useState(false);

  const [open, setOpen] = useState(false);

  const handleOpenProfile = () => setActiveProfile(true);
  const handleCloseProfile = () => setActiveProfile(false);

  const handleSectionClick = (section) => {
    if (section === "Cerrar Sesion") {
      handleSignout();
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
    { name: "DashBoard", icon: "fa-chart-simple", number: 0 },
    { name: "Usuarios", icon: "fa-users", number: 0 },
    { name: "Perfil", icon: "fa-user", number: 0 },
    { name: "Cerrar Sesion", icon: "fa-right-from-bracket", number: 0 },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "DashBoard":
        return <Dashboard />;
      case "Usuarios":
        return <Usuarios />;
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
      <main className="overflow-y-auto p-[min(30px,7%)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div>
          {renderContent()}
          {activeProfile && (
            <ModalContainer onClose={handleCloseProfile} icon title>
              <ProfileContainer />
            </ModalContainer>
          )}
        </div>
      </main>
    </PageContainer>
  );
}

export default AdminPage;
