    import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const theme = {
  gradientMain: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
  purple: '#7C3AED',
  pink: '#EC4899',
  surface: '#FAFAF9',
  card: '#FFFFFF',
  border: 'rgba(0,0,0,0.08)',
  text: '#1C1917',
  muted: '#78716C',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
};

const styles = {
  container: {
    backgroundColor: theme.card,
    borderRadius: '20px',
    padding: '24px',
    border: `1px solid ${theme.border}`,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    animation: 'fadeIn 0.5s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: theme.text,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  addBtn: {
    background: theme.gradientMain,
    color: '#FFF',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
    transition: 'transform 0.2s',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: `1px solid ${theme.border}`,
    fontSize: '13px',
    fontWeight: '700',
    color: theme.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '12px 16px',
    borderBottom: `1px solid ${theme.border}`,
    fontSize: '14px',
    color: theme.text,
  },
  imageCell: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    objectFit: 'cover',
    background: '#F3F4F6',
  },
  badge: (activo) => ({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: activo ? '#D1FAE5' : '#FEE2E2',
    color: activo ? '#065F46' : '#991B1B',
  }),
  actionBtn: {
    padding: '6px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
    marginRight: '6px',
    transition: 'opacity 0.2s',
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 3000,
  },
  modalCard: {
    background: '#FFF',
    borderRadius: '20px',
    padding: '28px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: `1px solid ${theme.border}`,
    fontSize: '14px',
    marginBottom: '14px',
    outline: 'none',
    color: theme.text,
    background: '#FFF',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: `1px solid ${theme.border}`,
    fontSize: '14px',
    marginBottom: '14px',
    outline: 'none',
    color: theme.text,
    background: '#FFF',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: theme.muted,
    marginBottom: '4px',
    display: 'block',
  },
};

function ProductosAdminTab() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    categoria_id: '',
    precio: '',
    precio_promocional: '',
    stock: '',
    stock_minimo: '5',
    variante: '',
    activo: true,
  });
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await api.get('/categorias'); // Necesitamos endpoint de categorías
      setCategorias(res.data);
    } catch (err) {
      console.error('Error al cargar categorías', err);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      nombre: '',
      descripcion: '',
      categoria_id: '',
      precio: '',
      precio_promocional: '',
      stock: '',
      stock_minimo: '5',
      variante: '',
      activo: true,
    });
    setImagen(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (producto) => {
    setEditingId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria_id: producto.categoria_id,
      precio: producto.precio,
      precio_promocional: producto.precio_promocional || '',
      stock: producto.stock,
      stock_minimo: producto.stock_minimo || 5,
      variante: producto.variante || '',
      activo: producto.activo,
    });
    setImagen(null);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.categoria_id || !form.precio || !form.stock) {
      setError('Completa los campos obligatorios');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (imagen) {
        formData.append('imagen', imagen);
      }

      if (editingId) {
        // Necesitamos enviar como POST con _method=PUT porque Laravel no acepta PUT con FormData fácilmente
        formData.append('_method', 'PUT');
        await api.post(`/productos/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/productos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setShowModal(false);
      fetchProductos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      fetchProductos();
    } catch (err) {
      alert('Error al eliminar producto');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🛍️ Gestión de Productos</h2>
        <button style={styles.addBtn} onClick={openCreate}>
          + Nuevo Producto
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Imagen</th>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Categoría</th>
            <th style={styles.th}>Precio</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td style={styles.td}>
                {p.imagen_url ? (
                  <img src={p.imagen_url} alt={p.nombre} style={styles.imageCell} />
                ) : (
                  <div style={{...styles.imageCell, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>📷</div>
                )}
              </td>
              <td style={styles.td}>{p.nombre}</td>
              <td style={styles.td}>{p.categoria?.nombre || 'Sin categoría'}</td>
              <td style={styles.td}>
                {p.precio_promocional ? (
                  <>
                    <span style={{ textDecoration: 'line-through', color: theme.muted, marginRight: '8px' }}>${p.precio}</span>
                    <span style={{ fontWeight: '700', color: theme.pink }}>${p.precio_promocional}</span>
                  </>
                ) : (
                  `$${p.precio}`
                )}
              </td>
              <td style={styles.td}>{p.stock}</td>
              <td style={styles.td}><span style={styles.badge(p.activo)}>{p.activo ? 'Activo' : 'Inactivo'}</span></td>
              <td style={styles.td}>
                <button style={{...styles.actionBtn, background: '#EDE9FE', color: theme.purple}}
                  onClick={() => openEdit(p)}>Editar</button>
                <button style={{...styles.actionBtn, background: '#FEE2E2', color: theme.danger}}
                  onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: theme.purple, marginBottom: '20px' }}>
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Nombre *</label>
              <input style={styles.input} value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />

              <label style={styles.label}>Descripción</label>
              <textarea style={styles.input} rows={3} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />

              <label style={styles.label}>Categoría *</label>
              <select style={styles.select} value={form.categoria_id} onChange={e => setForm({...form, categoria_id: e.target.value})} required>
                <option value="">Selecciona</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Precio *</label>
                  <input style={styles.input} type="number" step="0.01" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Precio promo.</label>
                  <input style={styles.input} type="number" step="0.01" value={form.precio_promocional} onChange={e => setForm({...form, precio_promocional: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Stock *</label>
                  <input style={styles.input} type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Stock mínimo</label>
                  <input style={styles.input} type="number" value={form.stock_minimo} onChange={e => setForm({...form, stock_minimo: e.target.value})} />
                </div>
              </div>

              <label style={styles.label}>Variante</label>
              <input style={styles.input} placeholder="Ej: Grande, Premium" value={form.variante} onChange={e => setForm({...form, variante: e.target.value})} />

              <label style={styles.label}>Imagen</label>
              <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} style={{ marginBottom: '14px' }} />

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <input type="checkbox" checked={form.activo} onChange={e => setForm({...form, activo: e.target.checked})} />
                Producto activo
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" style={{...styles.actionBtn, background: '#F3F4F6', color: theme.text}} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" style={{...styles.addBtn, margin: 0}} disabled={loading}>
                  {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductosAdminTab;