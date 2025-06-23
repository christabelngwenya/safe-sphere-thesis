import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Counseling from "./components/Counseling";
import ReportAbuse from "./components/ReportAbuse";
import Educational from "./components/Educational";
import Settings from "./components/Settings";
import VirtualWalkCompanion from "./components/CampusLocateMe";
import WhistleblowerPage from "./components/WhistleblowerPage";
import SafetyToolkit from "./components/NewsFeed";
import Signup from "./components/Signup"; // Changed from SignupSteps
import Login from "./components/Login";


const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.$sidebarCollapsed ? '80px' : '200px'}; /* Adjust based on sidebar state */
  transition: margin-left 0.3s ease;

  @media (min-width: 1024px) {
    margin-left: ${props => props.$sidebarCollapsed ? '80px' : '250px'};
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 20px;
  margin-top: 64px; /* Space for the header */
  background-color: #f5f5f5;
  overflow-y: auto;
`;

const Dashboard = ({ handleLogout, user }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 769);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 769;
      setIsMobileView(mobile);
      if (!mobile) {
        setIsSidebarOpen(false); // Ensure sidebar is closed if resizing to desktop
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobileView) {
      setIsSidebarOpen(prev => !prev);
    }
  };

  const closeSidebar = () => {
    if (isMobileView) {
      setIsSidebarOpen(false);
    }
  };

  const handleSidebarCollapse = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <Home user={user} />;
      case "counseling":
        return <Counseling user={user} />;
      case "report-abuse":
        return <ReportAbuse user={user} />;
      case "educational":
        return <Educational user={user} />;
      case "settings":
        return <Settings user={user} />;
      case "campus-locate-me":
        return <VirtualWalkCompanion user={user} />;
      case "whistleblower":
        return <WhistleblowerPage user={user} />;
      case "news":
        return <SafetyToolkit />;
      default:
        return <Home user={user} />;
    }
  };

  return (
    <>
      <Header 
        handleLogout={handleLogout} 
        user={user} 
        onMenuClick={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
        isMobileView={isMobileView}
        sidebarCollapsed={isSidebarCollapsed}
      />
      <AppContainer>
        <Sidebar 
          setActiveSection={setActiveSection} 
          activeSection={activeSection}
          user={user}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          isMobileView={isMobileView}
          onCollapse={handleSidebarCollapse}
        />
        <MainContentWrapper $sidebarCollapsed={isSidebarCollapsed}>
          <ContentArea>{renderSection()}</ContentArea>
        </MainContentWrapper>
      </AppContainer>
    </>
  );
};

const App = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route
          path="/dashboard"
          element={user ? <Dashboard handleLogout={handleLogout} user={user} /> : <Navigate to="/login" replace />} />
        
        <Route
          path="/counseling"
          element={user ? <Counseling /> : <Navigate to="/login" replace />} />
        
        <Route
          path="/report-abuse"
          element={user ? <ReportAbuse /> : <Navigate to="/login" replace />} />
        
        <Route
          path="/educational"
          element={user ? <Educational /> : <Navigate to="/login" replace />} />
        
        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="/login" replace />} />
        
        <Route
          path="/campus-locate"
          element={user ? <VirtualWalkCompanion user={user} /> : <Navigate to="/login" replace />} />
        
        <Route path="/whistleblower" element={<WhistleblowerPage />} />
        <Route path="/news" element={<SafetyToolkit />} />
      </Routes>
    </div>
  );
};

export default App;