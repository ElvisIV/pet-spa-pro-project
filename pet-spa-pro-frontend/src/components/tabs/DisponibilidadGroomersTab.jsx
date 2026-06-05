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
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '24px' },
  title: { color: '#81c784', fontSize: '24px', fontWeight: 'bold' },
  addBtn: {
    background: 'linear-gradient(135deg, #81c784, #4caf50)',
    border: 'none', color: '#0a0a0a', padding: '10px 20px', borderRadius: '10px',
    fontWeight: 'bold', cursor: 'pointer',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '1px solid #333', color: '#81c784' },
  td: { padding: '12px', borderBottom: '1px solid #222', color: '#e0e0e0' },
  actionBtn: { padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalCard: { background: '#1a1a1a', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '450px', border: '1px solid #333' },
  input: { width: '100%', padding: '10px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', marginBottom: '16px' },
};

const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

function DisponibilidadGroomersTab() {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [groomers, setGroomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ user_id: '', dia: 'lunes', hora_inicio: '09:00', hora_fin: '18:00' });

  const fetchDisponibilidades = async () => {
    const res = await api.get('/disponibilidad-groomers');
    setDisponibilidades(res.data);
  };

  const fetchGroomers = async () => {
    const res = await api.get('/users');
    setGroomers(res.data.filter(u => u.rol === 'groomer'));
  };

  useEffect(() => { fetchDisponibilidades(); fetchGroomers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/disponibilidad-groomers', form);
      setShowForm(false);
      setForm({ user_id: '', dia: 'lunes', hora_inicio: '09:00', hora_fin: '18:00' });
      fetchDisponibilidades();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar disponibilidad?')) return;
    await api.delete(`/disponibilidad-groomers/${id}`);
    fetchDisponibilidades();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🗓️ Disponibilidad de Groomers</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>+ Asignar Horario</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Groomer</th>
            <th style={styles.th}>Día</th>
            <th style={styles.th}>Horario</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {disponibilidades.map(d => (
            <tr key={d.id}>
              <td style={styles.td}>{d.groomer?.name}</td>
              <td style={styles.td} style={{ textTransform: 'capitalize' }}>{d.dia}</td>
              <td style={styles.td}>{d.hora_inicio} - {d.hora_fin}</td>
              <td style={styles.td}>
                <button
                  style={{...styles.actionBtn, background: '#b71c1c', color: '#fff'}}
                  onClick={() => handleDelete(d.id)}
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
            <h3 style={{ color: '#81c784' }}>Asignar Disponibilidad</h3>
            <form onSubmit={handleSubmit}>
              <select
                style={styles.input}
                value={form.user_id}
                onChange={e => setForm({...form, user_id: e.target.value})}
                required
              >
                <option value="">Selecciona groomer</option>
                {groomers.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <select
                style={styles.input}
                value={form.dia}
                onChange={e => setForm({...form, dia: e.target.value})}
              >
                {dias.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input
                style={styles.input}
                type="time"
                value={form.hora_inicio}
                onChange={e => setForm({...form, hora_inicio: e.target.value})}
                required
              />
              <input
                style={styles.input}
                type="time"
                value={form.hora_fin}
                onChange={e => setForm({...form, hora_fin: e.target.value})}
                required
              />
              <button type="submit" style={{...styles.addBtn, width: '100%'}}>Guardar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisponibilidadGroomersTab;