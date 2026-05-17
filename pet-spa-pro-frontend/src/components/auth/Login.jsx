import React, { useState, useEffect } from 'react';
import { validateEmail } from '../../utils/validators';
import VerifyCode from './VerifyCode';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #EDE9FE 0%, #FDF2F8 50%, #ECFDF5 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
  },
  blob1: {
    position: 'absolute', top: '-80px', right: '-80px',
    width: '360px', height: '360px', borderRadius: '50%',
    background: 'rgba(124,58,237,0.12)',
    animation: 'blobFloat 7s ease-in-out infinite',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', bottom: '-100px', left: '-60px',
    width: '300px', height: '300px', borderRadius: '50%',
    background: 'rgba(236,72,153,0.1)',
    animation: 'blobFloat 9s ease-in-out infinite reverse',
    pointerEvents: 'none',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '28px',
    padding: '44px 40px',
    width: '100%',
    maxWidth: '400px',
    border: '1.5px solid rgba(124,58,237,0.15)',
    boxShadow: '0 20px 60px rgba(124,58,237,0.14)',
    position: 'relative',
    zIndex: 1,
    animation: 'cardPop 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '36px',
  },
  pawIcon: {
    fontSize: '56px',
    display: 'block',
    marginBottom: '14px',
    animation: 'petBounce 2.5s ease-in-out infinite',
  },
  brandName: {
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  brandSub: {
    fontSize: '13px',
    color: '#78716C',
    marginTop: '4px',
    fontWeight: '600',
  },
  fieldGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '7px',
    color: '#78716C',
    fontSize: '12px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.9px',
  },
  input: {
    width: '100%',
    padding: '13px 16px',
    background: '#FAFAF9',
    border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: '13px',
    color: '#1C1917',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  hint: {
    fontSize: '12px',
    color: '#78716C',
    marginTop: '7px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: '600',
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.2s',
    boxShadow: '0 5px 18px rgba(124,58,237,0.32)',
    letterSpacing: '0.3px',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  errorBox: {
    background: '#FEF2F2',
    color: '#991B1B',
    border: '1px solid #FCA5A5',
    borderRadius: '13px',
    padding: '13px 16px',
    marginBottom: '22px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    animation: 'shake 0.4s ease',
  },
  blockedBox: {
    background: '#F5F3FF',
    border: '1px solid #C4B5FD',
    borderRadius: '13px',
    padding: '18px',
    marginBottom: '22px',
    textAlign: 'center',
  },
  blockedTitle: {
    color: '#5B21B6',
    fontWeight: '800',
    fontSize: '15px',
    marginBottom: '8px',
  },
  blockedTimer: {
    fontSize: '38px',
    fontWeight: '800',
    color: '#7C3AED',
    fontFamily: 'monospace',
    letterSpacing: '2px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#7C3AED',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: '9px',
    transition: 'background 0.2s',
    fontFamily: 'inherit',
  },
};

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  @keyframes cardPop {
    from { opacity: 0; transform: scale(0.9) translateY(24px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes petBounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes blobFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50%       { transform: translateY(-20px) scale(1.05); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-8px); }
    75%       { transform: translateX(8px); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ps-submit:hover:not(:disabled) {
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 28px rgba(124,58,237,0.42) !important;
  }
  .ps-back:hover { background: #EDE9FE !important; }
`;

function Login({ onSubmit, onBack, onLoginSuccess }) {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [focused, setFocused]       = useState(null);
  const [accountLocked, setLocked]  = useState(false);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [remaining, setRemaining]   = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  useEffect(() => {
    if (!lockedUntil) return;
    const iv = setInterval(() => {
      const diff = new Date(lockedUntil).getTime() - Date.now();
      if (diff <= 0) { setLocked(false); setLockedUntil(null); setRemaining(''); clearInterval(iv); }
      else setRemaining(`${Math.floor(diff / 60000)}:${String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(iv);
  }, [lockedUntil]);

  const focusStyle = { borderColor: '#7C3AED', boxShadow: '0 0 0 3px rgba(124,58,237,0.12)', background: '#FFFFFF' };
  const blurStyle  = { borderColor: 'rgba(0,0,0,0.1)', boxShadow: 'none', background: '#FAFAF9' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Todos los campos son requeridos'); return; }
    if (!validateEmail(email)) { setError('Email no válido'); return; }
    if (accountLocked) { setError('Cuenta bloqueada. Intenta más tarde.'); return; }
    setLoading(true);
    const result = await onSubmit({ email, password });
    setLoading(false);
    if (result.success) return;
    if (result.status === 423) {
      setLocked(true); setLockedUntil(result.data.locked_until); setError(result.message);
    } else if (result.status === 403 && result.data?.must_verify_code) {
      setVerificationEmail(result.data.email); setNeedsVerification(true);
    } else if (result.status === 403 && result.data?.must_verify_email) {
      setError('Debes verificar tu correo electrónico.');
    } else {
      setError(result.message);
    }
  };

  if (needsVerification) {
    return (
      <VerifyCode
        email={verificationEmail}
        onVerified={(data) => { if (onLoginSuccess) onLoginSuccess(data.user, data.token); else window.location.reload(); }}
        onBack={() => setNeedsVerification(false)}
      />
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        {onBack && (
          <button className="ps-back" style={styles.backBtn} onClick={onBack}>
            ← Volver
          </button>
        )}

        <div style={styles.logoArea}>
          <span style={styles.pawIcon}>🐾</span>
          <div style={styles.brandName}>Pet Spa Pro</div>
          <div style={styles.brandSub}>Portal de Administración</div>
        </div>

        {error && (
          <div style={styles.errorBox}>
            ⚠️ <span>{error}</span>
          </div>
        )}

        {accountLocked && !error && (
          <div style={styles.blockedBox}>
            <div style={styles.blockedTitle}>🔒 Cuenta bloqueada</div>
            {remaining && <div style={styles.blockedTimer}>{remaining}</div>}
            <div style={{ color: '#7C3AED', fontSize: '12px', fontWeight: '600', marginTop: '4px' }}>minutos restantes</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email" placeholder="admin@petspapro.com"
              value={email}
              onChange={e => { setEmail(e.target.value); if (accountLocked) { setLocked(false); setLockedUntil(null); setRemaining(''); } }}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              style={{ ...styles.input, ...(focused === 'email' ? focusStyle : blurStyle) }}
              disabled={loading || accountLocked}
            />
          </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Contraseña</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFocused('password')}
                                  onBlur={() => setFocused(null)}
                        style={{
                          ...styles.input,
                          ...(focused === 'password' ? focusStyle : blurStyle),
                          paddingRight: '45px', // espacio para el icono del ojo
                        }}
                        disabled={loading || accountLocked}
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
                            transition: 'color 0.2s',
                          }}
                          onMouseOver={e => e.currentTarget.style.color = '#81c784'}
                          onMouseOut={e => e.currentTarget.style.color = '#aaa'}
                          tabIndex={-1}
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </button>
          </div>
          <div style={styles.hint}>🔐 Usa una frase de 3–4 palabras</div>
        </div>

          <button
            type="submit"
            className="ps-submit"
            style={{ ...styles.submitBtn, opacity: loading || accountLocked ? 0.7 : 1, cursor: loading || accountLocked ? 'not-allowed' : 'pointer' }}
            disabled={loading || accountLocked}
          >
            {loading ? (
              <>
                <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                Iniciando sesión...
              </>
            ) : '🚀 Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
