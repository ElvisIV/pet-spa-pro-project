import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 3000,
  },
  modal: {
    background: '#1a1a1a', borderRadius: '20px', padding: '32px',
    width: '95%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
    border: '1px solid #333', boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
  },
  title: { color: '#81c784', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
  section: { marginBottom: '24px' },
  sectionTitle: { color: '#ccc', fontSize: '16px', fontWeight: '600', marginBottom: '12px', borderBottom: '1px solid #333', paddingBottom: '8px' },
  row: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '8px' },
  col: { flex: 1, minWidth: '200px' },
  label: { color: '#888', fontSize: '13px', textTransform: 'uppercase', marginBottom: '4px' },
  value: { color: '#e0e0e0', fontSize: '15px', fontWeight: '500' },
  input: { padding: '8px 12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', fontSize: '14px', width: '100%', marginBottom: '8px' },
  textarea: { padding: '8px 12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', fontSize: '14px', width: '100%', marginBottom: '8px', resize: 'vertical' },
  btn: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', marginRight: '8px', marginTop: '8px' },
  checklistItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '1px solid #222' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer', accentColor: '#81c784' },
  completed: { textDecoration: 'line-through', color: '#666' },
};

function CitaAtencionModal({ cita, onClose }) {
  // Ficha técnica
  const [ficha, setFicha] = useState({
    condicion_piel: '', condicion_pelaje: '', estado_orejas: '',
    estado_ojos: '', estado_dientes: '', observaciones: '',
  });
  const [fichaGuardada, setFichaGuardada] = useState(false);

  // Checklist
  const [checklist, setChecklist] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');

  // Fotos
  const [fotos, setFotos] = useState([]);
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoTipo, setFotoTipo] = useState('antes');

  // Insumos
  const [inventario, setInventario] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [consumoInsumoId, setConsumoInsumoId] = useState('');
  const [consumoCantidad, setConsumoCantidad] = useState('');

  const [error, setError] = useState('');
  const [finalizando, setFinalizando] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Cargar datos existentes al abrir el modal
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener detalles completos de la cita
        const resCita = await api.get(`/citas/${cita.id}`);
        const datos = resCita.data;

        // Ficha técnica
        if (datos.ficha_tecnica) {
          setFicha({
            condicion_piel: datos.ficha_tecnica.condicion_piel || '',
            condicion_pelaje: datos.ficha_tecnica.condicion_pelaje || '',
            estado_orejas: datos.ficha_tecnica.estado_orejas || '',
            estado_ojos: datos.ficha_tecnica.estado_ojos || '',
            estado_dientes: datos.ficha_tecnica.estado_dientes || '',
            observaciones: datos.ficha_tecnica.observaciones || '',
          });
          setFichaGuardada(true);
        }

        // Checklist
        if (datos.checklist) {
          setChecklist(datos.checklist);
        } else {
          // Si no hay checklist aún, cargamos uno por defecto basado en los servicios
          const tareasPredefinidas = [
            'Revisión general de la mascota',
            'Baño',
            'Secado',
            'Cepillado',
            'Corte de uñas',
            'Limpieza de oídos',
          ];
          setChecklist(tareasPredefinidas.map(t => ({ id: null, tarea: t, completada: false })));
        }

        // Fotos
        setFotos(datos.fotos || []);

        // Consumos
        setConsumos(datos.consumos || []);

        // Inventario disponible
        const resInv = await api.get('/inventario');
        setInventario(resInv.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [cita.id]);

  // Guardar ficha técnica
  const handleGuardarFicha = async () => {
    setError('');
    try {
      await api.post('/fichas-tecnicas', { cita_id: cita.id, ...ficha });
      setFichaGuardada(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar ficha');
    }
  };

  // Agregar tarea al checklist
  const handleAgregarTarea = async () => {
    if (!nuevaTarea.trim()) return;
    try {
      const res = await api.post('/checklist', { cita_id: cita.id, tarea: nuevaTarea });
      setChecklist([...checklist, res.data]);
      setNuevaTarea('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al agregar tarea');
    }
  };

  // Marcar/desmarcar tarea
  const toggleTarea = async (tarea) => {
    // Si la tarea ya está en BD, usar el endpoint toggle
    if (tarea.id) {
      try {
        const res = await api.put(`/checklist/${tarea.id}/toggle`);
        setChecklist(checklist.map(t => t.id === tarea.id ? res.data : t));
      } catch (err) {
        setError(err.response?.data?.message || 'Error al actualizar tarea');
      }
    } else {
      // Si es una tarea temporal (aún no guardada en BD), crear primero
      try {
        const res = await api.post('/checklist', { cita_id: cita.id, tarea: tarea.tarea });
        const nueva = { ...res.data, completada: true };
        await api.put(`/checklist/${res.data.id}/toggle`);
        setChecklist(checklist.map(t => t.tarea === tarea.tarea ? { ...nueva, completada: true } : t));
      } catch (err) {
        setError(err.response?.data?.message || 'Error al crear tarea');
      }
    }
  };

  // Eliminar tarea
  const eliminarTarea = async (id) => {
    if (!id) return;
    try {
      await api.delete(`/checklist/${id}`);
      setChecklist(checklist.filter(t => t.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar');
    }
  };

  // Subir foto
  const handleSubirFoto = async () => {
    if (!fotoFile) return;
    const formData = new FormData();
    formData.append('cita_id', cita.id);
    formData.append('imagen', fotoFile);
    formData.append('tipo', fotoTipo);
    try {
      const res = await api.post('/fotos-servicio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFotos([...fotos, res.data]);
      setFotoFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al subir foto');
    }
  };

  // Registrar consumo de insumo
  const handleConsumo = async () => {
    if (!consumoInsumoId || !consumoCantidad) {
      setError('Seleccione insumo y cantidad');
      return;
    }
    try {
      const res = await api.post('/consumo-insumos', {
        cita_id: cita.id,
        inventario_id: parseInt(consumoInsumoId),
        cantidad: parseFloat(consumoCantidad),
      });
      setConsumos([...consumos, res.data]);
      setConsumoInsumoId('');
      setConsumoCantidad('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar consumo');
    }
  };
  

  // Finalizar servicio
 const handleFinalizar = async () => {
  // Validar que la ficha técnica esté guardada
  if (!fichaGuardada) {
    setError('Debes guardar la ficha técnica antes de finalizar el servicio.');
    return;
  }
const puedeCerrar = fichaGuardada && tareasPendientes === 0;

  // Validar que todas las tareas del checklist estén completadas
  const tareasPendientes = checklist.filter(t => !t.completada);
  if (tareasPendientes.length > 0) {
    setError(`Aún hay ${tareasPendientes.length} tarea(s) pendiente(s) en el checklist.`);
    return;
  }

  if (!window.confirm('¿Finalizar el servicio? Se marcará la cita como completada.')) return;
  
  setFinalizando(true);
  setError('');
  try {
    await api.put(`/citas/${cita.id}`, { estado: 'completada' });
    onClose();
  } catch (err) {
    setError(err.response?.data?.message || 'Error al finalizar');
  } finally {
    setFinalizando(false);
  }
};

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.title}>🐾 Atención de {cita.mascota?.nombre || 'Mascota'}</h2>
        {error && <div style={{ color: '#ef9a9a', marginBottom: '12px' }}>{error}</div>}

        {/* 1. Ficha técnica */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>📋 Ficha Técnica</div>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Condición de piel</label>
              <input style={styles.input} value={ficha.condicion_piel} onChange={e => setFicha({...ficha, condicion_piel: e.target.value})} />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Condición de pelaje</label>
              <input style={styles.input} value={ficha.condicion_pelaje} onChange={e => setFicha({...ficha, condicion_pelaje: e.target.value})} />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Estado de orejas</label>
              <input style={styles.input} value={ficha.estado_orejas} onChange={e => setFicha({...ficha, estado_orejas: e.target.value})} />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Estado de ojos</label>
              <input style={styles.input} value={ficha.estado_ojos} onChange={e => setFicha({...ficha, estado_ojos: e.target.value})} />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Estado de dientes</label>
              <input style={styles.input} value={ficha.estado_dientes} onChange={e => setFicha({...ficha, estado_dientes: e.target.value})} />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Observaciones</label>
              <textarea style={styles.textarea} value={ficha.observaciones} onChange={e => setFicha({...ficha, observaciones: e.target.value})} />
            </div>
          </div>
          <button
            style={{...styles.btn, background: '#2e7d32', color: '#fff'}}
            onClick={handleGuardarFicha}
          >
            {fichaGuardada ? '✅ Actualizar Ficha' : '💾 Guardar Ficha'}
          </button>
        </div>

        {/* 2. Checklist */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>✅ Checklist de Tareas</div>
          {checklist.map((t, i) => (
            <div key={t.id || i} style={styles.checklistItem}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={t.completada}
                onChange={() => toggleTarea(t)}
              />
              <span style={{ flex: 1, ...(t.completada ? styles.completed : {}) }}>{t.tarea}</span>
              {t.id && (
                <button
                  style={{...styles.btn, background: '#b71c1c', color: '#fff', fontSize: '11px'}}
                  onClick={() => eliminarTarea(t.id)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <input
              style={styles.input}
              placeholder="Nueva tarea"
              value={nuevaTarea}
              onChange={e => setNuevaTarea(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAgregarTarea()}
            />
            <button
              style={{...styles.btn, background: '#1565c0', color: '#fff'}}
              onClick={handleAgregarTarea}
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* 3. Fotos */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>📸 Fotos ({fotos.length})</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {fotos.map(f => (
              <div key={f.id} style={{ position: 'relative' }}>
                <img src={f.url} alt={f.tipo} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>{f.tipo}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select style={{...styles.input, width: 'auto'}} value={fotoTipo} onChange={e => setFotoTipo(e.target.value)}>
              <option value="antes">Antes</option>
              <option value="despues">Después</option>
            </select>
            <input type="file" accept="image/*" onChange={e => setFotoFile(e.target.files[0])} />
            <button
              style={{...styles.btn, background: '#1565c0', color: '#fff'}}
              onClick={handleSubirFoto}
              disabled={!fotoFile}
            >
              Subir
            </button>
          </div>
        </div>

        {/* 4. Consumo de insumos */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>🧴 Consumo de Insumos ({consumos.length})</div>
          {consumos.map(c => (
            <div key={c.id} style={{...styles.row, justifyContent: 'space-between'}}>
              <span style={styles.value}>{c.inventario?.nombre} - {c.cantidad} {c.inventario?.unidad}</span>
              <span style={styles.label}>{c.registrado_por?.name}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <select
              style={styles.input}
              value={consumoInsumoId}
              onChange={e => setConsumoInsumoId(e.target.value)}
            >
              <option value="">Insumo</option>
              {inventario.map(i => (
                <option key={i.id} value={i.id}>{i.nombre} ({i.cantidad_disponible} {i.unidad})</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              style={{...styles.input, width: '100px'}}
              placeholder="Cant."
              value={consumoCantidad}
              onChange={e => setConsumoCantidad(e.target.value)}
            />
            <button
              style={{...styles.btn, background: '#6a1b9a', color: '#fff'}}
              onClick={handleConsumo}
            >
              Registrar
            </button>
          </div>
        </div>

        {/* 5. Cierre */}
            <div style={{ marginTop: '20px' }}>
      {!puedeCerrar && (
        <div style={{ color: '#ffb74d', marginBottom: '8px', fontSize: '13px', textAlign: 'center' }}>
          {!fichaGuardada && '📋 Debes guardar la ficha técnica. '}
          {tareasPendientes > 0 && `✅ Quedan ${tareasPendientes} tarea(s) pendiente(s) en el checklist.`}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button style={{...styles.btn, background: '#444', color: '#fff'}} onClick={onClose}>
          Volver
        </button>
        <button
          style={{
            ...styles.btn,
            background: puedeCerrar ? '#2e7d32' : '#555',
            color: puedeCerrar ? '#fff' : '#999',
            padding: '10px 24px',
            fontSize: '15px',
            cursor: puedeCerrar ? 'pointer' : 'not-allowed',
            opacity: puedeCerrar ? 1 : 0.6,
          }}
          onClick={handleFinalizar}
          disabled={!puedeCerrar || finalizando}
        >
          {finalizando ? '⏳ Finalizando...' : '✅ Finalizar Servicio'}
        </button>
      </div>
    </div>
      </div>
    </div>
  );
}

export default CitaAtencionModal;