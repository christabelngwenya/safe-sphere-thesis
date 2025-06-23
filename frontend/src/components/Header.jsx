import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaBell, FaSignOutAlt, FaChevronDown, FaBars } from "react-icons/fa";
import axios from "axios";

const HeaderContainer = styled.header`
  background: rgba(30, 30, 48, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1rem 1rem;
    justify-content: flex-end;
  }
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #ff4d4d, #f9cb28);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
  color: #a0aec0;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4d4d;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  border: 2px solid #1e1e30;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.4);
    }
    70% {
      transform: scale(1.1);
      box-shadow: 0 0 0 10px rgba(255, 77, 77, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 77, 77, 0);
    }
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserName = styled.span`
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserRole = styled.span`
  color: #a0aec0;
  font-size: 0.8rem;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff4d4d, #f94484);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: rgba(30, 30, 48, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px;
  min-width: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: ${props => props.$isOpen ? 'block' : 'none'};
  animation: slideDown 0.3s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: #a0aec0;
  transition: all 0.3s ease;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  svg {
    font-size: 1.1rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #a0aec0;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #fff;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = ({ user, handleLogout, onMenuClick, isSidebarOpen, isMobileView, sidebarCollapsed }) => {
  const navigate = useNavigate();
  const [resourceCount, setResourceCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchResourceCount = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/resources");
        setResourceCount(Array.isArray(response.data) ? response.data.length : 0);
      } catch (e) {
        setResourceCount(0);
      }
    };
    fetchResourceCount();
  }, []);

  const getUserInitials = () => {
    if (!user?.name) return user?.email?.[0]?.toUpperCase() || "U";
    const names = user.name.split(" ");
    if (names.length === 1) return names[0][0];
    return `${names[0][0]}${names[names.length - 1][0]}`;
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email;
    return "User";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <HeaderContainer>
      <MobileMenuButton onClick={onMenuClick}>
        <FaBars />
      </MobileMenuButton>
      <Logo to="/">SafeSphere</Logo>
      <UserSection>
        <NotificationIcon onClick={() => navigate('/educational')} title="View Educational Resources">
          <FaBell />
          {resourceCount > 0 && <NotificationBadge>{resourceCount}</NotificationBadge>}
        </NotificationIcon>
        <UserProfile onClick={toggleDropdown}>
          <UserAvatar>{getUserInitials()}</UserAvatar>
          <UserInfo>
            <UserName>{getUserDisplayName()}</UserName>
            <UserRole>{user?.program || "Student"}</UserRole>
          </UserInfo>
          <FaChevronDown style={{ color: '#a0aec0', fontSize: '0.8rem' }} />
        </UserProfile>
        <DropdownMenu $isOpen={isDropdownOpen}>
          <DropdownItem onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </DropdownItem>
        </DropdownMenu>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;