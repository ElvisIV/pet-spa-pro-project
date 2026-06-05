import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

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
  addBtn: {
    background: 'linear-gradient(135deg, #81c784, #4caf50)',
    border: 'none', color: '#0a0a0a', padding: '10px 20px', borderRadius: '10px',
    fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '1px solid #333', color: '#81c784' },
  td: { padding: '12px', borderBottom: '1px solid #222', color: '#e0e0e0' },
  badge: {
    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
  },
  actionBtn: { padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalCard: { background: '#1a1a1a', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '450px', border: '1px solid #333' },
  input: { width: '100%', padding: '10px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', marginBottom: '16px' },
};

function BloqueosTab() {
  const [bloqueos, setBloqueos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fecha: '', hora_inicio: '', hora_fin: '', motivo: '', aplica_todo_dia: false,
  });
  const [error, setError] = useState('');

  const fetchBloqueos = async () => {
    try {
      const res = await api.get('/bloqueos');
      setBloqueos(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchBloqueos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/bloqueos', form);
      setShowForm(false);
      setForm({ fecha: '', hora_inicio: '', hora_fin: '', motivo: '', aplica_todo_dia: false });
      fetchBloqueos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear bloqueo');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar bloqueo?')) return;
    try { await api.delete(`/bloqueos/${id}`); fetchBloqueos(); } catch (err) { alert('Error al eliminar'); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🚫 Bloqueos de Agenda</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>+ Nuevo Bloqueo</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Fecha</th>
            <th style={styles.th}>Horario</th>
            <th style={styles.th}>Motivo</th>
            <th style={styles.th}>Tipo</th>
            <th style={styles.th}>Creado por</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {bloqueos.map(b => (
            <tr key={b.id}>
              <td style={styles.td}>{b.fecha}</td>
              <td style={styles.td}>
                {b.aplica_todo_dia ? 'Todo el día' : `${b.hora_inicio || ''} - ${b.hora_fin || ''}`}
              </td>
              <td style={styles.td}>{b.motivo}</td>
              <td style={styles.td}>
                <span style={{
                  ...styles.badge,
                  backgroundColor: b.aplica_todo_dia ? '#b71c1c' : '#e65100',
                  color: '#fff',
                }}>
                  {b.aplica_todo_dia ? 'Día completo' : 'Parcial'}
                </span>
              </td>
              <td style={styles.td}>{b.creado_por?.name || '—'}</td>
              <td style={styles.td}>
                <button
                  style={{...styles.actionBtn, background: '#b71c1c', color: '#fff'}}
                  onClick={() => handleDelete(b.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#81c784', marginBottom: '20px' }}>Nuevo Bloqueo</h3>
            {error && <div style={{ color: '#ef9a9a', marginBottom: '12px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <input
                style={styles.input}
                type="date"
                value={form.fecha}
                onChange={e => setForm({...form, fecha: e.target.value})}
                required
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', marginBottom: '16px' }}>
                <input
                  type="checkbox"
                  checked={form.aplica_todo_dia}
                  onChange={e => setForm({...form, aplica_todo_dia: e.target.checked})}
                />
                ¿Todo el día?
              </label>
              {!form.aplica_todo_dia && (
                <>
                  <input
                    style={styles.input}
                    type="time"
                    value={form.hora_inicio}
                    onChange={e => setForm({...form, hora_inicio: e.target.value})}
                  />
                  <input
                    style={styles.input}
                    type="time"
                    value={form.hora_fin}
                    onChange={e => setForm({...form, hora_fin: e.target.value})}
                  />
                </>
              )}
              <input
                style={styles.input}
                placeholder="Motivo del bloqueo"
                value={form.motivo}
                onChange={e => setForm({...form, motivo: e.target.value})}
                required
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" style={{...styles.actionBtn, background: '#444', color: '#fff'}} onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" style={{...styles.actionBtn, background: '#81c784', color: '#000'}}>Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BloqueosTab;