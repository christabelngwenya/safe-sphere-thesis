import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PageContainer from "./PageContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStreetView,
  faDoorClosed,
  faUserSecret,
  faPhoneAlt,
  faSmileBeam,
  faHandHoldingHeart,
  faHandsHelping,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

// --- Data for the Toolkit ---

const safetyTips = [
  {
    icon: faStreetView,
    title: "Walking Alone at Night",
    content: "Stick to well-lit paths, share your location with a trusted friend, and walk with confidence. Your awareness is your superpower!",
  },
  {
    icon: faDoorClosed,
    title: "Dorm Safety",
    content: "Always lock your door, even if you're just down the hall. Keep emergency contacts handy and consider a simple door alarm for extra peace of mind.",
  },
  {
    icon: faUserSecret,
    title: "Digital Security",
    content: "Review your social media privacy settings regularly. Be mindful of what you share and don't hesitate to block anyone who makes you feel uncomfortable.",
  },
  {
    icon: faPhoneAlt,
    title: "Emergency Contacts",
    content: "Program campus security and local emergency services into your phone. Having them ready can save precious seconds when it matters most.",
  },
];

const quizQuestions = [
  {
    question: "Over the last two weeks, how often have you felt anxious or on edge?",
  },
  {
    question: "How often have you found it hard to stop worrying?",
  },
  {
    question: "Have you been feeling down, depressed, or hopeless?",
  },
  {
    question: "How often have you had little interest or pleasure in doing things?",
  },
  {
    question: "How often have you felt overwhelmed by tasks that used to feel manageable?",
  },
  {
    question: "Have you found yourself feeling more irritable or easily annoyed than usual?",
  },
  {
    question: "Have you noticed a desire to withdraw from social situations or be alone more often?",
  },
  {
    question: "Are you experiencing physical signs of stress, like headaches or an upset stomach, without a clear medical reason?",
  },
];


// --- Styled Components ---

const ToolkitWrapper = styled.div`
  width: 100%;
  max-width: 1060px;
  margin: 0 auto;
  min-height: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
  background-color: #1a1a2e;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const Header = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 15px;
  color: #fff;
  background: linear-gradient(90deg, #36D1DC, #5B86E5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subheader = styled.p`
  text-align: center;
  color: #a0aec0;
  margin-bottom: 40px;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 30px;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
    color: #fff;
  margin-bottom: 20px;
  border-left: 4px solid #36D1DC;
  padding-left: 15px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Safety Tips Cards
const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const TipCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const TipHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 600;
  color: #e2e8f0;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const TipContent = styled.p`
  color: #a0aec0;
  margin-top: 15px;
  line-height: 1.6;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

// Mental Health Quiz
const QuizBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 16px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Question = styled.p`
  font-size: 1.1rem;
  color: #e2e8f0;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Options = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Option = styled.button`
  background: ${({ active }) => (active ? "linear-gradient(135deg, #36D1DC, #5B86E5)" : "rgba(255, 255, 255, 0.1)")};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${({ active }) => !active && "rgba(255, 255, 255, 0.2)"};
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px 15px;
    text-align: center;
  }
`;

const QuizResult = styled.div`
  margin-top: 30px;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  background-color: ${props => props.bgColor || 'rgba(0,0,0,0.2)'};

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const ResultIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #fff;
`;

const ResultTitle = styled.h4`
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const ResultText = styled.p`
  color: #d3d3d3;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;


// --- The Component ---

const SafetyToolkit = () => {
  const [openTip, setOpenTip] = useState(null);
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem("quizAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : Array(quizQuestions.length).fill(null);
  });
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
    const newScore = answers.reduce((acc, val) => acc + (val || 0), 0);
    setScore(newScore);
    setShowResult(answers.every(a => a !== null));
  }, [answers]);

  const handleAnswer = (qIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = value;
    setAnswers(newAnswers);
  };
  
  const getResultFeedback = () => {
    // New scoring logic for 8 questions (max score: 24)
    if (score <= 8) { // Low risk
      return {
        icon: faSmileBeam,
        title: "You're navigating challenges well!",
        text: "It looks like you're handling things with grace. Remember to keep checking in with yourself and celebrating your resilience. You're doing great!",
        bgColor: "rgba(54, 209, 220, 0.2)"
      };
    } else if (score <= 16) { // Moderate risk
      return {
        icon: faHandHoldingHeart,
        title: "It's okay to feel this way. Be gentle with yourself.",
        text: "Some days are tougher than others, and your feelings are completely valid. This is a good time to focus on self-care or chat with a friend. Small steps can make a big difference.",
        bgColor: "rgba(91, 134, 229, 0.2)"
      };
    } else { // High risk
      return {
        icon: faHandsHelping,
        title: "You're carrying a lot right now. You are not alone.",
        text: "It takes incredible strength to face these feelings every day. Many people find that talking to a professional provides new tools and a sense of relief. Considering counseling isn't a sign of weakness—it's a courageous step toward healing.",
        bgColor: "rgba(255, 107, 107, 0.2)"
      };
    }
  };

  return (
    <PageContainer>
      <ToolkitWrapper>
        <Header>Your Interactive Safety & Mental Health Toolkit</Header>
        <Subheader>A space for empowerment, safety, and self-care.</Subheader>

        <Section>
          <SectionTitle>Personal Safety Tips</SectionTitle>
          <TipsGrid>
            {safetyTips.map((tip, index) => (
              <TipCard key={index} onClick={() => setOpenTip(openTip === index ? null : index)}>
                <TipHeader>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={tip.icon} style={{ marginRight: '15px', width: '24px' }} />
                    <span>{tip.title}</span>
                  </div>
                  <FontAwesomeIcon icon={openTip === index ? faMinus : faPlus} />
                </TipHeader>
                {openTip === index && <TipContent>{tip.content}</TipContent>}
              </TipCard>
            ))}
          </TipsGrid>
        </Section>

        <Section>
          <SectionTitle>Mental Health Self-Check</SectionTitle>
          <QuizBox>
            {quizQuestions.map((q, qIndex) => (
              <div key={qIndex}>
                <Question>{q.question}</Question>
                <Options>
                  {["Not at all (0)", "Several days (1)", "More than half the days (2)", "Nearly every day (3)"].map((label, oIndex) => (
                    <Option
                      key={oIndex}
                      active={answers[qIndex] === oIndex}
                      onClick={() => handleAnswer(qIndex, oIndex)}
                    >
                      {label}
                    </Option>
                  ))}
                </Options>
                </div>
            ))}
            {showResult && (
              <QuizResult bgColor={getResultFeedback().bgColor}>
                <ResultIcon>
                  <FontAwesomeIcon icon={getResultFeedback().icon} />
                </ResultIcon>
                <ResultTitle>{getResultFeedback().title}</ResultTitle>
                <ResultText>{getResultFeedback().text}</ResultText>
              </QuizResult>
            )}
          </QuizBox>
        </Section>
      </ToolkitWrapper>
    </PageContainer>
  );
};

export default SafetyToolkit;
