import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 3000,
  },
  modal: {
    background: '#1a1a1a', borderRadius: '20px', padding: '32px',
    width: '95%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
    border: '1px solid #333', boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
  },
  title: { color: '#81c784', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
  input: { padding: '8px 12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', fontSize: '14px', width: '100%', marginBottom: '12px' },
  select: { padding: '8px 12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', fontSize: '14px', width: '100%', marginBottom: '12px' },
  btn: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', marginRight: '8px', marginTop: '8px' },
  error: { color: '#ef9a9a', marginBottom: '12px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', marginBottom: '8px' },
};

function CrearCitaModal({ onClose, onCreated }) {
  const [mascotas, setMascotas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [groomers, setGroomers] = useState([]);
  const [form, setForm] = useState({
    mascota_id: '',
    fecha: '',
    hora: '',
    staff_id: '',
    serviciosSeleccionados: [],
    notas: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener mascotas según rol
        const mascotasRes = await api.get('/mascotas');
        setMascotas(mascotasRes.data);

        // Obtener servicios
        const serviciosRes = await api.get('/servicios');
        setServicios(serviciosRes.data);

        // Obtener groomers (para admin/recepción)
        if (user.rol !== 'cliente') {
          const usersRes = await api.get('/users');
          setGroomers(usersRes.data.filter(u => u.rol === 'groomer'));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const toggleServicio = (id) => {
    setForm(prev => ({
      ...prev,
      serviciosSeleccionados: prev.serviciosSeleccionados.includes(id)
        ? prev.serviciosSeleccionados.filter(s => s !== id)
        : [...prev.serviciosSeleccionados, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.mascota_id || !form.fecha || !form.hora || form.serviciosSeleccionados.length === 0) {
      setError('Complete todos los campos obligatorios');
      return;
    }
    setLoading(true);
    try {
      await api.post('/citas', {
        mascota_id: form.mascota_id,
        fecha: form.fecha,
        hora: form.hora,
        staff_id: form.staff_id || null,
        servicios: form.serviciosSeleccionados.map(id => ({ id })),
        notas: form.notas,
      });
      onCreated && onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.title}>📅 Nueva Cita</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <select
            style={styles.select}
            value={form.mascota_id}
            onChange={e => setForm({...form, mascota_id: e.target.value})}
            required
          >
            <option value="">Selecciona mascota</option>
            {mascotas.map(m => (
              <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>
            ))}
          </select>
          <input
            type="date"
            style={styles.input}
            value={form.fecha}
            onChange={e => setForm({...form, fecha: e.target.value})}
            required
          />
          <input
            type="time"
            style={styles.input}
            value={form.hora}
            onChange={e => setForm({...form, hora: e.target.value})}
            required
          />
          {(user.rol !== 'cliente') && (
            <select
              style={styles.select}
              value={form.staff_id}
              onChange={e => setForm({...form, staff_id: e.target.value})}
            >
              <option value="">Sin preferencia de groomer</option>
              {groomers.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          )}
          <div style={{ marginBottom: '12px' }}>
            <p style={{ color: '#aaa', marginBottom: '8px' }}>Servicios:</p>
            {servicios.map(s => (
              <label key={s.id} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.serviciosSeleccionados.includes(s.id)}
                  onChange={() => toggleServicio(s.id)}
                  style={{ accentColor: '#81c784' }}
                />
                {s.nombre} - ${s.precio} ({s.duracion} min)
              </label>
            ))}
          </div>
          <textarea
            style={styles.input}
            placeholder="Notas adicionales"
            value={form.notas}
            onChange={e => setForm({...form, notas: e.target.value})}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" style={{...styles.btn, background: '#444', color: '#fff'}} onClick={onClose}>Cancelar</button>
            <button type="submit" style={{...styles.btn, background: '#81c784', color: '#000'}} disabled={loading}>
              {loading ? 'Creando...' : 'Crear Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearCitaModal;