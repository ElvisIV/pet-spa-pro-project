// src/components/auth/ChangePassword.jsx
import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { validatePassword } from '../../utils/validators';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    padding: '20px',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #333',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#81c784',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#888',
    textAlign: 'center',
    marginBottom: '32px',
    fontSize: '14px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#b0b0b0',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#222',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#e0e0e0',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#81c784',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  errorBox: {
    backgroundColor: '#3e2723',
    color: '#ef9a9a',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #d32f2f',
  },
  successBox: {
    backgroundColor: '#1b5e20',
    color: '#81c784',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #81c784',
  },
  passwordRules: {
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
  },
};

function ChangePassword({ onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setLoading(true);
    try {
      await api.post('/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setSuccess('Contraseña actualizada correctamente. Redirigiendo...');
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoText}>🔒 Cambio de Contraseña</div>
        <div style={styles.subtitle}>Por seguridad, debes cambiar tu contraseña temporal</div>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}
        {success && <div style={styles.successBox}>✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña Actual</label>
            <input
              type="password"
              style={styles.input}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nueva Contraseña</label>
            <input
              type="password"
              style={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div style={styles.passwordRules}>
              Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmar Nueva Contraseña</label>
            <input
              type="password"
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;