import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = ({ onLogin }) => {
  return (
    <div>
      <h2>Logowanie</h2>
      <LoginForm onLogin={onLogin} />
    </div>
  );
};

export default Login;