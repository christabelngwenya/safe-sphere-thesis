import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  FaWhatsapp,
  FaTelegram,
  FaCheckCircle,
  FaExclamationTriangle,
  FaStopCircle,
  FaPlayCircle,
} from "react-icons/fa";
import PageContainer from "./PageContainer";
import alarmSound from "../assets/sounds/alarm.mp3";

// --- Styled Components with Responsive Additions ---

const CompanionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 1060px;
  min-height: 100vh;
  padding: 40px 20px;
  box-sizing: border-box;
  background-color: #1a1a2e;
  text-align: center;

  @media (max-width: 900px) {
    width: 95%;
    padding: 30px 15px;
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 20px 10px;
  }
`;

const Header = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #fff;
  background: linear-gradient(90deg, #5B86E5, #36D1DC);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: 600px) {
    font-size: 1.8rem;
  }
`;

const InfoText = styled.p`
  color: white;
  margin-bottom: 30px;
  max-width: 500px;
  line-height: 1.6;

  @media (max-width: 600px) {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
`;

const ActionBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  color: white;

  p,
  label {
    color: white;
  }

  small {
    color: #ff6b6b;
    display: block;
    margin-top: 10px;
    font-size: 0.85rem;
  }

  @media (max-width: 600px) {
    padding: 20px 15px;
  }
`;

const DurationInputsWrapper = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 280px;

    span:first-child {
      min-width: 110px;
    }

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
  }

  @media (max-width: 600px) {
    margin: 15px 0;
  }
`;

const DurationInput = styled.input`
  width: 80px;
  padding: 10px;
  margin: 0 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.1rem;
  text-align: center;

  @media (max-width: 600px) {
    width: 100%;
    margin-top: 5px;
  }
`;

const StartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  border: none;
  background: linear-gradient(135deg, #5B86E5, #36D1DC);
  color: white;

  &:disabled {
    background: #4a5568;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 14px;
  }
`;

const SessionScreen = styled.div`
  color: white;
`;

const TimerDisplay = styled.div`
  font-size: 5rem;
  font-weight: bold;
  margin: 20px 0;
  color: #36D1DC;

  @media (max-width: 600px) {
    font-size: 3.5rem;
  }
`;

const SafeButton = styled.button`
  background: linear-gradient(135deg, #25D366, #128C7E);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 20px 40px;
  font-size: 1.5rem;
  cursor: pointer;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    padding: 15px 25px;
    font-size: 1.2rem;
    border-radius: 40px;
  }
`;

const DistressButton = styled.button`
  background: transparent;
  border: 2px solid #ff4d4d;
  color: #ff4d4d;
  padding: 10px 20px;
  border-radius: 8px;
  margin: 20px 0;
  cursor: pointer;

  @media (max-width: 600px) {
    width: 100%;
    font-size: 1rem;
    padding: 12px;
  }
`;

// --- Component ---
const VirtualWalkCompanion = () => {
  const [sessionState, setSessionState] = useState("inactive"); // inactive, active, grace_period, alert_sent
  const [walkDuration, setWalkDuration] = useState(30); // Default 30 minutes total walk
  const [checkInInterval, setCheckInInterval] = useState(5); // Default 5 minute check-ins
  const [destination, setDestination] = useState(""); // State for the destination
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
  const [checkInTimeLeft, setCheckInTimeLeft] = useState(0);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const audioRef = useRef(new Audio(alarmSound));

  const emergencyContact = localStorage.getItem("emergency_contact");

  useEffect(() => {
    if (sessionState === "active" || sessionState === "grace_period") {
      const timerId = setInterval(() => {
        if (sessionTimeLeft > 0) setSessionTimeLeft((t) => t - 1);
        if (checkInTimeLeft > 0) setCheckInTimeLeft((t) => t - 1);
      }, 1000);

      if (sessionTimeLeft === 0 && sessionState === "active") {
        setSessionState("inactive");
      }

      if (checkInTimeLeft === 0) {
        if (sessionState === "active") {
          setSessionState("grace_period");
          setCheckInTimeLeft(checkInInterval * 60);
          audioRef.current.play();
        } else if (sessionState === "grace_period") {
          sendAutomaticAlert();
          setSessionState("alert_sent");
          audioRef.current.pause();
        }
      }

      return () => clearInterval(timerId);
    }
  }, [sessionState, sessionTimeLeft, checkInTimeLeft, checkInInterval]);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      (err) => setError("Could not get location. Please enable permissions."),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getLocation(); // Get location on component mount
    if (audioRef.current) {
      audioRef.current.loop = true;
    }
  }, []);

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    let digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) {
      digits = "263" + digits.substring(1);
    }
    return digits;
  };

  const createWhatsAppLink = (message) => {
    const formattedNumber = formatPhoneNumber(emergencyContact);
    if (!formattedNumber) return "";
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
  };

  const distressMessage = location
    ? `EMERGENCY! I am in distress and need help. I was heading to ${destination}. My current location is https://www.google.com/maps?q=${location.lat},${location.lon}`
    : `EMERGENCY! I am in distress and need help. I was heading to ${destination}.`;

  const sendAutomaticAlert = () => {
    const message = `DANGER ALERT! I failed my safety check-in while heading to ${destination}. Please contact me immediately. My last known location: https://www.google.com/maps?q=${location.lat},${location.lon}`;
    const link = createWhatsAppLink(message);
    if (link) {
      window.location.href = link;
    }
  };

  const handleSafeClick = () => {
    setCheckInTimeLeft(checkInInterval * 60);
    if (sessionState === "grace_period") {
      setSessionState("active");
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const startSession = () => {
    if (
      walkDuration > 0 &&
      checkInInterval > 0 &&
      emergencyContact &&
      location &&
      destination
    ) {
      const startMessage = `Hi, I'm starting a ${walkDuration}-minute walk to ${destination}. My current location is https://www.google.com/maps?q=${location.lat},${location.lon}. If you don't hear from me after this duration, please check on me as something might be wrong.`;
      const link = createWhatsAppLink(startMessage);
      window.open(link, "_blank");
      setSessionTimeLeft(walkDuration * 60);
      setCheckInTimeLeft(checkInInterval * 60);
      setSessionState("active");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const renderContent = () => {
    switch (sessionState) {
      case "active":
      case "grace_period":
        return (
          <SessionScreen>
            <Header>
              {sessionState === "grace_period"
                ? "CHECK-IN REQUIRED"
                : "Session Active"}
            </Header>
            <InfoText>
              Tap "I'm Safe" to reset your {checkInInterval}-minute check-in timer.
            </InfoText>
            {sessionState === "grace_period" && (
              <FaExclamationTriangle size="3rem" color="#ff4d4d" /> 
            )}
            <TimerDisplay>{formatTime(checkInTimeLeft)}</TimerDisplay>
            <p>Total walk time remaining: {formatTime(sessionTimeLeft)}</p>
            <SafeButton onClick={handleSafeClick}>
              <FaCheckCircle /> I'm Safe
            </SafeButton>
            <DistressButton
              onClick={() =>
                window.open(createWhatsAppLink(distressMessage), "_blank")
              }
            >
              Send Distress Signal Now
            </DistressButton>
            <StartButton
              onClick={() => setSessionState("inactive")}
              style={{ background: "grey", marginTop: "10px" }}
            >
              <FaStopCircle /> End Session
            </StartButton>
          </SessionScreen>
        );
      case "alert_sent":
        return (
          <SessionScreen>
            <Header>Alert Sent</Header>
            <InfoText>
              An emergency alert has been sent to your trusted contact.
            </InfoText>
            <StartButton
              onClick={() => setSessionState("inactive")}
              style={{ background: "grey" }}
            >
              <FaStopCircle /> End Session
            </StartButton>
          </SessionScreen>
        );
      case "inactive":
      default:
        return (
          <>
            <Header>Virtual Walk Companion</Header>
            <InfoText>
              Set a timer for your walk. If you don't check in, an alert will be
              sent to your trusted contact.
            </InfoText>
            <ActionBox>
              <p>
                Your emergency contact:{" "}
                <strong>{emergencyContact || "Not Set"}</strong>
              </p>
              <DurationInputsWrapper>
                <label>
                  <span>Destination:</span>
                  <DurationInput
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Library"
                    style={{ width: "140px" }}
                  />
                </label>
                <label>
                  <span>Total walk duration:</span>
                  <DurationInput
                    type="number"
                    value={walkDuration}
                    onChange={(e) =>
                      setWalkDuration(parseInt(e.target.value, 10))
                    }
                  />
                  <span>minutes</span>
                </label>
                <label>
                  <span>Check-in every:</span>
                  <DurationInput
                    type="number"
                    value={checkInInterval}
                    onChange={(e) =>
                      setCheckInInterval(parseInt(e.target.value, 10))
                    }
                  />
                  <span>minutes</span>
                </label>
              </DurationInputsWrapper>
              <small>{error}</small>
              <StartButton
                onClick={startSession}
                disabled={
                  !emergencyContact ||
                  !location ||
                  !walkDuration ||
                  !checkInInterval ||
                  !destination
                }
              >
                <FaPlayCircle /> Start Walk & Notify Contact
              </StartButton>
            </ActionBox>
          </>
        );
    }
  };

  return (
    <PageContainer>
      <CompanionWrapper>{renderContent()}</CompanionWrapper>
    </PageContainer>
  );
};

export default VirtualWalkCompanion;