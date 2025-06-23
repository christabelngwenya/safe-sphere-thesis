import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Counseling from "./Counseling";
import ReportAbuse from "./ReportAbuse";
import Educational from "./Educational";
import Settings from "./Settings";
import CampusLocator from "./CampusLocateMe";
import WhistleblowerPage from "./WhistleblowerPage";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  position: relative;
`;

const MainContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: ${props => props.$isDesktop ? '250px' : '0'};
  transition: margin-left 0.3s ease;

  @media (min-width: 1024px) {
    margin-left: 300px;
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 20px;
  margin-top: 64px;
  background-color: #f5f5f5;
  overflow-y: auto;
  width: 100%;
  max-width: 100%;
`;

const MobileOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  transition: opacity 0.3s ease;
`;

const DashboardLayout = ({ activeSection, setActiveSection, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <Home />;
      case "counseling":
        return <Counseling />;
      case "report-abuse":
        return <ReportAbuse />;
      case "educational":
        return <Educational />;
      case "whistleblower":
        return <WhistleblowerPage />;
      case "campus-locate-me":
        return <CampusLocator />;
      case "settings":
        return <Settings user={user} setUser={setUser} />;
      default:
        return <Home />;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppContainer>
      {/* Mobile Overlay */}
      <MobileOverlay 
        $isOpen={isMobileMenuOpen} 
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar
        setActiveSection={handleSectionChange}
        onClose={() => setIsMobileMenuOpen(false)}
        className={isMobileMenuOpen ? "open" : ""}
        activeSection={activeSection}
        isMobile={!isDesktop}
      />

      {/* Main Content Wrapper */}
      <MainContentWrapper $isDesktop={isDesktop}>
        {/* Header */}
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          user={user}
          onLogout={handleLogout}
          isMobile={!isDesktop}
        />

        {/* Content Area */}
        <ContentArea>{renderSection()}</ContentArea>
      </MainContentWrapper>
    </AppContainer>
  );
};

export default DashboardLayout; 