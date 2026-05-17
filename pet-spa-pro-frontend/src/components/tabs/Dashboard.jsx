import React, { useState } from 'react';
import UsuariosTab from './UsuariosTab';
import LogsTab from './LogsTab';
import CreateStaffModal from './CreateStaffModal';

const theme = {
  gradientMain: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
  gradientSoft: 'linear-gradient(135deg, #EDE9FE 0%, #FDF2F8 100%)',
  purple: '#7C3AED',
  pink: '#EC4899',
  purpleLight: '#EDE9FE',
  surface: '#FAFAF9',
  card: '#FFFFFF',
  border: 'rgba(0,0,0,0.08)',
  text: '#1C1917',
  muted: '#78716C',
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: theme.surface,
    backgroundImage: `
      radial-gradient(circle at 10% 20%, rgba(124,58,237,0.07) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(236,72,153,0.07) 0%, transparent 40%)
    `,
    padding: '28px',
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    animation: 'fadeIn 0.5s ease-out',
  },
  header: {
    background: theme.gradientMain,
    borderRadius: '24px',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    boxShadow: '0 8px 32px rgba(124,58,237,0.3)',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoBox: {
    width: '56px',
    height: '56px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    border: '1.5px solid rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    animation: 'petBounce 2.5s ease-in-out infinite',
    cursor: 'default',
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.75)',
    marginTop: '2px',
  },
  newBtn: {
    background: '#FFFFFF',
    color: theme.purple,
    border: 'none',
    padding: '11px 22px',
    borderRadius: '14px',
    fontWeight: '800',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    letterSpacing: '0.2px',
  },
  tabsBar: {
    display: 'flex',
    gap: '6px',
    padding: '6px',
    background: theme.card,
    borderRadius: '18px',
    border: `1px solid ${theme.border}`,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },
  tab: {
    flex: '1',
    minWidth: '100px',
    padding: '11px 18px',
    borderRadius: '13px',
    border: 'none',
    background: 'transparent',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    color: theme.muted,
    transition: 'all 0.25s ease',
  },
  tabActive: {
    background: theme.gradientMain,
    color: '#FFFFFF',
    boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
  },
  emptyModule: {
    textAlign: 'center',
    padding: '72px 40px',
    background: theme.card,
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: `1px solid ${theme.border}`,
    fontSize: '18px',
    color: theme.muted,
    fontWeight: '600',
  },
};

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes petBounce {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-6px); }
    }
    .ps-tab-hover:hover {
      background: #EDE9FE !important;
      color: #7C3AED !important;
    }
    .ps-new-btn:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
    }
  `}</style>
);

function Dashboard() {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const tabs = [
    { id: 'usuarios',  label: 'Usuarios',   icon: '👥', roles: ['admin'] },
    { id: 'citas',     label: 'Citas',       icon: '📅', roles: ['admin', 'groomer', 'recepcion'] },
    { id: 'logs',      label: 'Auditoría',   icon: '📋', roles: ['admin'] },
    { id: 'perfil',    label: 'Mi Perfil',   icon: '👤', roles: ['admin', 'groomer', 'recepcion', 'cliente'] },
  ];

  const availableTabs = tabs.filter(t => t.roles.includes(user.rol));

  const handleStaffCreated = () => setRefreshKey(prev => prev + 1);

  const renderTab = () => {
    switch (activeTab) {
      case 'usuarios': return <UsuariosTab key={refreshKey} />;
      case 'logs':     return <LogsTab />;
      default:
        return (
          <div style={styles.emptyModule}>
            🚧 Módulo en desarrollo
          </div>
        );
    }
  };

  return (
    <>
      <GlobalStyle />
      <div style={styles.page}>
        <div style={styles.container}>

          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.logoBox}>🐾</div>
              <div>
                <div style={styles.title}>Pet Spa Pro</div>
                <div style={styles.subtitle}>Sistema de Gestión Integral</div>
              </div>
            </div>
            {user.rol === 'admin' && (
              <button
                className="ps-new-btn"
                style={styles.newBtn}
                onClick={() => setShowCreateModal(true)}
              >
                ✨ Nuevo Personal
              </button>
            )}
          </div>

          {/* TABS */}
          <div style={styles.tabsBar}>
            {availableTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={activeTab !== tab.id ? 'ps-tab-hover' : ''}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.tabActive : {}),
                }}
              >
                <span style={{ fontSize: '17px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          {renderTab()}

        </div>
      </div>

      {showCreateModal && (
        <CreateStaffModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleStaffCreated}
        />
      )}
    </>
  );
}

export default Dashboard;
