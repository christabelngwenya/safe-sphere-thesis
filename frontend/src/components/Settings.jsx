import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaGraduationCap, 
  FaUserFriends, 
  FaCalendarAlt, 
  FaHome, 
  FaLock, 
  FaExclamationTriangle,
  FaSave,
  FaKey
} from "react-icons/fa";
import PageContainer from "./PageContainer";

const SettingsPageWrapper = styled.div`
  width: 1060px;
  min-height: 100vh;
  padding: 40px 0;
  box-sizing: border-box;
  background-color: #1a1a2e;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: 900px) {
    width: 100%;
    padding: 30px 0;
  }
  @media (max-width: 600px) {
    padding: 15px 0;
  }
`;

const SettingsContent = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 600px) {
    padding: 0 5px;
    max-width: 100%;
  }
`;

const Header = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 10px;
  color: #fff;
  background: linear-gradient(90deg, #ff4d4d, #f9cb28);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const Subheader = styled.p`
  text-align: center;
  color: #cbd5e0;
  margin-bottom: 40px;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 600px) {
    font-size: 1rem;
    margin-bottom: 25px;
    max-width: 100%;
  }
`;

const InfoBox = styled.div`
  background: rgba(255, 77, 77, 0.1);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border-left: 4px solid #ff4d4d;
  backdrop-filter: blur(5px);
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  color: #ff6b6b;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;

const InfoText = styled.p`
  color: #d3d3d3;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const Form = styled.form`
  background: rgba(30, 30, 48, 0.8);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 600px) {
    padding: 15px;
    border-radius: 10px;
  }
`;

const FormSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  color: #f9cb28;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    margin-bottom: 15px;
  }
`;

const Label = styled.label`
  margin-bottom: 8px;
  color: #a0aec0;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ff4d4d;
    box-shadow: 0 0 0 2px rgba(255, 77, 77, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    padding: 10px 8px;
    font-size: 0.95rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ff4d4d, #f94484);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  
  &:hover {
    background: linear-gradient(135deg, #ff3333, #f92d7a);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 77, 77, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #4a5568;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  color: #ff6b6b;
  border: 2px solid #ff6b6b;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  
  &:hover {
    background: rgba(255, 107, 107, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    font-size: 1rem;
  }
`;

