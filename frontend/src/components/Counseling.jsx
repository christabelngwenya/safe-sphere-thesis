import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";
import PageContainer from "./PageContainer";

const Counseling = () => {
  const contacts = [
    { name: "Counsellor A", phone: "263715108592", role: "Licensed Professional Counselor" },
    { name: "Counsellor B", phone: "263786089668", role: "Clinical Psychologist" },
  ];

  const handleWhatsAppClick = (phone) => {
    const whatsappURL = `https://wa.me/${phone}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <PageContainer>
      <CounselingContainer>
        <ServiceCard>
          <ServiceTitle>Counseling Services</ServiceTitle>
          <ServiceText>
            Welcome to our counseling services. Our team of licensed professionals is here to support you with any challenges you may be facing.
            Connect with our experienced counselors through WhatsApp for confidential and professional support.
          </ServiceText>
        </ServiceCard>

        <CounsellorsContainer>
          {contacts.map((contact, index) => (
            <CounsellorCard key={index}>
              <CounsellorIcon>
                <FontAwesomeIcon icon={faWhatsapp} size="lg" />
              </CounsellorIcon>
              <CounsellorName>{contact.name}</CounsellorName>
              <CounsellorRole>{contact.role}</CounsellorRole>
              <WhatsAppButton onClick={() => handleWhatsAppClick(contact.phone)}>
                <FontAwesomeIcon icon={faWhatsapp} />
                Chat on WhatsApp
              </WhatsAppButton>
            </CounsellorCard>
          ))}
        </CounsellorsContainer>
      </CounselingContainer>
    </PageContainer>
  );
};

// Styled Components
const CounselingContainer = styled.div`
  width: calc(100% + 150px); /* Increased total width by 150px */
  margin-left: -75px; /* Offset to center the expanded width */
  padding: 2rem calc(3rem + 75px); /* Adjusted padding to account for width increase */
  box-sizing: border-box;
  background-color: #1e1e30;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const ServiceCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 77, 77, 0.1), rgba(249, 203, 40, 0.1));
  border: 1px solid rgba(255, 77, 77, 0.2);
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 1230px; /* Increased from 1080px to 1230px (150px more) */
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const ServiceTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #fff;
  background: linear-gradient(90deg, #ff4d4d, #f9cb28);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 600;
`;

const ServiceText = styled.p`
  color: #d3d3d3;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 800px;
`;

const CounsellorsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1480px; /* Increased from 1280px to 1430px (150px more) */
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
`;

const CounsellorCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.8rem;
  width: 90%;
  min-width: 180px;
  max-width: 250px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 500px) {
    min-width: 300px;
    padding: 1.5rem;
  }
`;

const CounsellorIcon = styled.div`
  font-size: 2.3rem;
  margin-bottom: 1.2rem;
  color: #25d366;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  background: rgba(37, 211, 102, 0.1);
  border-radius: 50%;
`;

const CounsellorName = styled.h3`
  color: #fff;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const CounsellorRole = styled.p`
  color: #a0aec0;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.2rem;
`;

const WhatsAppButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #25d366;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  margin-top: auto;

  &:hover {
    background: #23cc5a;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export default Counseling;