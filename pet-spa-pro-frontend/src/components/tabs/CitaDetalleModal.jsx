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
    width: '95%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto',
    border: '1px solid #333', boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
  },
  title: { color: '#81c784', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
  section: { marginBottom: '24px' },
  sectionTitle: { color: '#ccc', fontSize: '16px', fontWeight: '600', marginBottom: '12px', borderBottom: '1px solid #333', paddingBottom: '8px' },
  row: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '8px' },
  label: { color: '#888', fontSize: '13px', textTransform: 'uppercase' },
  value: { color: '#e0e0e0', fontSize: '15px', fontWeight: '500' },
  input: { padding: '8px 12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: '#e0e0e0', marginBottom: '8px' },
  btn: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px', marginRight: '8px', marginTop: '8px' },
  badge: (estado) => ({
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
    backgroundColor: estado === 'pendiente' ? '#e65100' : estado === 'confirmada' ? '#1565c0' : estado === 'en_proceso' ? '#6a1b9a' : estado === 'completada' ? '#2e7d32' : '#b71c1c',
    color: '#fff', display: 'inline-block',
  }),
};

function CitaDetalleModal({ cita, onClose }) {
  const [pagos, setPagos] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [montoPago, setMontoPago] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [groomers, setGroomers] = useState([]);
  const [selectedGroomerId, setSelectedGroomerId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [consumoInsumoId, setConsumoInsumoId] = useState('');
  const [consumoCantidad, setConsumoCantidad] = useState('');
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoTipo, setFotoTipo] = useState('antes');
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchDetalles = async () => {
    try {
      const res = await api.get(`/citas/${cita.id}`);
      setPagos(res.data.pagos || []);
      setConsumos(res.data.consumos || []);
      setFotos(res.data.fotos || []);
    } catch (err) { console.error(err); }
  };

  const fetchGroomers = async () => {
    try {
      const res = await api.get('/users');
      setGroomers(res.data.filter(u => u.rol === 'groomer'));
    } catch (err) {
      console.error('Error al obtener groomers', err);
    }
  };

  const fetchInventario = async () => {
    try {
      const res = await api.get('/inventario');
      setInventario(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchDetalles();
    fetchInventario();
    fetchGroomers();
  }, []);

  const handleAsignarGroomer = async () => {
    if (!selectedGroomerId) {
      setError('Selecciona un groomer');
      return;
    }
    setAssigning(true);
    setError('');
    try {
      await api.put(`/citas/${cita.id}`, {
        staff_id: selectedGroomerId,
      });
      onClose(); // Cierra el modal y refresca la lista en el padre
    } catch (err) {
      setError(err.response?.data?.message || 'Error al asignar groomer');
    } finally {
      setAssigning(false);
    }
  };

  const handlePago = async () => {
    if (!montoPago || parseFloat(montoPago) <= 0) {
      setError('Ingrese un monto válido');
      return;
    }
    try {
      await api.post('/pagos', {
        cita_id: cita.id,
        monto: parseFloat(montoPago),
        metodo: metodoPago,
      });
      setMontoPago('');
      setError('');
      fetchDetalles();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar pago');
    }
  };

  const handleConsumo = async () => {
    if (!consumoInsumoId || !consumoCantidad || parseFloat(consumoCantidad) <= 0) {
      setError('Seleccione insumo y cantidad válida');
      return;
    }
    try {
      await api.post('/consumo-insumos', {
        cita_id: cita.id,
        inventario_id: parseInt(consumoInsumoId),
        cantidad: parseFloat(consumoCantidad),
      });
      setConsumoInsumoId('');
      setConsumoCantidad('');
      setError('');
      fetchDetalles();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar consumo');
    }
  };

  const handleFoto = async () => {
    if (!fotoFile) return;
    const formData = new FormData();
    formData.append('cita_id', cita.id);
    formData.append('imagen', fotoFile);
    formData.append('tipo', fotoTipo);
    try {
      await api.post('/fotos-servicio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFotoFile(null);
      setError('');
      fetchDetalles();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al subir foto');
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.title}>Detalle de Cita #{cita.id}</h2>

        {error && <div style={{ color: '#ef9a9a', marginBottom: '12px' }}>{error}</div>}

        {/* Info general */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Información</div>
          <div style={styles.row}>
            <div><span style={styles.label}>Mascota</span><br /><span style={styles.value}>{cita.mascota?.nombre || '—'}</span></div>
            <div><span style={styles.label}>Dueño</span><br /><span style={styles.value}>{cita.cliente?.name || '—'}</span></div>
            <div><span style={styles.label}>Fecha/Hora</span><br /><span style={styles.value}>{cita.fecha} {cita.hora}</span></div>
            <div><span style={styles.label}>Estado</span><br /><span style={styles.badge(cita.estado)}>{cita.estado}</span></div>
          </div>
          <div style={styles.row}>
            <div><span style={styles.label}>Groomer</span><br /><span style={styles.value}>{cita.groomer?.name || 'Sin asignar'}</span></div>
            <div><span style={styles.label}>Servicios</span><br /><span style={styles.value}>{cita.servicios?.map(s => `${s.nombre} ($${s.pivot?.precio || s.precio})`).join(', ') || cita.servicio}</span></div>
          </div>
        </div>

        {/* Asignar Groomer (solo admin/recepción cuando la cita está pendiente) */}
        {(user.rol === 'admin' || user.rol === 'recepcion') && cita.estado === 'pendiente' && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Asignar Groomer</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                style={styles.input}
                value={selectedGroomerId}
                onChange={e => setSelectedGroomerId(e.target.value)}
              >
                <option value="">Seleccionar groomer</option>
                {groomers.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <button
                style={{...styles.btn, background: '#1565c0', color: '#fff', opacity: assigning ? 0.7 : 1}}
                onClick={handleAsignarGroomer}
                disabled={assigning}
              >
                {assigning ? 'Asignando...' : 'Asignar Groomer'}
              </button>
            </div>
          </div>
        )}

        {/* Pagos */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Pagos ({pagos.length})</div>
          {pagos.map(p => (
            <div key={p.id} style={{...styles.row, justifyContent: 'space-between'}}>
              <span style={styles.value}>${parseFloat(p.monto).toFixed(2)} - {p.metodo}</span>
              <span style={styles.label}>{new Date(p.created_at).toLocaleString()}</span>
            </div>
          ))}
          {(user.rol === 'admin' || user.rol === 'recepcion') && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input type="number" style={styles.input} placeholder="Monto" value={montoPago} onChange={e => setMontoPago(e.target.value)} />
                          <select
                                style={styles.input}
                                value={metodoPago}
                                onChange={e => setMetodoPago(e.target.value)}
                              >
                                <option value="efectivo">Efectivo</option>
                                <option value="tarjeta">Tarjeta</option>
                                <option value="transferencia">Transferencia</option>
                                <option value="qr">QR</option>               {/* ← nueva opción */}
            </select>
              <button style={{...styles.btn, background: '#2e7d32', color: '#fff'}} onClick={handlePago}>Registrar Pago</button>
            </div>
          )}
        </div>

        {/* Consumo de insumos */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Insumos Consumidos ({consumos.length})</div>
          {consumos.map(c => (
            <div key={c.id} style={{...styles.row, justifyContent: 'space-between'}}>
              <span style={styles.value}>{c.inventario?.nombre} - {c.cantidad} {c.inventario?.unidad}</span>
              <span style={styles.label}>{c.registrado_por?.name}</span>
            </div>
          ))}
          {(user.rol === 'admin' || (user.rol === 'groomer' && cita.estado === 'en_proceso')) && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select style={styles.input} value={consumoInsumoId} onChange={e => setConsumoInsumoId(e.target.value)}>
                <option value="">Seleccionar insumo</option>
                {inventario.map(i => <option key={i.id} value={i.id}>{i.nombre} ({i.cantidad_disponible} {i.unidad})</option>)}
              </select>
              <input type="number" step="0.01" style={styles.input} placeholder="Cantidad" value={consumoCantidad} onChange={e => setConsumoCantidad(e.target.value)} />
              <button style={{...styles.btn, background: '#6a1b9a', color: '#fff'}} onClick={handleConsumo}>Registrar Consumo</button>
            </div>
          )}
        </div>

        {/* Fotos */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Fotos ({fotos.length})</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {fotos.map(f => (
              <div key={f.id} style={{ position: 'relative' }}>
                <img src={f.url} alt={f.tipo} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>{f.tipo}</span>
              </div>
            ))}
          </div>
          {(user.rol === 'admin' || (user.rol === 'groomer' && cita.estado === 'en_proceso')) && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select style={styles.input} value={fotoTipo} onChange={e => setFotoTipo(e.target.value)}>
                <option value="antes">Antes</option>
                <option value="despues">Después</option>
              </select>
              <input type="file" accept="image/*" onChange={e => setFotoFile(e.target.files[0])} />
              <button style={{...styles.btn, background: '#1565c0', color: '#fff'}} onClick={handleFoto} disabled={!fotoFile}>Subir Foto</button>
            </div>
          )}
        </div>

        <button style={{...styles.btn, background: '#444', color: '#fff', marginTop: '20px'}} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default CitaDetalleModal;