const Message = styled.div`
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const ErrorMessage = styled(Message)`
  background-color: rgba(255, 0, 0, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const SuccessMessage = styled(Message)`
  background-color: rgba(0, 255, 0, 0.15);
  color: #51cf66;
  border: 1px solid rgba(81, 207, 102, 0.3);
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: #1e1e30;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #a0aec0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  transition: color 0.2s;

  &:hover {
    color: #ff6b6b;
  }
`;

const PasswordRequirements = styled.div`
  margin-top: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #a0aec0;
`;

const Settings = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    contact_info: user?.contact_info || "",
    college: user?.college || "",
    emergency_contact: localStorage.getItem('emergency_contact') || user?.emergency_contact || "",
    next_of_kin: user?.next_of_kin || "",
    next_of_kin_contact: user?.next_of_kin_contact || "",
    expected_completion_year: user?.expected_completion_year || "",
    program: user?.program || "",
    campus_status: user?.campus_status || "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        contact_info: user.contact_info || "",
        college: user.college || "",
        emergency_contact: user.emergency_contact || "",
        next_of_kin: user.next_of_kin || "",
        next_of_kin_contact: user.next_of_kin_contact || "",
        expected_completion_year: user.expected_completion_year || "",
        program: user.program || "",
        campus_status: user.campus_status || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // For the emergency contact, we'll save it to localStorage for the panic button
      if (formData.emergency_contact) {
        localStorage.setItem('emergency_contact', formData.emergency_contact);
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 5000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsPasswordLoading(true);

    try {
      if (passwordData.new_password !== passwordData.confirm_password) {
        setError("New passwords do not match!");
        return;
      }

      if (passwordData.new_password.length < 6) {
        setError("New password must be at least 6 characters long!");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to update your password.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.id}/password`,
        {
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data) {
        setSuccess("Password updated successfully!");
        setShowPasswordModal(false);
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        setTimeout(() => {
          setSuccess("");
        }, 5000);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.response?.status === 401) {
        setError("Current password is incorrect!");
      } else if (error.response?.status === 404) {
        setError("User not found. Please try logging in again.");
      } else if (error.response?.status === 403) {
        setError("You are not authorized to update this password.");
      } else {
        setError(error.response?.data?.message || "Failed to update password. Please try again.");
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
    setError("");
  };

  return (
    <PageContainer>
      <SettingsPageWrapper>
        <SettingsContent>
          <Header>Account Settings</Header>
          <Subheader>
            Manage your personal information, security settings, and preferences.
          </Subheader>

          {error && (
            <ErrorMessage>
              <FaExclamationTriangle /> {error}
            </ErrorMessage>
          )}
          
          {success && (
            <SuccessMessage>
              <FaSave /> {success}
            </SuccessMessage>
          )}

          <InfoBox>
            <InfoTitle>Profile Information</InfoTitle>
            <InfoText>
              Keep your personal details up to date to ensure we can contact you when needed.
            </InfoText>
          </InfoBox>

          <Form onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Basic Information</SectionTitle>
              
              <FormGroup>
                <Label>
                  <FaUser /> First Name
                </Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaUser /> Last Name
                </Label>
                <Input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaEnvelope /> Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  placeholder="Your email address"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaPhone /> Phone Number
                </Label>
                <Input
                  type="tel"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleChange}
                  placeholder="Your primary phone number"
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>Academic Information</SectionTitle>
              
              <FormGroup>
                <Label>
                  <FaGraduationCap /> College
                </Label>
                <Input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Your college or institution"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaGraduationCap /> Program
                </Label>
                <Input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  placeholder="Your study program"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaCalendarAlt /> Expected Graduation Year
                </Label>
                <Input
                  type="text"
                  name="expected_completion_year"
                  value={formData.expected_completion_year}
                  onChange={handleChange}
                  placeholder="YYYY"
                  maxLength="4"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaHome /> Campus Status
                </Label>
                <Input
                  type="text"
                  name="campus_status"
                  value={formData.campus_status}
                  onChange={handleChange}
                  placeholder="Your current campus status"
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>Emergency Contacts</SectionTitle>
              
              <FormGroup>
                <Label>
                  <FaPhone /> Emergency Contact
                </Label>
                <Input
                  type="tel"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  placeholder="Emergency contact number"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaUserFriends /> Next of Kin
                </Label>
                <Input
                  type="text"
                  name="next_of_kin"
                  value={formData.next_of_kin}
                  onChange={handleChange}
                  placeholder="Next of kin full name"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaPhone /> Next of Kin Contact
                </Label>
                <Input
                  type="tel"
                  name="next_of_kin_contact"
                  value={formData.next_of_kin_contact}
                  onChange={handleChange}
                  placeholder="Next of kin phone number"
                />
              </FormGroup>
            </FormSection>

            <Button type="submit" disabled={isLoading}>
              <FaSave /> {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Form>

          <SecondaryButton onClick={() => setShowPasswordModal(true)}>
            <FaKey /> Change Password
          </SecondaryButton>
        </SettingsContent>
      </SettingsPageWrapper>

      {showPasswordModal && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={closePasswordModal}>×</CloseButton>
            <Header>Change Password</Header>
            
            <Form onSubmit={handlePasswordSubmit}>
              <FormGroup>
                <Label>
                  <FaLock /> Current Password
                </Label>
                <Input
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaLock /> New Password
                </Label>
                <Input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  required
                  minLength="6"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaLock /> Confirm New Password
                </Label>
                <Input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  required
                  minLength="6"
                />
              </FormGroup>

              <PasswordRequirements>
                <div><strong>Password Requirements:</strong></div>
                <div>• At least 6 characters long</div>
                <div>• Should not match your current password</div>
              </PasswordRequirements>

              <Button type="submit" disabled={isPasswordLoading}>
                <FaKey /> {isPasswordLoading ? "Updating..." : "Update Password"}
              </Button>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Settings;