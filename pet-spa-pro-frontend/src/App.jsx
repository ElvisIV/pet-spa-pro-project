// App.jsx
import React, { useState, useEffect } from 'react';
import Login from './components/auth/Login';
import Dashboard from './components/tabs/Dashboard';
import ChangePassword from './components/auth/ChangePassword';
import api from './api/axiosConfig';

import ClientAuth from './components/auth/ClientAuth';

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#e0e0e0',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  header: {
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #333',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#81c784',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userName: {
    color: '#b0b0b0',
    fontSize: '14px',
  },
  userRol: {
    color: '#81c784',
    fontSize: '12px',
    textTransform: 'capitalize',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #d32f2f',
    color: '#d32f2f',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },
};
function App() {
  const [user, setUser] = useState(null);
  const [portal, setPortal] = useState(null); // 'staff', 'clients'

  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.must_change_password) {
          setMustChangePassword(true);
        }
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);

    const attempts = localStorage.getItem('loginAttempts');
    const blockedUntil = localStorage.getItem('loginBlockedUntil');
    if (attempts) setLoginAttempts(parseInt(attempts));
    if (blockedUntil && Date.now() < parseInt(blockedUntil)) {
      setIsBlocked(true);
      setBlockTimer(Math.ceil((parseInt(blockedUntil) - Date.now()) / 1000));
    }
  }, []);

  useEffect(() => {
    if (isBlocked && blockTimer > 0) {
      const timer = setInterval(() => {
        setBlockTimer(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setLoginAttempts(0);
            localStorage.removeItem('loginBlockedUntil');
            localStorage.removeItem('loginAttempts');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isBlocked, blockTimer]);
const handleLogin = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    const { user: userData, token } = response.data;
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    if (userData.must_change_password) {
      setMustChangePassword(true);
    }
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al iniciar sesión',
      status: error.response?.status,
      data: error.response?.data,
    };
  }
};
const handleLoginSuccess = (userData, token) => {
  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', token);
  setLoginAttempts(0);
  localStorage.removeItem('loginAttempts');
  
  if (userData.must_change_password) {
    setMustChangePassword(true);
  }
};
  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } finally {
      setUser(null);
      setMustChangePassword(false);
      localStorage.clear();
    }
  };

  const handlePasswordChanged = () => {
    setMustChangePassword(false);
    const updatedUser = { ...user, must_change_password: false };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return (
      <div style={{ ...styles.app, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#81c784', fontSize: '24px' }}>⏳ Cargando...</div>
      </div>
    );
  }

if (!user) {
  // Pantalla de selección de portal
  if (!portal) {
    return (
      <div style={{
        ...styles.app,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#81c784', fontSize: '48px', margin: 0 }}>🐾 Pet Spa Pro</h1>
          <p style={{ color: '#aaa', marginTop: '10px' }}>Elige tu portal de acceso</p>
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setPortal('staff')}
            style={{
              padding: '20px 40px',
              fontSize: '20px',
              background: '#1a1a1a',
              border: '2px solid #81c784',
              color: '#81c784',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onMouseOver={e => { e.target.style.background = '#81c784'; e.target.style.color = '#0a0a0a'; }}
            onMouseOut={e => { e.target.style.background = '#1a1a1a'; e.target.style.color = '#81c784'; }}
          >
            🔐 Staff
          </button>
          <button
            onClick={() => setPortal('clients')}
            style={{
              padding: '20px 40px',
              fontSize: '20px',
              background: '#1a1a1a',
              border: '2px solid #f5576c',
              color: '#f5576c',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: '0.3s',
            }}
            onMouseOver={e => { e.target.style.background = '#f5576c'; e.target.style.color = '#fff'; }}
            onMouseOut={e => { e.target.style.background = '#1a1a1a'; e.target.style.color = '#f5576c'; }}
          >
            🐶 Clientes
          </button>
        </div>
      </div>
    );
  }

  // Portal Staff
// En la parte de renderizado cuando portal === 'staff':
if (portal === 'staff') {
    return (
      <div style={styles.app}>
        <Login 
          onSubmit={handleLogin} 
          onBack={() => setPortal(null)} 
          onLoginSuccess={handleLoginSuccess} 
        />
      </div>
    );
}

  // Portal Clientes
  if (portal === 'clients') {
    return <ClientAuth onBack={() => setPortal(null)} />;
  }
}
  if (mustChangePassword) {
    return (
      <div style={styles.app}>
        <ChangePassword onSuccess={handlePasswordChanged} />
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <span>🐾</span>
          <span>Pet Spa Pro</span>
        </div>
        <div style={styles.userInfo}>
          <div>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRol}>{user.rol}</div>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}
            onMouseOver={e => { e.target.style.backgroundColor = '#d32f2f'; e.target.style.color = 'white'; }}
            onMouseOut={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#d32f2f'; }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>
      <Dashboard />
    </div>
  );
}

export default App;