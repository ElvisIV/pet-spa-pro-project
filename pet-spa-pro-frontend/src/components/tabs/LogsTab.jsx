import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const ACTION_CONFIG = {
  login_success:      { bg: '#ECFDF5', color: '#065F46', label: 'Login exitoso' },
  login_failed:       { bg: '#FEF2F2', color: '#991B1B', label: 'Login fallido' },
  login_blocked:      { bg: '#F5F3FF', color: '#5B21B6', label: 'Login bloqueado' },
  logout:             { bg: '#FEF3C7', color: '#B45309', label: 'Logout' },
  user_registered:    { bg: '#EFF6FF', color: '#1D4ED8', label: 'Registro usuario' },
  staff_created:      { bg: '#CCFBF1', color: '#0F766E', label: 'Personal creado' },
  user_status_changed:{ bg: '#FDF2F8', color: '#9D174D', label: 'Estado cambiado' },
  password_changed:   { bg: '#EDE9FE', color: '#5B21B6', label: 'Cambio contraseña' },
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('es-ES', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
};

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
  filtersBar: {
    padding: '16px 24px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    alignItems: 'center',
    background: '#FAFAF9',
    borderBottom: '1px solid rgba(0,0,0,0.07)',
  },
  filterInput: {
    padding: '9px 14px',
    background: '#FFFFFF',
    border: '1.5px solid rgba(0,0,0,0.1)',
    borderRadius: '11px',
    color: '#1C1917',
    fontSize: '13px',
    fontWeight: '600',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  },
  filterBtn: {
    padding: '9px 20px',
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '11px',
    fontWeight: '800',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 3px 10px rgba(124,58,237,0.25)',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  filterSep: {
    fontSize: '13px',
    color: '#78716C',
    fontWeight: '600',
    padding: '0 2px',
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
    padding: '13px 24px',
    borderBottom: '1px solid rgba(0,0,0,0.04)',
    fontSize: '14px',
    color: '#1C1917',
  },
  badge: {
    padding: '5px 13px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    display: 'inline-block',
  },
  loading: {
    textAlign: 'center',
    padding: '64px',
    color: '#7C3AED',
    fontSize: '16px',
    fontWeight: '700',
  },
};

function LogsTab() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ action: '', user: '', from: '', to: '' });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.action) params.action = filters.action;
      if (filters.user)   params.user   = filters.user;
      if (filters.from)   params.from   = filters.from;
      if (filters.to)     params.to     = filters.to;
      const res = await api.get('/audit-logs', { params });
      setLogs(res.data.data || res.data);
    } catch (err) {
      console.error('Error al obtener logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSearch = (e) => { e.preventDefault(); fetchLogs(); };

  const focusStyle  = { borderColor: '#7C3AED', boxShadow: '0 0 0 3px rgba(124,58,237,0.1)' };
  const handleFocus = (e) => Object.assign(e.target.style, focusStyle);
  const handleBlur  = (e) => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none'; };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ps-log-row:hover td { background: #F5F3FF !important; }
        .ps-refresh:hover { background: #7C3AED !important; color: #fff !important; }
        .ps-filter-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(124,58,237,0.35) !important; }
      `}</style>

      <div style={styles.container}>
        <div style={styles.panelHeader}>
          <div style={styles.panelTitle}>📋 Registro de Auditoría</div>
          <button className="ps-refresh" style={styles.refreshBtn} onClick={fetchLogs}>
            🔄 Actualizar
          </button>
        </div>

        {/* FILTROS */}
        <form onSubmit={handleSearch} style={styles.filtersBar}>
          <select
            name="action" value={filters.action} onChange={handleChange}
            style={styles.filterInput} onFocus={handleFocus} onBlur={handleBlur}
          >
            <option value="">Todos los eventos</option>
            {Object.keys(ACTION_CONFIG).map(a => (
              <option key={a} value={a}>{ACTION_CONFIG[a].label}</option>
            ))}
          </select>

          <input
            type="text" name="user" placeholder="Buscar usuario"
            value={filters.user} onChange={handleChange}
            style={styles.filterInput} onFocus={handleFocus} onBlur={handleBlur}
          />

          <input
            type="date" name="from" value={filters.from} onChange={handleChange}
            style={styles.filterInput} onFocus={handleFocus} onBlur={handleBlur}
          />
          <span style={styles.filterSep}>→</span>
          <input
            type="date" name="to" value={filters.to} onChange={handleChange}
            style={styles.filterInput} onFocus={handleFocus} onBlur={handleBlur}
          />

          <button type="submit" className="ps-filter-btn" style={styles.filterBtn}>
            🔍 Filtrar
          </button>
        </form>

        {loading ? (
          <div style={styles.loading}>⏳ Cargando registros...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Usuario</th>
                  <th style={styles.th}>Rol</th>
                  <th style={styles.th}>Evento</th>
                  <th style={styles.th}>IP</th>
                  <th style={styles.th}>Fecha / Hora</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#78716C', fontSize: '15px' }}>
                      No se encontraron registros
                    </td>
                  </tr>
                ) : (
                  logs.map(log => {
                    const conf = ACTION_CONFIG[log.action] || { bg: '#F1F5F9', color: '#475569', label: log.action };
                    return (
                      <tr key={log.id} className="ps-log-row">
                        <td style={styles.td}>
                          <span style={{ fontWeight: '700' }}>{log.user?.name || 'Sistema'}</span>
                        </td>
                        <td style={styles.td}>
                          {log.user?.rol ? (
                            <span style={{ ...styles.badge, background: '#EDE9FE', color: '#5B21B6' }}>
                              {log.user.rol}
                            </span>
                          ) : '—'}
                        </td>
                        <td style={styles.td}>
                          <span style={{ ...styles.badge, background: conf.bg, color: conf.color }}>
                            {conf.label}
                          </span>
                        </td>
                        <td style={{ ...styles.td, color: '#78716C', fontSize: '13px', fontFamily: 'monospace' }}>
                          {log.ip_address || '—'}
                        </td>
                        <td style={{ ...styles.td, color: '#78716C', fontSize: '13px' }}>
                          {formatDate(log.created_at)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default LogsTab;
