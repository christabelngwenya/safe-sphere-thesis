import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';

const SignupContainer = styled.div`
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

const SignupBox = styled.div`
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

const SignupTitle = styled.h2`
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
  text-align: left;
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

const Error = styled.div`
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const LoginLinkContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: #a0aec0;
  font-size: 0.9rem;
`;

const LinkText = styled.span`
  color: #ff4d4d;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #f94484;
    transform: translateY(-1px);
  }
`;

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json(); // Always try to parse JSON

      if (!response.ok) {
        // Handle errors from backend (e.g., user exists, validation errors)
        if (responseData.errors && Array.isArray(responseData.errors)) {
          setError(responseData.errors.map(err => err.msg).join(', '));
        } else {
          setError(responseData.message || 'Signup failed');
        }
        return;
      }

      // Handle successful signup
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Signup fetch error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <SignupContainer>
      <SignupBox>
        <LogoImage />
        <SignupTitle>Create Account</SignupTitle>
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
              style={{ paddingRight: '40px' }}
            />
            <PasswordToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggleButton>
          </PasswordInputContainer>
          <PasswordInputContainer>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ paddingRight: '40px' }}
            />
            <PasswordToggleButton type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggleButton>
          </PasswordInputContainer>
          <Button type="submit">Sign Up</Button>
          {error && <Error>{error}</Error>}
        </Form>
        <LoginLinkContainer>
          Already have an account? <LinkText onClick={() => navigate('/login')}>Login</LinkText>
        </LoginLinkContainer>
      </SignupBox>
    </SignupContainer>
  );
};

export default Signup;
