import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import PageContainer from "./PageContainer";
import {
  FaExclamationTriangle,
  FaSave,
} from "react-icons/fa";

// Styled Components (copied from Settings Page)
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
  background: linear-gradient(90deg,#36D1DC);
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
  border-left: 4px solid #36D1DC;
  backdrop-filter: blur(5px);
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  color:#36D1DC;
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
  color:#36D1DC;
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
    border-color:#36D1DC;
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

const Textarea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color:#36D1DC;
    box-shadow: 0 0 0 2px rgba(27, 26, 70, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 600px) {
    padding: 10px 8px;
    font-size: 0.95rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg,#36D1DC);
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
    background: linear-gradient(135deg, #36D1DC);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(18, 20, 72, 0.4);
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

// Whistleblower Component
const WhistleblowerPage = () => {
  const [whistle, setWhistle] = useState({
    message: "",
    category: "",
    incident_date: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    if (!whistle.message.trim()) {
      setError("Please describe the issue before submitting.");
      return false;
    }
    return true;
  };

  const submitWhistle = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:5000/api/whistle", whistle);
      setError("");
      setSuccessMessage("Thank you for your submission. We appreciate your input!");
      setWhistle({
        message: "",
        category: "",
        incident_date: "",
        location: "",
      });

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error details:", error.response ? error.response.data : error.message);
      setError("There was an error submitting your whistle. Please try again.");
    }
  };

  return (
    <PageContainer>
      <SettingsPageWrapper>
        <SettingsContent>
          <Header>Whistleblower Portal</Header>
          <Subheader>
            Your voice matters. Report concerns anonymously to help improve our community.
          </Subheader>

          {error && (
            <ErrorMessage>
              <FaExclamationTriangle /> {error}
            </ErrorMessage>
          )}
          {successMessage && (
            <SuccessMessage>
              <FaSave /> {successMessage}
            </SuccessMessage>
          )}

          <InfoBox>
            <InfoTitle>Your Whistle is Protected</InfoTitle>
            <InfoText>
              All submissions are completely anonymous and encrypted. We value your courage in speaking up about concerns.
            </InfoText>
          </InfoBox>

          <Form onSubmit={submitWhistle}>
            <FormSection>
              <SectionTitle>Report Details</SectionTitle>

              <FormGroup>
                <Label>Category (e.g., Misconduct, Harassment)</Label>
                <Input
                  type="text"
                  placeholder="Enter category"
                  value={whistle.category}
                  onChange={(e) => setWhistle({ ...whistle, category: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Location (Optional)</Label>
                <Input
                  type="text"
                  placeholder="Enter location"
                  value={whistle.location}
                  onChange={(e) => setWhistle({ ...whistle, location: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Incident Date (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={whistle.incident_date}
                  onChange={(e) => setWhistle({ ...whistle, incident_date: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Description of Concern</Label>
                <Textarea
                  placeholder="Provide detailed information about your concern..."
                  value={whistle.message}
                  onChange={(e) => setWhistle({ ...whistle, message: e.target.value })}
                />
              </FormGroup>
            </FormSection>

            <Button type="submit">
              <FaSave /> Submit Anonymously
            </Button>
          </Form>
        </SettingsContent>
      </SettingsPageWrapper>
    </PageContainer>
  );
};

export default WhistleblowerPage;