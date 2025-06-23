import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaFileAlt,
  FaShieldAlt,
  FaPaperPlane
} from "react-icons/fa";
import PageContainer from "./PageContainer";

const ReportAbusePageWrapper = styled.div`
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

const ReportAbuseContent = styled.div`
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

const TextArea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s ease;
  min-height: 150px;
  
  &:focus {
    outline: none;
    border-color: #ff4d4d;
    box-shadow: 0 0 0 2px rgba(255, 77, 77, 0.2);
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

const Select = styled.select`
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: #ff4d4d;
    box-shadow: 0 0 0 2px rgba(255, 77, 77, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }

  option {
    background: #1a1a2e;
    color: white;
  }

  @media (max-width: 600px) {
    padding: 10px 8px;
    font-size: 0.95rem;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0aec0;
  cursor: pointer;
  margin-top: 10px;
  font-size: 0.95rem;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #ff4d4d;
    cursor: pointer;
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

const ReportAbuse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    incidentType: "",
    location: "",
    description: "",
    evidence: "",
    anonymity: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess("Report submitted successfully!");
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <ReportAbusePageWrapper>
        <ReportAbuseContent>
          <Header>Report Abuse</Header>
          <Subheader>
            Your safety matters. Report any form of abuse or harassment you've experienced or witnessed.
          </Subheader>

          {error && (
            <ErrorMessage>
              <FaExclamationTriangle /> {error}
            </ErrorMessage>
          )}
          
          {success && (
            <SuccessMessage>
              <FaPaperPlane /> {success}
            </SuccessMessage>
          )}

          <InfoBox>
            <InfoTitle><FaShieldAlt /> Your Report is Protected</InfoTitle>
            <InfoText>
              All reports are handled with the utmost confidentiality. Your identity will be protected,
              and appropriate action will be taken to address the situation.
            </InfoText>
          </InfoBox>

          <Form onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Your Information</SectionTitle>
              
              <FormGroup>
                <Label>
                  <FaUser /> Name
                </Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
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
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaPhone /> Phone Number
                </Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  required
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>Incident Details</SectionTitle>
              
              <FormGroup>
                <Label>
                  <FaExclamationTriangle /> Type of Incident
                </Label>
                <Select
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select incident type</option>
                  <option value="harassment">Harassment</option>
                  <option value="discrimination">Discrimination</option>
                  <option value="violence">Violence</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaMapMarkerAlt /> Location
                </Label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where did the incident occur?"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaFileAlt /> Description
                </Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please provide a detailed description of the incident..."
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaFileAlt /> Evidence (if any)
                </Label>
                <TextArea
                  name="evidence"
                  value={formData.evidence}
                  onChange={handleChange}
                  placeholder="Any additional information or evidence you'd like to provide..."
                />
              </FormGroup>

              <CheckboxLabel>
                <input
                  type="checkbox"
                  name="anonymity"
                  checked={formData.anonymity}
                  onChange={handleChange}
                />
                Submit anonymously
              </CheckboxLabel>
            </FormSection>

            <Button type="submit" disabled={isLoading}>
              <FaPaperPlane /> {isLoading ? "Submitting..." : "Submit Report"}
            </Button>
          </Form>
        </ReportAbuseContent>
      </ReportAbusePageWrapper>
    </PageContainer>
  );
};

export default ReportAbuse;