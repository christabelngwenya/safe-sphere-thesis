import React from "react";
import styled from "styled-components";
import { FaShieldAlt, FaMapMarkerAlt, FaComments, FaUserFriends, FaBell, FaHeart, FaExclamationTriangle, FaGraduationCap, FaBookOpen, FaBullhorn, FaUserClock, FaHeartbeat } from "react-icons/fa";
import PageContainer from "./PageContainer";

const HomePageWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 0;
  box-sizing: border-box;
  background-color: #1e1e30;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  margin-left: 0;
`;

const HomeContent = styled.div`
  width: calc(100% + 750px);
  padding: 20px;
  box-sizing: border-box;
`;

const WelcomeBox = styled.div`
  background: linear-gradient(135deg, rgba(255, 77, 77, 0.1), rgba(249, 203, 40, 0.1));
  border: 1px solid rgba(255, 77, 77, 0.2);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  text-align: center;
`;

const WelcomeTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #fff;
  background: linear-gradient(90deg, #ff4d4d, #f9cb28);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const WelcomeText = styled.p`
  color: #d3d3d3;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FeatureTitle = styled.h3`
  color: #fff;
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const FeatureDescription = styled.p`
  color: #a0aec0;
  font-size: 1rem;
  line-height: 1.6;
`;

const Home = () => {
  return (
    <PageContainer>
      <HomePageWrapper>
        <HomeContent>
          <WelcomeBox>
          <WelcomeTitle>Welcome to SafeSphere</WelcomeTitle>
            <WelcomeText>
              Your trusted companion for a safer and more secure campus experience. 
              We're here to empower you with tools and resources that make your 
              academic journey safer and more enjoyable. Together, we're building 
              a community where every student feels protected, supported, and valued.
            </WelcomeText>
          </WelcomeBox>

          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon style={{ color: '#36D1DC' }}>
                <FaHeartbeat />
              </FeatureIcon>
              <FeatureTitle>Safety & Mental Health Toolkit</FeatureTitle>
              <FeatureDescription>
                An interactive toolkit with safety tips and a mental health self-check to support your well-being.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon style={{ color: '#36D1DC' }}>
                <FaUserClock />
              </FeatureIcon>
              <FeatureTitle>Virtual Walk Companion</FeatureTitle>
              <FeatureDescription>
                Start a timed safety session for your walks. If you miss a check-in, an alert is sent to your emergency contact.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon style={{ color: '#36D1DC' }}>
                <FaComments />
              </FeatureIcon>
              <FeatureTitle>Professional Counseling</FeatureTitle>
              <FeatureDescription>
                Access confidential counseling services and mental health support 
                whenever you need someone to talk to.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon style={{ color: '#36D1DC' }}>
                <FaExclamationTriangle />
              </FeatureIcon>
              <FeatureTitle>Report Abuse</FeatureTitle>
              <FeatureDescription>
                Safely report incidents of abuse or harassment. Your reports are 
                confidential and will be handled with utmost care.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon style={{ color: '#36D1DC' }}>
                <FaBookOpen />
              </FeatureIcon>
              <FeatureTitle>Educational Resources</FeatureTitle>
              <FeatureDescription>
                Access a wealth of educational materials, self-help guides, and 
                resources to support your academic and personal growth.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon style={{ color: '#36D1DC' }}>
                <FaBullhorn />
              </FeatureIcon>
              <FeatureTitle>Whistleblower Portal</FeatureTitle>
              <FeatureDescription>
                Report misconduct or unethical behavior anonymously. Help maintain 
                integrity and safety in your academic community.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </HomeContent>
      </HomePageWrapper>
    </PageContainer>
  );
};

export default Home;