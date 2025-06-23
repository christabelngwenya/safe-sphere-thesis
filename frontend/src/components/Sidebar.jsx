import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faComments,
  faExclamationTriangle,
  faBookOpen,
  faCog,
  faSignOutAlt,
  faShieldAlt,
  faBullhorn,
  faHeartbeat,
  faUserClock,
  faExclamationCircle,
  faUsers,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

// Navigation items
const navItems = [
  { icon: faHome, label: 'Home', section: 'home' },
  { icon: faComments, label: 'Counseling', section: 'counseling' },
  { icon: faExclamationTriangle, label: 'Report Abuse', section: 'report-abuse' },
  { icon: faBookOpen, label: 'Educational', section: 'educational' },
  { icon: faHeartbeat, label: 'Safety & Mental Health Toolkit', section: 'news' },
  { icon: faUserClock, label: 'Virtual Walk', section: 'campus-locate-me' },
  { icon: faBullhorn, label: 'Whistleblower', section: 'whistleblower' },
  { icon: faCog, label: 'Settings', section: 'settings' },
];
import styled from "styled-components";

// Styled components for the sidebar
const SidebarContainer = styled.nav`
  background: linear-gradient(145deg, #2f3b52, #1c2639);
  color: white;
  width: ${props => props.$collapsed ? '80px' : '230px'};
  height: 100vh;
  min-height: 100vh;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  padding: 15px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$collapsed ? 'center' : 'flex-start'};
  z-index: 1001;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    width: 250px;
    max-width: 250px;
  }

  @media (min-width: 769px) {
    transform: none !important;
  }
`;

const Logo = styled.div`
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
  color: #d3d3d3;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.2em;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: -12px;
  background: #2f3b52;
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1002;
  transition: all 0.3s ease;

  &:hover {
    background: #1c2639;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 77, 77, 0.5) rgba(255, 255, 255, 0.1);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 77, 77, 0.5);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    height: calc(100vh - 60px); /* Subtract header height */
  }
`;

const NavItem = styled.li`
  margin: 10px 0;
  cursor: pointer;
  font-size: 1em;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  background-color: ${props => props.$active ? '#d3d3d3' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'inherit'};
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};

  &:hover {
    background-color: #d3d3d3;
    color: white;
    transform: scale(1.05);
  }

  &:active {
    background-color: #a4a2a5;
  }

  span {
    display: ${props => props.$collapsed ? 'none' : 'inline'};
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    margin: 8px 0;
  }
`;

const LogoutItem = styled(NavItem)`
  background: none;
  color: #d3d3d3;
  font-weight: bold;

  &:hover {
    background-color: #d3d3d3;
    color: white;
  }

  @media (max-width: 768px) {
    margin-bottom: 0;
    padding: 10px 15px;
  }
`;

const VersionInfo = styled.div`
  width: 100%;
  padding-top: 1rem;
  border-top: 1px solid #2f3b52;
  font-size: 0.875rem;
  color: #a0aec0;
  text-align: ${props => props.$collapsed ? 'center' : 'left'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    padding-top: 0.8rem;
    font-size: 0.8rem;
  }
`;

const handleLogout = () => {
  localStorage.removeItem("token");
  sessionStorage.clear();
  window.location.href = "/login";
};

const Sidebar = ({ setActiveSection, activeSection, isOpen, onClose, onCollapse }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };

  return (
    <SidebarContainer $isOpen={isOpen} $collapsed={collapsed}>
      <ToggleButton onClick={() => setCollapsed(!collapsed)}>
        <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} />
      </ToggleButton>
      <Logo>
        <FontAwesomeIcon icon={faShieldAlt} />
        {collapsed ? 'SS' : 'Safe Sphere'}
      </Logo>
      <NavList>
        {navItems.map((item) => (
          <NavItem
            key={item.section}
            onClick={() => {
              setActiveSection(item.section);
              if (onClose) onClose();
            }}
            $active={activeSection === item.section}
            $collapsed={collapsed}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span>{item.label}</span>
          </NavItem>
        ))}
        <LogoutItem
          onClick={handleLogout}
          $collapsed={collapsed}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </LogoutItem>
      </NavList>
      <VersionInfo $collapsed={collapsed}>v1.0.0</VersionInfo>
    </SidebarContainer>
  );
};

export default Sidebar;