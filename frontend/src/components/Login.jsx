import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(rgba(30, 30, 48, 0.95), rgba(30, 30, 48, 0.95)),
              url(${logo}) center/cover no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`;

const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
`;

const LogoImage = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  padding: 0.5rem;
  border: 2px solid rgba(255, 77, 77, 0.2);
  backdrop-filter: blur(4px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  background: url(${logo}) center/contain no-repeat;
  background-size: contain;
`;

const LoginTitle = styled.h2`
  text-align: center;
  color: #fff;
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  font-weight: 600;
  background: linear-gradient(90deg, #ff4d4d, #f9cb28);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* Increased gap */
  text-align: left; /* Align form elements left if box is text-align:center */
`;

const Input = styled.input`
  padding: 0.9rem 1rem; /* Increased padding */
  border: 1px solid #e0e0e0; /* Softer border */
  border-radius: 6px; /* Softer radius */
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    border-color: #2f3b52; /* Lighter shade from sidebar gradient for focus */
    box-shadow: 0 0 0 3px rgba(47, 59, 82, 0.2); /* Adjusted shadow to match */
    outline: none;
  }
`;

const PasswordInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #757575;
  padding: 5px;

  &:hover {
    color: #2f3b52; /* Lighter shade from sidebar gradient */
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.4rem;
  background: linear-gradient(90deg, #ff4d4d, #f9cb28);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: linear-gradient(90deg, #f94484, #f9cb28);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const SignUpLinkContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #a0aec0;
`;

const LinkText = styled.span`
  color: #2f3b52; /* Lighter shade from sidebar gradient */
  cursor: pointer;
  font-weight: 500;
  text-decoration: none; /* Remove underline by default */

  &:hover {
    color: #1c2639; /* Darker shade from sidebar gradient for hover */
    text-decoration: underline; /* Underline on hover */
  }
`;

const SignUpLink = styled(Link)`
  color: #ff4d4d;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #f94484;
    transform: translateY(-1px);
  }
`;

const Error = styled.div`
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Check if it's a first-time login (e.g., name or college is missing)
      const { user } = data;
      if (!user.name || !user.surname || !user.college || !user.program) {
        setShowWelcomeModal(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <LogoImage />
        <LoginTitle>Safe Sphere Login</LoginTitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInputContainer>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '40px' }} /* Space for the icon */
            />
            <PasswordToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggleButton>
          </PasswordInputContainer>
          <Button type="submit">Login</Button>
          {error && <Error>{error}</Error>}
        </Form>
        <SignUpLinkContainer>
          Don't have an account? <SignUpLink to="/signup">Sign up</SignUpLink>
        </SignUpLinkContainer>
      </LoginBox>
      {showWelcomeModal && (
        <WelcomeModal 
          onOk={() => { // Changed from onClose/onGoToSettings
            setShowWelcomeModal(false);
            navigate('/dashboard');
          }}
        />
      )}
    </LoginContainer>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 450px;
  width: 90%;

  h3 {
    margin-top: 0;
    color: #333;
  }

  p {
    color: #555;
    margin-bottom: 1.5rem;
  }
`;

const WelcomeModal = ({ onOk }) => (
  <ModalOverlay>
    <ModalContent>
      <h3>Welcome to Safe Sphere!</h3>
      <p>
        It looks like this is your first time logging in or your profile is incomplete.
        Please take a moment to set up your details on the settings page at your convenience.
      </p>
      <Button onClick={onOk} style={{ backgroundColor: '#007bff' }}>OK</Button>
    </ModalContent>
  </ModalOverlay>
);

export default Login;
