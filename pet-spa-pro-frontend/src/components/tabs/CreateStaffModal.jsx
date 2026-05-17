import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(30,10,60,0.5)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    padding: '20px',
    animation: 'overlayIn 0.2s ease',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    padding: '36px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 24px 60px rgba(124,58,237,0.2)',
    border: '1.5px solid rgba(124,58,237,0.12)',
    animation: 'modalPop 0.35s cubic-bezier(0.175,0.885,0.32,1.275)',
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '28px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(0,0,0,0.07)',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '15px',
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    flexShrink: 0,
    boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
  },
  titleText: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: '-0.3px',
  },
  subtitleText: {
    fontSize: '13px',
    color: '#78716C',
    marginTop: '2px',
  },
  inputGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#78716C',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#FAFAF9',
    border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: '12px',
    color: '#1C1917',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '28px',
  },
  cancelBtn: {
    padding: '11px 22px',
    backgroundColor: 'transparent',
    border: '1.5px solid rgba(0,0,0,0.12)',
    color: '#78716C',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  createBtn: {
    padding: '11px 26px',
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '800',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    color: '#991B1B',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #FCA5A5',
    fontSize: '14px',
    fontWeight: '600',
  },
  successBox: {
    backgroundColor: '#ECFDF5',
    color: '#065F46',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '20px',
    border: '1px solid #6EE7B7',
    fontSize: '14px',
    fontWeight: '600',
  },
};

function CreateStaffModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('groomer');
  const [telefono, setTelefono] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [turno, setTurno] = useState('mañana');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const focusStyle = {
    borderColor: '#7C3AED',
    boxShadow: '0 0 0 3px rgba(124,58,237,0.12)',
    backgroundColor: '#FFFFFF',
  };

  const handleFocus = (e) => Object.assign(e.target.style, focusStyle);
  const handleBlur  = (e) => {
    e.target.style.borderColor = 'rgba(0,0,0,0.1)';
    e.target.style.boxShadow = 'none';
    e.target.style.backgroundColor = '#FAFAF9';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!name || !email || !telefono) { setError('Nombre, email y teléfono son obligatorios'); return; }
    if (rol === 'groomer' && !especialidad.trim()) { setError('Para el rol Groomer debes indicar una especialidad'); return; }
    setLoading(true);
    try {
      const payload = { name, email, rol, telefono, turno };
      if (rol === 'groomer') payload.especialidad = especialidad;
      await api.post('/users/staff', payload);
      setSuccess('Personal creado. Se envió un correo con las credenciales.');
      setTimeout(() => { onCreated(); onClose(); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear personal');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName(''); setEmail(''); setRol('groomer'); setTelefono('');
    setEspecialidad(''); setTurno('mañana'); setError(''); setSuccess('');
    onClose();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.88) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ps-cancel:hover { border-color: #7C3AED !important; color: #7C3AED !important; }
        .ps-create:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(124,58,237,0.4) !important; }
      `}</style>

      <div style={styles.overlay} onClick={handleClose}>
        <div style={styles.modal} onClick={e => e.stopPropagation()}>

          <div style={styles.modalHeader}>
            <div style={styles.iconBox}>✨</div>
            <div>
              <div style={styles.titleText}>Crear Nuevo Personal</div>
              <div style={styles.subtitleText}>Completa los datos del colaborador</div>
            </div>
          </div>

          {error   && <div style={styles.errorBox}>⚠️ {error}</div>}
          {success && <div style={styles.successBox}>✅ {success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre Completo</label>
              <input type="text" style={styles.input} value={name}
                onChange={e => setName(e.target.value)}
                onFocus={handleFocus} onBlur={handleBlur}
                placeholder="Ej: Juan Pérez" required />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" style={styles.input} value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={handleFocus} onBlur={handleBlur}
                placeholder="correo@ejemplo.com" required />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Teléfono</label>
              <input type="text" style={styles.input} value={telefono}
                onChange={e => setTelefono(e.target.value)}
                onFocus={handleFocus} onBlur={handleBlur}
                placeholder="+591 77777777" required />
            </div>

            <div style={styles.row2}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Rol</label>
                <select style={styles.input} value={rol}
                  onChange={e => setRol(e.target.value)}
                  onFocus={handleFocus} onBlur={handleBlur}>
                  <option value="groomer">🐕 Groomer</option>
                  <option value="recepcion">📋 Recepción</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Turno</label>
                <select style={styles.input} value={turno}
                  onChange={e => setTurno(e.target.value)}
                  onFocus={handleFocus} onBlur={handleBlur}>
                  <option value="mañana">🌅 Mañana</option>
                  <option value="tarde">🌇 Tarde</option>
                  <option value="noche">🌃 Noche</option>
                </select>
              </div>
            </div>

            {rol === 'groomer' && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Especialidad</label>
                <input type="text" style={styles.input} value={especialidad}
                  onChange={e => setEspecialidad(e.target.value)}
                  onFocus={handleFocus} onBlur={handleBlur}
                  placeholder="Ej: Corte de pelo, Baño medicado" required />
              </div>
            )}

            <div style={styles.buttons}>
              <button type="button" className="ps-cancel" style={styles.cancelBtn} onClick={handleClose}>
                Cancelar
              </button>
              <button type="submit" className="ps-create"
                style={{ ...styles.createBtn, opacity: loading ? 0.7 : 1 }}
                disabled={loading}>
                {loading ? '⏳ Creando...' : '✨ Crear Personal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateStaffModal;
