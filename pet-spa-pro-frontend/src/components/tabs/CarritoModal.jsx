import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'flex-end', zIndex: 3000,
  },
  panel: {
    background: '#1a1a1a', width: '400px', maxWidth: '90vw', height: '100vh',
    padding: '24px', overflowY: 'auto', borderLeft: '1px solid #333',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
  },
  title: { color: '#81c784', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
  item: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 0', borderBottom: '1px solid #222',
  },
  itemName: { color: '#e0e0e0', fontWeight: '500' },
  itemPrice: { color: '#81c784', fontWeight: 'bold' },
  qtyControl: {
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  qtyBtn: {
    width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #555',
    background: '#222', color: '#ccc', cursor: 'pointer', fontSize: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  total: {
    marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #333',
    display: 'flex', justifyContent: 'space-between', color: '#e0e0e0',
    fontSize: '18px', fontWeight: 'bold',
  },
  checkoutBtn: {
    width: '100%', marginTop: '20px', padding: '14px',
    background: 'linear-gradient(135deg, #81c784, #4caf50)',
    border: 'none', borderRadius: '10px', color: '#000',
    fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
  },
  empty: { color: '#666', textAlign: 'center', marginTop: '40px' },
};

function CarritoModal({ carrito, onClose, onUpdateCantidad, onEliminar, total }) {
  const [realizando, setRealizando] = useState(false);
  const [mensaje, setMensaje] = useState('');
const token = localStorage.getItem('token');
console.log('Token:', token); // Debe mostrar un string largo, no null
if (!token) {
  alert('Debes iniciar sesión para comprar.');
  return;
}
  const handleRealizarPedido = async () => {
    setRealizando(true);
    setMensaje('');
    try {
      const productos = carrito.map(item => ({
        id: item.id,
        cantidad: item.cantidad,
      }));
      await api.post('/pedidos', { productos });
      setMensaje('✅ Pedido realizado con éxito');
      setTimeout(() => {
        onClose();
        window.location.reload(); // refrescar para actualizar stock
      }, 1500);
    } catch (err) {
      setMensaje('❌ ' + (err.response?.data?.message || 'Error al realizar pedido'));
    } finally {
      setRealizando(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={e => e.stopPropagation()}>
        <h2 style={styles.title}>🛒 Carrito</h2>
        {carrito.length === 0 ? (
          <div style={styles.empty}>Tu carrito está vacío</div>
        ) : (
          <>
            {carrito.map(item => (
              <div key={item.id} style={styles.item}>
                <div style={{ flex: 1 }}>
                  <div style={styles.itemName}>{item.nombre}</div>
                  <div style={styles.itemPrice}>
                    ${(item.precio_promocional || item.precio) * item.cantidad}
                  </div>
                </div>
                <div style={styles.qtyControl}>
                  <button style={styles.qtyBtn} onClick={() => onUpdateCantidad(item.id, item.cantidad - 1)}>−</button>
                  <span style={{ color: '#ccc' }}>{item.cantidad}</span>
                  <button style={styles.qtyBtn} onClick={() => onUpdateCantidad(item.id, item.cantidad + 1)}>+</button>
                  <button style={{...styles.qtyBtn, borderColor: '#d32f2f', color: '#d32f2f'}} onClick={() => onEliminar(item.id)}>✕</button>
                </div>
              </div>
            ))}
            <div style={styles.total}>
              <span>Total</span>
              <span style={{ color: '#81c784' }}>${total.toFixed(2)}</span>
            </div>
            {mensaje && <div style={{ color: mensaje.includes('✅') ? '#81c784' : '#ef9a9a', marginTop: '12px' }}>{mensaje}</div>}
            <button
              style={styles.checkoutBtn}
              onClick={handleRealizarPedido}
              disabled={realizando}
            >
              {realizando ? 'Procesando...' : 'Realizar Pedido'}
            </button>
          </>
        )}
        <button
          style={{ ...styles.checkoutBtn, background: '#444', color: '#ccc', marginTop: '10px' }}
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default CarritoModal;