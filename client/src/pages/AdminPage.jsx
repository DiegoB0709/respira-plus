import PageContainer from "../components/common/PageContainer";
import Logo from "../components/common/SideBar/Logo";
import SideBar from "../components/common/SideBar/SideBar";
import Option from "../components/common/SideBar/Option";
import { toggleSidebar } from "../utils/SideBar";
import { useState } from "react";
import Dashboard from "../components/admin/Dashboard";
import Usuarios from "../components/admin/Usuarios";
import Perfil from "../components/common/Perfil";
import { useAuth } from "../context/AuthContext";

function AdminPage() {
  const { signout } = useAuth();
  const [activeSection, setActiveSection] = useState("DashBoard");

  const handleSectionClick = (section) => {
    if (section === "Cerrar Sesion") {
      handleSignout();
      return;
    }
    setActiveSection(section);
  };

  const handleSignout = async () => {
    await signout();
  };

  const menuOptions = [
    { name: "DashBoard", icon: "chart-simple" },
    { name: "Usuarios", icon: "users" },
    { name: "Perfil", icon: "user" },
    { name: "Cerrar Sesion", icon: "power-off" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "DashBoard":
        return <Dashboard />;
      case "Usuarios":
        return <Usuarios />;
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
            handleSectionClick={handleSectionClick}
          />
        ))}
      </SideBar>
      <main>
        <div className="main-content">{renderContent()}</div>
      </main>
    </PageContainer>
  );
}

export default AdminPage;
