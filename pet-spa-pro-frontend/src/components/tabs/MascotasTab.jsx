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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: { color: '#81c784', fontSize: '24px', fontWeight: 'bold' },
  addBtn: {
    background: 'linear-gradient(135deg, #81c784, #4caf50)',
    border: 'none',
    color: '#0a0a0a',
    padding: '10px 20px',
    borderRadius: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  petIcon: {
    fontSize: '36px',
    marginBottom: '12px',
  },
  petName: { color: '#e0e0e0', fontSize: '18px', fontWeight: 'bold' },
  petInfo: { color: '#aaa', fontSize: '14px', marginTop: '4px' },
  deleteBtn: {
    background: 'transparent',
    border: '1px solid #d32f2f',
    color: '#d32f2f',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '12px',
  },
  formOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  formCard: {
    background: '#1a1a1a',
    borderRadius: '16px',
    padding: '32px',
    width: '90%',
    maxWidth: '400px',
    border: '1px solid #333',
  },
  input: {
    width: '100%',
    padding: '10px',
    background: '#222',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#e0e0e0',
    marginBottom: '16px',
  },
};

function MascotasTab() {
  const [mascotas, setMascotas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', especie: 'perro', raza: '', edad: '', peso: '', observaciones: '' });
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchMascotas = async () => {
    try {
      const res = await api.get('/mascotas');
      setMascotas(res.data);
    } catch (err) {
      console.error('Error al obtener mascotas', err);
    }
  };

  useEffect(() => { fetchMascotas(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/mascotas', form);
      setShowForm(false);
      setForm({ nombre: '', especie: 'perro', raza: '', edad: '', peso: '', observaciones: '' });
      fetchMascotas();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear mascota');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta mascota?')) return;
    try {
      await api.delete(`/mascotas/${id}`);
      fetchMascotas();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🐾 Mis Mascotas</h2>
        <button style={styles.addBtn} onClick={() => setShowForm(true)}>
          + Nueva Mascota
        </button>
      </div>

      <div style={styles.grid}>
        {mascotas.map(m => (
          <div key={m.id} style={styles.card}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            <div style={styles.petIcon}>{m.especie === 'perro' ? '🐕' : m.especie === 'gato' ? '🐈' : '🐾'}</div>
            <div style={styles.petName}>{m.nombre}</div>
            <div style={styles.petInfo}>
              {m.raza && `${m.raza} • `}{m.edad ? `${m.edad} años` : 'Edad no especificada'} • {m.peso ? `${m.peso}kg` : 'Peso N/D'}
            </div>
            <div style={styles.petInfo}>{m.observaciones || 'Sin observaciones'}</div>
            {user.rol === 'cliente' && (
              <button style={styles.deleteBtn} onClick={() => handleDelete(m.id)}>Eliminar</button>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div style={styles.formOverlay} onClick={() => setShowForm(false)}>
          <div style={styles.formCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#81c784' }}>Nueva Mascota</h3>
            {error && <div style={{ color: '#ef9a9a', marginBottom: '12px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <input style={styles.input} placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
              <select style={styles.input} value={form.especie} onChange={e => setForm({...form, especie: e.target.value})}>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
                <option value="otro">Otro</option>
              </select>
              <input style={styles.input} placeholder="Raza" value={form.raza} onChange={e => setForm({...form, raza: e.target.value})} />
              <input style={styles.input} type="number" placeholder="Edad (años)" value={form.edad} onChange={e => setForm({...form, edad: e.target.value})} />
              <input style={styles.input} type="number" step="0.1" placeholder="Peso (kg)" value={form.peso} onChange={e => setForm({...form, peso: e.target.value})} />
              <textarea style={styles.input} placeholder="Observaciones" value={form.observaciones} onChange={e => setForm({...form, observaciones: e.target.value})} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" style={{ ...styles.addBtn, background: '#444' }} onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" style={styles.addBtn}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MascotasTab;