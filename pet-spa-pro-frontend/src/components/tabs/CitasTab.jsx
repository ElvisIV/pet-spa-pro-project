import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import CitaDetalleModal from './CitaDetalleModal';
import CitaAtencionModal from './CitaAtencionModal'; // Lo crearemos después
import CrearCitaModal from './CrearCitaModal';
const user = JSON.parse(localStorage.getItem('user') || '{}');

const styles = {
  container: {
    background: 'rgba(26,26,26,0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '24px',
    animation: 'fadeIn 0.5s ease-out',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { color: '#81c784', fontSize: '24px', fontWeight: 'bold' },
  subtabs: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  subtab: (active) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    background: active ? '#81c784' : '#222',
    color: active ? '#000' : '#aaa',
    fontWeight: '600',
  }),
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '1px solid #333', color: '#81c784' },
  td: { padding: '12px', borderBottom: '1px solid #222', color: '#e0e0e0' },
  badge: (estado) => ({
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
    backgroundColor: estado === 'pendiente' ? '#e65100' : estado === 'confirmada' ? '#1565c0' : estado === 'en_proceso' ? '#6a1b9a' : estado === 'completada' ? '#2e7d32' : '#b71c1c',
    color: '#fff', display: 'inline-block',
  }),
  actionBtn: { padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', marginRight: '6px' },
};

function CitasTab() {
  const [activeSubtab, setActiveSubtab] = useState(
    user.rol === 'cliente' ? 'historial' : user.rol === 'groomer' ? 'agenda' : 'pendientes'
  );
  const [citas, setCitas] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null); // Para modal de detalle (admin/recepción)
  const [citaAtencion, setCitaAtencion] = useState(null); // Para modal de atención (groomer)
  const [fechaFiltro, setFechaFiltro] = useState('');
const [showCrearCita, setShowCrearCita] = useState(false);
  const fetchCitas = async (estado) => {
    try {
      const params = {};
      if (fechaFiltro) params.fecha = fechaFiltro;
      if (estado && estado !== 'todas') params.estado = estado;
      const res = await api.get('/citas', { params });
      setCitas(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user.rol === 'cliente') {
      fetchCitas(); // Trae todas las del cliente
    } else if (user.rol === 'groomer') {
      // Trae solo las del groomer actual (el backend ya filtra si es groomer)
      fetchCitas();
    } else {
      // Admin/Recepción: según subpestaña
      if (activeSubtab === 'pendientes') fetchCitas('pendiente');
      else if (activeSubtab === 'confirmadas') fetchCitas('confirmada');
      else if (activeSubtab === 'en_proceso') fetchCitas('en_proceso');
      else if (activeSubtab === 'completadas') fetchCitas('completada');
      else fetchCitas(); // todas
    }
  }, [activeSubtab, fechaFiltro]);

  const handleCambiarEstado = async (citaId, nuevoEstado) => {
    try {
      await api.put(`/citas/${citaId}`, { estado: nuevoEstado });
      fetchCitas();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const accionesRapidas = (cita) => {
    // Acciones visibles en la tabla según rol y estado
    if (user.rol === 'admin' || user.rol === 'recepcion') {
      if (cita.estado === 'pendiente') return (
        <>
          <button style={{...styles.actionBtn, background: '#1565c0', color: '#fff'}} onClick={() => setSelectedCita(cita)}>Asignar</button>
          <button style={{...styles.actionBtn, background: '#b71c1c', color: '#fff'}} onClick={() => handleCambiarEstado(cita.id, 'cancelada')}>Cancelar</button>
        </>
      );
      if (cita.estado === 'confirmada') return (
        <button style={{...styles.actionBtn, background: '#6a1b9a', color: '#fff'}} onClick={() => handleCambiarEstado(cita.id, 'en_proceso')}>Iniciar</button>
      );
    }
    if (user.rol === 'groomer') {
      if (cita.estado === 'confirmada') return (
        <button style={{...styles.actionBtn, background: '#6a1b9a', color: '#fff'}} onClick={() => handleCambiarEstado(cita.id, 'en_proceso')}>Iniciar</button>
      );
      if (cita.estado === 'en_proceso') return (
        <button style={{...styles.actionBtn, background: '#2e7d32', color: '#fff'}} onClick={() => setCitaAtencion(cita)}>Atender</button>
      );
    }
    return null;
  };

  const subtabsPorRol = () => {
    if (user.rol === 'cliente') return [
      { id: 'historial', label: 'Mis Citas' },
    ];
    if (user.rol === 'groomer') return [
      { id: 'agenda', label: 'Mi Agenda' },
      { id: 'en_proceso', label: 'En Atención' },
      { id: 'completadas', label: 'Historial' },
    ];
    return [
      { id: 'pendientes', label: 'Pendientes' },
      { id: 'confirmadas', label: 'Confirmadas' },
      { id: 'en_proceso', label: 'En Proceso' },
      { id: 'completadas', label: 'Completadas' },
      { id: 'todas', label: 'Todas' },
    ];
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📅 Citas</h2>
        {user.rol === 'cliente' && (
          <button style={{...styles.actionBtn, background: '#81c784', color: '#000'}} onClick={() => setShowCrearCita(true)}>
            Nueva Cita
          </button>        )}
        {!['cliente', 'groomer'].includes(user.rol) && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="date"
              value={fechaFiltro}
              onChange={e => setFechaFiltro(e.target.value)}
              style={{ padding: '6px', background: '#222', border: '1px solid #333', borderRadius: '6px', color: '#fff' }}
            />
            <button style={{...styles.actionBtn, background: '#81c784', color: '#000'}} onClick={() => setSelectedCita('nueva')}>Nueva Cita</button>
          </div>
        )}
      </div>

      <div style={styles.subtabs}>
        {subtabsPorRol().map(tab => (
          <button
            key={tab.id}
            style={styles.subtab(activeSubtab === tab.id)}
            onClick={() => setActiveSubtab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Mascota</th>
            <th style={styles.th}>Dueño</th>
            <th style={styles.th}>Fecha/Hora</th>
            <th style={styles.th}>Servicios</th>
            <th style={styles.th}>Groomer</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map(c => (
            <tr key={c.id} style={{ cursor: user.rol !== 'cliente' ? 'pointer' : 'default' }}
                onClick={() => { if (user.rol !== 'cliente' && !['pendiente'].includes(c.estado)) setSelectedCita(c); }}>
              <td style={styles.td}>{c.mascota?.nombre || '—'}</td>
              <td style={styles.td}>{c.cliente?.name || '—'}</td>
              <td style={styles.td}>{c.fecha} {c.hora}</td>
              <td style={styles.td}>{c.servicios?.map(s => s.nombre).join(', ') || c.servicio}</td>
              <td style={styles.td}>{c.groomer?.name || 'Sin asignar'}</td>
              <td style={styles.td}><span style={styles.badge(c.estado)}>{c.estado}</span></td>
              <td style={styles.td}>{accionesRapidas(c)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de detalle (admin/recepción/groomer) */}
      {selectedCita && selectedCita !== 'nueva' && (
        <CitaDetalleModal
          cita={selectedCita}
          onClose={() => { setSelectedCita(null); fetchCitas(); }}
        />
      )}

      {/* Modal de atención (groomer) */}
      {citaAtencion && (
        <CitaAtencionModal
          cita={citaAtencion}
          onClose={() => { setCitaAtencion(null); fetchCitas(); }}
        />
      )}

      {showCrearCita && (
        <CrearCitaModal
          onClose={() => setShowCrearCita(false)}
          onCreated={() => { fetchCitas(); }}
        />
      )}    </div>
  );
}

export default CitasTab;