import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const ROLE_CONFIG = {
  admin:     { bg: '#EDE9FE', color: '#5B21B6', label: 'Admin' },
  groomer:   { bg: '#CCFBF1', color: '#0F766E', label: 'Groomer' },
  recepcion: { bg: '#FEF3C7', color: '#B45309', label: 'Recepción' },
  cliente:   { bg: '#FDF2F8', color: '#9D174D', label: 'Cliente' },
};

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #7C3AED, #EC4899)',
  'linear-gradient(135deg, #0D9488, #10B981)',
  'linear-gradient(135deg, #F59E0B, #F97316)',
  'linear-gradient(135deg, #EC4899, #A855F7)',
  'linear-gradient(135deg, #3B82F6, #6366F1)',
  'linear-gradient(135deg, #14B8A6, #06B6D4)',
];

const getAvatarGradient = (id) => AVATAR_GRADIENTS[id % AVATAR_GRADIENTS.length];
const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

const styles = {
  container: {
    background: '#FFFFFF',
    borderRadius: '24px',
    border: '1px solid rgba(0,0,0,0.08)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    animation: 'fadeUp 0.4s ease-out',
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
  },
  panelHeader: {
    padding: '20px 28px',
    borderBottom: '1px solid rgba(0,0,0,0.07)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #F5F3FF 0%, #FDF2F8 100%)',
  },
  panelTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#7C3AED',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    letterSpacing: '-0.3px',
  },
  refreshBtn: {
    padding: '8px 16px',
    borderRadius: '11px',
    border: '1.5px solid #7C3AED',
    background: '#FFFFFF',
    color: '#7C3AED',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 24px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    color: '#78716C',
    background: '#FAFAF9',
    borderBottom: '1px solid rgba(0,0,0,0.07)',
  },
  td: {
    padding: '14px 24px',
    borderBottom: '1px solid rgba(0,0,0,0.04)',
    fontSize: '14px',
    color: '#1C1917',
    transition: 'background 0.2s',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: '17px',
    flexShrink: 0,
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    fontWeight: '700',
    fontSize: '14px',
    color: '#1C1917',
  },
  userEmail: {
    fontSize: '12px',
    color: '#78716C',
    marginTop: '1px',
  },
  badge: {
    padding: '5px 13px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'inline-block',
    letterSpacing: '0.2px',
  },
  footer: {
    padding: '16px 28px',
    background: 'linear-gradient(135deg, #F5F3FF 0%, #FDF2F8 100%)',
    borderTop: '1px solid rgba(0,0,0,0.07)',
    display: 'flex',
    gap: '28px',
    fontSize: '13px',
    color: '#78716C',
    fontWeight: '600',
  },
  footerValue: {
    color: '#7C3AED',
    fontWeight: '800',
  },
  loading: {
    textAlign: 'center',
    padding: '64px',
    color: '#7C3AED',
    fontSize: '16px',
    fontWeight: '700',
    background: '#FFFFFF',
    borderRadius: '24px',
  },
  alertBox: (type) => ({
    margin: '16px 24px',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    ...(type === 'error'
      ? { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5' }
      : { background: '#ECFDF5', color: '#065F46', border: '1px solid #6EE7B7' }),
  }),
};

function UsuariosTab() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchUsers = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.get('/users');
      setUsers(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (userId, currentEstado, userName) => {
    const action = currentEstado === 'activo' ? 'desactivar' : 'activar';
    if (!window.confirm(`¿Estás seguro de ${action} a ${userName}?`)) return;
    try {
      setError(null); setSuccess(null);
      const res = await api.put(`/users/${userId}/estado`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, estado: res.data.estado } : u));
      setSuccess(`Usuario ${action === 'activar' ? 'activado' : 'desactivado'} exitosamente`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Error al ${action} usuario`);
      fetchUsers();
    }
  };

  if (loading) return <div style={styles.loading}>⏳ Cargando usuarios...</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ps-user-row:hover td { background: #F5F3FF !important; }
        .ps-refresh:hover { background: #7C3AED !important; color: #fff !important; }
        .ps-deactivate {
          padding: 7px 15px; border-radius: 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; border: 1.5px solid #FCA5A5;
          background: #FEF2F2; color: #991B1B; transition: all 0.2s;
          font-family: inherit;
        }
        .ps-deactivate:hover { background: #991B1B !important; color: #fff !important; transform: translateY(-1px); }
        .ps-activate {
          padding: 7px 15px; border-radius: 10px; font-size: 13px; font-weight: 700;
          cursor: pointer; border: 1.5px solid #6EE7B7;
          background: #ECFDF5; color: #065F46; transition: all 0.2s;
          font-family: inherit;
        }
        .ps-activate:hover { background: #065F46 !important; color: #fff !important; transform: translateY(-1px); }
      `}</style>

      <div style={styles.container}>
        <div style={styles.panelHeader}>
          <div style={styles.panelTitle}>👥 Gestión de Usuarios</div>
          <button className="ps-refresh" style={styles.refreshBtn} onClick={fetchUsers}>
            🔄 Actualizar
          </button>
        </div>

        {error   && <div style={styles.alertBox('error')}>⚠️ {error}</div>}
        {success && <div style={styles.alertBox('success')}>✅ {success}</div>}

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Usuario</th>
                <th style={styles.th}>Rol</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Registro</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const roleConf = ROLE_CONFIG[user.rol] || { bg: '#F1F5F9', color: '#475569', label: user.rol };
                const isActive = user.estado === 'activo';
                return (
                  <tr key={user.id} className="ps-user-row">
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={{ ...styles.avatar, background: getAvatarGradient(user.id) }}>
                          {getInitial(user.name)}
                        </div>
                        <div>
                          <div style={styles.userName}>{user.name}</div>
                          <div style={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: roleConf.bg, color: roleConf.color }}>
                        {roleConf.label}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: isActive ? '#ECFDF5' : '#FEF2F2',
                        color:      isActive ? '#065F46' : '#991B1B',
                      }}>
                        {isActive ? '✓ Activo' : '✗ Inactivo'}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: '#78716C', fontSize: '13px' }}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : '—'}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleToggle(user.id, user.estado, user.name)}
                        className={isActive ? 'ps-deactivate' : 'ps-activate'}
                      >
                        {isActive ? '🚫 Desactivar' : '✅ Activar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#78716C', fontSize: '15px' }}>
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.footer}>
          <span>Total: <strong style={styles.footerValue}>{users.length}</strong> usuarios</span>
          <span>Activos: <strong style={styles.footerValue}>{users.filter(u => u.estado === 'activo').length}</strong></span>
        </div>
      </div>
    </>
  );
}

export default UsuariosTab;
