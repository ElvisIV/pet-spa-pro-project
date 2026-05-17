import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    animation: 'cardEntry 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  icon: {
    fontSize: '60px',
    marginBottom: '20px',
    animation: 'bouncePet 2s infinite',
    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))',
  },
  title: {
    color: 'white',
    fontSize: '26px',
    marginBottom: '8px',
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '14px',
    color: 'white',
    fontSize: '24px',
    letterSpacing: '12px',
    textAlign: 'center',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    border: 'none',
    borderRadius: '14px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.3s ease',
  },
  error: {
    color: '#ffcdd2',
    marginTop: '16px',
    background: 'rgba(255, 82, 82, 0.2)',
    padding: '10px',
    borderRadius: '10px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '14px',
  },
};

function VerifyCode({ email, onVerified, onBack }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  // Temporizador de expiración
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/verify-code', { email, code });
      if (onVerified) {
        onVerified(res.data);
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al verificar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🔐</div>
        <h2 style={styles.title}>Verificar código</h2>
        <p style={styles.subtitle}>
          Ingresa el código de 6 dígitos enviado a <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength={6}
            inputMode="numeric"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            style={styles.input}
            autoFocus
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '20px', fontSize: '14px' }}>
          ⏳ El código expira en {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} minutos
        </p>

        {onBack && (
          <button onClick={onBack} style={styles.backBtn}>
            ← Volver
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyCode;