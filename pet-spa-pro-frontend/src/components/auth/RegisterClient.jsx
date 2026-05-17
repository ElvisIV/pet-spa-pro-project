import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { validateEmail, validatePassword } from '../../utils/validators';
import PasswordStrengthMeter from '../common/PasswordStrengthMeter';
import VerifyCode from './VerifyCode';
import './ClientAuth.css';

const RegisterClient = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    telefono: '',
    ci: '',
    direccion: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Estados para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Calcular requisitos de contraseña en tiempo real
  const password = form.password;
  const requirements = [
    { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { label: 'Al menos una mayúscula', met: /[A-Z]/.test(password) },
    { label: 'Al menos una minúscula', met: /[a-z]/.test(password) },
    { label: 'Al menos un número', met: /[0-9]/.test(password) },
    { label: 'Al menos un símbolo (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(form.email)) {
      setError('Email inválido');
      return;
    }
    if (form.password !== form.password_confirmation) {
      setError('Las contraseñas no coinciden');
      return;
    }
    const validation = validatePassword(form.password);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/register', form);
      setVerificationEmail(res.data.email);
      setNeedsVerification(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  if (needsVerification) {
    return (
      <VerifyCode
        email={verificationEmail}
        onVerified={() => window.location.reload()}
        onBack={() => setNeedsVerification(false)}
      />
    );
  }

  // Estilo para el ojo (puedes extraer a CSS si prefieres)
  const eyeBtnStyle = {
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
  };

  return (
    <div className="client-auth-container">
      <div className="paw-bg" />
      <div className="auth-card">
        <div className="pet-icon">🐱</div>
        <h2>Crear Cuenta</h2>
        <p className="subtitle">Únete a nuestra familia peluda 🐾</p>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Nombre completo" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} required />
          <input name="telefono" placeholder="Teléfono" onChange={handleChange} required />
          <input name="ci" placeholder="Cédula de identidad" onChange={handleChange} required />
          <input name="direccion" placeholder="Dirección" onChange={handleChange} required />

          {/* Contraseña con ojo */}
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              onChange={handleChange}
              required
              style={{ paddingRight: '45px' }}
            />
            <button
              type="button"
              style={eyeBtnStyle}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Indicador de fortaleza */}
          <PasswordStrengthMeter password={form.password} />

          {/* Lista de requisitos en tiempo real */}
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0', fontSize: '13px', color: '#ccc' }}>
            {requirements.map((req, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ color: req.met ? '#81c784' : '#e57373', fontWeight: 'bold' }}>
                  {req.met ? '✓' : '✗'}
                </span>
                {req.label}
              </li>
            ))}
          </ul>

          {/* Confirmar contraseña con ojo */}
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input
              name="password_confirmation"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repetir contraseña"
              onChange={handleChange}
              required
              style={{ paddingRight: '45px' }}
            />
            <button
              type="button"
              style={eyeBtnStyle}
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
            >
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Registrarme'}
          </button>
        </form>
        <p className="switch-text">
          ¿Ya tienes cuenta?{' '}
          <span onClick={onSwitchToLogin} className="link">
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterClient;