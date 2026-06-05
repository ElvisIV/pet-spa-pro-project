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
  modalCard: { background: '#1a1a1a', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px', border: '1px solid #333' },
  input: { width: '100%', padding: '10px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', marginBottom: '16px' },
};

function ServiciosTab() {
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = crear, number = editar
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', duracion: '', categoria: '' });
  const [error, setError] = useState('');

  const fetchServicios = async () => {
    try {
      const res = await api.get('/servicios');
      setServicios(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchServicios(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ nombre: '', descripcion: '', precio: '', duracion: '', categoria: '' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (servicio) => {
    setEditingId(servicio.id);
    setForm({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      precio: servicio.precio,
      duracion: servicio.duracion,
      categoria: servicio.categoria || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      duracion: parseInt(form.duracion),
      categoria: form.categoria,
      activo: true,
    };

    try {
      if (editingId) {
        await api.put(`/servicios/${editingId}`, payload);
      } else {
        await api.post('/servicios', payload);
      }
      setShowModal(false);
      fetchServicios();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar servicio');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    try { await api.delete(`/servicios/${id}`); fetchServicios(); } catch (err) { alert('Error al eliminar'); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🛠️ Catálogo de Servicios</h2>
        <button style={styles.addBtn} onClick={openCreate}>+ Nuevo Servicio</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Categoría</th>
            <th style={styles.th}>Precio</th>
            <th style={styles.th}>Duración</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(s => (
            <tr key={s.id}>
              <td style={styles.td}>{s.nombre}</td>
              <td style={styles.td}>{s.categoria || '—'}</td>
              <td style={styles.td}>${parseFloat(s.precio).toFixed(2)}</td>
              <td style={styles.td}>{s.duracion} min</td>
              <td style={styles.td}>
                <button style={{...styles.actionBtn, background: '#1565c0', color: '#fff'}} onClick={() => openEdit(s)}>Editar</button>
                <button style={{...styles.actionBtn, background: '#b71c1c', color: '#fff'}} onClick={() => handleDelete(s.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#81c784', marginBottom: '20px' }}>{editingId ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
            {error && <div style={{ color: '#ef9a9a', marginBottom: '12px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <input style={styles.input} placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
              <input style={styles.input} placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
              <input style={styles.input} type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
              <input style={styles.input} type="number" placeholder="Duración (min)" value={form.duracion} onChange={e => setForm({...form, duracion: e.target.value})} required />
              <input style={styles.input} placeholder="Categoría (ej. Baño, Corte)" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} />
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

export default ServiciosTab;