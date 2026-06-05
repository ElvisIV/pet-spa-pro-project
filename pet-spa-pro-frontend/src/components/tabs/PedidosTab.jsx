import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const styles = {
  container: {
    padding: '24px',
    background: 'rgba(26,26,26,0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    animation: 'fadeIn 0.5s ease-out',
  },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '24px' },
  title: { color: '#81c784', fontSize: '24px', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '1px solid #333', color: '#81c784' },
  td: { padding: '12px', borderBottom: '1px solid #222', color: '#e0e0e0' },
  badge: (estado) => ({
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
    backgroundColor: estado === 'pendiente' ? '#e65100' : estado === 'pagado' ? '#2e7d32' : estado === 'entregado' ? '#1565c0' : '#b71c1c',
    color: '#fff', display: 'inline-block',
  }),
  actionBtn: { padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', marginRight: '4px' },
};

function PedidosTab() {
  const [pedidos, setPedidos] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchPedidos = async () => {
    try {
      const res = await api.get('/pedidos');
      setPedidos(res.data.data || res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchPedidos(); }, []);

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/pedidos/${id}/estado`, { estado });
      fetchPedidos();
    } catch (err) { alert('Error al actualizar estado'); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📦 Mis Pedidos</h2>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Fecha</th>
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Estado</th>
            {(user.rol === 'admin' || user.rol === 'recepcion') && <th style={styles.th}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p.id}>
              <td style={styles.td}>#{p.id}</td>
              <td style={styles.td}>{new Date(p.created_at).toLocaleDateString()}</td>
              <td style={styles.td}>${parseFloat(p.total).toFixed(2)}</td>
              <td style={styles.td}><span style={styles.badge(p.estado)}>{p.estado}</span></td>
              {(user.rol === 'admin' || user.rol === 'recepcion') && (
                <td style={styles.td}>
                  {p.estado === 'pendiente' && (
                    <>
                      <button style={{...styles.actionBtn, background: '#2e7d32', color: '#fff'}} onClick={() => cambiarEstado(p.id, 'pagado')}>Marcar Pagado</button>
                      <button style={{...styles.actionBtn, background: '#b71c1c', color: '#fff'}} onClick={() => cambiarEstado(p.id, 'cancelado')}>Cancelar</button>
                    </>
                  )}
                  {p.estado === 'pagado' && (
                    <button style={{...styles.actionBtn, background: '#1565c0', color: '#fff'}} onClick={() => cambiarEstado(p.id, 'entregado')}>Marcar Entregado</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PedidosTab;