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
    fontWeight: 'bold', cursor: 'pointer',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '1px solid #333', color: '#81c784' },
  td: { padding: '12px', borderBottom: '1px solid #222', color: '#e0e0e0' },
  actionBtn: { padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', marginRight: '6px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalCard: { background: '#1a1a1a', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '400px', border: '1px solid #333' },
  input: { width: '100%', padding: '10px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', marginBottom: '16px' },
};

const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

function HorariosTab() {
  const [horarios, setHorarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ dia: 'lunes', hora_inicio: '09:00', hora_fin: '18:00', activo: true });
  const [error, setError] = useState('');

  const fetchHorarios = async () => {
    try {
      const res = await api.get('/horarios');
      setHorarios(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchHorarios(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ dia: 'lunes', hora_inicio: '09:00', hora_fin: '18:00', activo: true });
    setError('');
    setShowModal(true);
  };

  const openEdit = (h) => {
    setEditingId(h.id);
    setForm({ dia: h.dia, hora_inicio: h.hora_inicio, hora_fin: h.hora_fin, activo: h.activo });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      dia: form.dia,
      hora_inicio: form.hora_inicio,
      hora_fin: form.hora_fin,
      activo: form.activo,
    };

    try {
      if (editingId) {
        await api.put(`/horarios/${editingId}`, payload);
      } else {
        await api.post('/horarios', payload);
      }
      setShowModal(false);
      fetchHorarios();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este horario?')) return;
    try { await api.delete(`/horarios/${id}`); fetchHorarios(); } catch (err) { alert('Error al eliminar'); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🕒 Horarios de Atención</h2>
        <button style={styles.addBtn} onClick={openCreate}>+ Agregar Horario</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Día</th>
            <th style={styles.th}>Inicio</th>
            <th style={styles.th}>Fin</th>
            <th style={styles.th}>Activo</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {horarios.map(h => (
            <tr key={h.id}>
              <td style={{...styles.td, textTransform: 'capitalize'}}>{h.dia}</td>
              <td style={styles.td}>{h.hora_inicio}</td>
              <td style={styles.td}>{h.hora_fin}</td>
              <td style={styles.td}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: h.activo ? '#2e7d32' : '#b71c1c',
                  color: '#fff',
                }}>
                  {h.activo ? 'Sí' : 'No'}
                </span>
              </td>
              <td style={styles.td}>
                <button style={{...styles.actionBtn, background: '#1565c0', color: '#fff'}} onClick={() => openEdit(h)}>Editar</button>
                <button style={{...styles.actionBtn, background: '#b71c1c', color: '#fff'}} onClick={() => handleDelete(h.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#81c784', marginBottom: '20px' }}>{editingId ? 'Editar Horario' : 'Nuevo Horario'}</h3>
            {error && <div style={{ color: '#ef9a9a', marginBottom: '12px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <select style={styles.input} value={form.dia} onChange={e => setForm({...form, dia: e.target.value})}>
                {diasSemana.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input style={styles.input} type="time" value={form.hora_inicio} onChange={e => setForm({...form, hora_inicio: e.target.value})} required />
              <input style={styles.input} type="time" value={form.hora_fin} onChange={e => setForm({...form, hora_fin: e.target.value})} required />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', marginBottom: '16px' }}>
                <input type="checkbox" checked={form.activo} onChange={e => setForm({...form, activo: e.target.checked})} />
                Activo
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" style={{...styles.actionBtn, background: '#444', color: '#fff'}} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" style={{...styles.actionBtn, background: '#81c784', color: '#000'}}>{editingId ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HorariosTab;