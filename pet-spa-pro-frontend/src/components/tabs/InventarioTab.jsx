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
  lowStock: { color: '#ffb74d', fontWeight: 'bold' },
  actionBtn: { padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', marginRight: '6px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalCard: { background: '#1a1a1a', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '500px', border: '1px solid #333' },
  input: { width: '100%', padding: '10px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', marginBottom: '16px' },
};

function InventarioTab() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ nombre: '', unidad: '', cantidad_disponible: '', cantidad_minima: '', precio_unitario: '' });
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchItems = async () => {
    try {
      const res = await api.get('/inventario');
      setItems(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ nombre: '', unidad: '', cantidad_disponible: '', cantidad_minima: '', precio_unitario: '' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      nombre: item.nombre,
      unidad: item.unidad,
      cantidad_disponible: item.cantidad_disponible,
      cantidad_minima: item.cantidad_minima,
      precio_unitario: item.precio_unitario || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      nombre: form.nombre,
      unidad: form.unidad,
      cantidad_disponible: parseFloat(form.cantidad_disponible),
      cantidad_minima: parseFloat(form.cantidad_minima),
      precio_unitario: form.precio_unitario ? parseFloat(form.precio_unitario) : null,
    };

    try {
      if (editingId) {
        await api.put(`/inventario/${editingId}`, payload);
      } else {
        await api.post('/inventario', payload);
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este insumo?')) return;
    try { await api.delete(`/inventario/${id}`); fetchItems(); } catch (err) { alert('Error al eliminar'); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📦 Inventario</h2>
        {user.rol === 'admin' && <button style={styles.addBtn} onClick={openCreate}>+ Nuevo Insumo</button>}
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Unidad</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Mínimo</th>
            <th style={styles.th}>Precio unit.</th>
            {user.rol === 'admin' && <th style={styles.th}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td style={styles.td}>{item.nombre}</td>
              <td style={styles.td}>{item.unidad}</td>
              <td style={{
                ...styles.td,
                ...(item.cantidad_disponible <= item.cantidad_minima ? styles.lowStock : {}),
              }}>
                {item.cantidad_disponible}
              </td>
              <td style={styles.td}>{item.cantidad_minima}</td>
              <td style={styles.td}>${item.precio_unitario ? parseFloat(item.precio_unitario).toFixed(2) : '—'}</td>
              {user.rol === 'admin' && (
                <td style={styles.td}>
                  <button style={{...styles.actionBtn, background: '#1565c0', color: '#fff'}} onClick={() => openEdit(item)}>Editar</button>
                  <button style={{...styles.actionBtn, background: '#b71c1c', color: '#fff'}} onClick={() => handleDelete(item.id)}>Eliminar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#81c784', marginBottom: '20px' }}>{editingId ? 'Editar Insumo' : 'Nuevo Insumo'}</h3>
            {error && <div style={{ color: '#ef9a9a', marginBottom: '12px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <input style={styles.input} placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
              <input style={styles.input} placeholder="Unidad (ml, g, unidades)" value={form.unidad} onChange={e => setForm({...form, unidad: e.target.value})} required />
              <input style={styles.input} type="number" step="0.01" placeholder="Cantidad disponible" value={form.cantidad_disponible} onChange={e => setForm({...form, cantidad_disponible: e.target.value})} required />
              <input style={styles.input} type="number" step="0.01" placeholder="Cantidad mínima" value={form.cantidad_minima} onChange={e => setForm({...form, cantidad_minima: e.target.value})} required />
              <input style={styles.input} type="number" step="0.01" placeholder="Precio unitario (opcional)" value={form.precio_unitario} onChange={e => setForm({...form, precio_unitario: e.target.value})} />
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

export default InventarioTab;