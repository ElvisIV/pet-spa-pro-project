import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { validateEmail } from '../../utils/validators';
import VerifyCode from './VerifyCode';
import './ClientAuth.css';

const LoginClient = ({ onSwitchToRegister }) => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [accountLocked, setLocked]      = useState(false);
  const [lockedUntil, setLockedUntil]   = useState(null);
  const [remaining, setRemaining]       = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // temporizador de bloqueo
  useEffect(() => {
    if (!lockedUntil) return;
    const iv = setInterval(() => {
      const diff = new Date(lockedUntil).getTime() - Date.now();
      if (diff <= 0) {
        setLocked(false);
        setLockedUntil(null);
        setRemaining('');
        clearInterval(iv);
      } else {
        setRemaining(`${Math.floor(diff / 60000)}:${String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [lockedUntil]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) { setError('Email inválido'); return; }
    if (accountLocked) { setError('Cuenta bloqueada. Intenta más tarde.'); return; }
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.reload();
    } catch (err) {
      const status = err.response?.status;
      const data   = err.response?.data;
      if (status === 423) {
        setLocked(true);
        setLockedUntil(data.locked_until);
        setError(data.message);
      } else if (status === 403 && data?.must_verify_code) {
        setVerificationEmail(data.email);
        setNeedsVerification(true);
      } else if (status === 403 && data?.must_verify_email) {
        setError('Debes verificar tu correo. Revisa tu bandeja de entrada.');
      } else {
        setError(data?.message || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  // Si el backend pide verificación por código
  if (needsVerification) {
    return (
      <VerifyCode
        email={verificationEmail}
        onVerified={() => window.location.reload()}
        onBack={() => setNeedsVerification(false)}
      />
    );
  }

  return (
    <div className="client-auth-container">
      <div className="paw-bg" />
      <div className="auth-card">
        <div className="pet-icon">🐶</div>
        <h2>Portal de Clientes</h2>
        <p className="subtitle">¡Bienvenido de vuelta! 🐾</p>

        {error && (
          <div className={accountLocked ? 'blocked-msg' : 'error-msg'}>{error}</div>
        )}
        {accountLocked && !error && (
          <div className="blocked-msg">
            🔒 Cuenta bloqueada
            {remaining && <><br /><strong>{remaining}</strong><br /><small>minutos restantes</small></>}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              if (accountLocked) { setLocked(false); setLockedUntil(null); setRemaining(''); }
            }}
            required
            disabled={loading || accountLocked}
          />

          {/* Contraseña con ojito */}
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading || accountLocked}
              style={{ paddingRight: '45px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#aaa',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '4px',
                lineHeight: 1,
              }}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="passphrase-hint">
            🔐 Consejo: usa una frase de 3–4 palabras (ej: "perro feliz baño")
          </div>

          <button type="submit" disabled={loading || accountLocked}>
            {loading ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="switch-text">
          ¿No tienes cuenta?{' '}
          <span onClick={onSwitchToRegister} className="link">Regístrate aquí</span>
        </p>
      </div>
    </div>
  );
};

export default LoginClient;