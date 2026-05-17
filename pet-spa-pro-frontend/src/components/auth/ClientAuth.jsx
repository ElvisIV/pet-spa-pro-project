import React, { useState } from 'react';
import LoginClient from './LoginClient';
import RegisterClient from './RegisterClient';

const ClientAuth = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onBack}
        style={{
          position: 'absolute', top: 20, left: 20, zIndex: 10,
          background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 8, cursor: 'pointer'
        }}
      >
        ← Volver
      </button>
      {isLogin ? (
        <LoginClient onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <RegisterClient onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
  
};

export default ClientAuth;