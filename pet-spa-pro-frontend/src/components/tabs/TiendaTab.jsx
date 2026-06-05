import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import CarritoModal from './CarritoModal';

const styles = {
  container: {
    padding: '24px',
    background: 'rgba(26,26,26,0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    animation: 'fadeIn 0.5s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    color: '#81c784',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    padding: '10px 16px',
    background: '#222',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#e0e0e0',
    fontSize: '14px',
    outline: 'none',
    width: '200px',
  },
  categoryBtn: (active) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    background: active ? '#81c784' : '#333',
    color: active ? '#000' : '#ccc',
    transition: 'all 0.2s',
  }),
  carritoBtn: {
    position: 'relative',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #81c784, #4caf50)',
    border: 'none',
    borderRadius: '10px',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#ffb74d',
    color: '#000',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#1a1a1a',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  imagen: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    background: '#222',
  },
  cardBody: {
    padding: '16px',
  },
  categoria: {
    color: '#81c784',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  nombre: {
    color: '#e0e0e0',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  precio: {
    color: '#81c784',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  precioOriginal: {
    color: '#888',
    fontSize: '14px',
    textDecoration: 'line-through',
    marginRight: '8px',
  },
  stock: {
    color: '#888',
    fontSize: '12px',
    marginTop: '4px',
  },
  addBtn: {
    width: '100%',
    marginTop: '12px',
    padding: '10px',
    background: 'linear-gradient(135deg, #81c784, #4caf50)',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.1s',
  },
};

function TiendaTab() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [search, setSearch] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [showCarrito, setShowCarrito] = useState(false);

  const fetchProductos = async () => {
    try {
      const params = {};
      if (categoriaActiva) params.categoria_id = categoriaActiva;
      if (search) params.search = search;
      const res = await api.get('/productos', { params });
      setProductos(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await api.get('/categorias');
      setCategorias(res.data);
    } catch (err) { /* si no existe endpoint, usar categorías fijas */ }
  };

  useEffect(() => { fetchProductos(); }, [categoriaActiva, search]);
  useEffect(() => { fetchCategorias(); }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    setCarrito(prev =>
      prev.map(item => item.id === id ? { ...item, cantidad } : item)
    );
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + (item.precio_promocional || item.precio) * item.cantidad, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🛒 Tienda</h2>
        <div style={styles.filters}>
          <input
            type="text"
            placeholder="🔍 Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={styles.categoryBtn(!categoriaActiva)}
              onClick={() => setCategoriaActiva(null)}
            >
              Todos
            </button>
            {categorias.map(cat => (
              <button
                key={cat.id}
                style={styles.categoryBtn(categoriaActiva === cat.id)}
                onClick={() => setCategoriaActiva(cat.id)}
              >
                {cat.icono} {cat.nombre}
              </button>
            ))}
          </div>
        </div>
        <button style={styles.carritoBtn} onClick={() => setShowCarrito(true)}>
          🛒 Carrito
          {carrito.length > 0 && <span style={styles.badge}>{carrito.length}</span>}
        </button>
      </div>

      <div style={styles.grid}>
        {productos.map(prod => (
          <div
            key={prod.id}
            style={styles.card}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'none'}
          >
            <img
              src={prod.imagen_url || 'https://via.placeholder.com/300x160?text=Sin+imagen'}
              alt={prod.nombre}
              style={styles.imagen}
            />
            <div style={styles.cardBody}>
              <div style={styles.categoria}>{prod.categoria?.nombre}</div>
              <div style={styles.nombre}>{prod.nombre}</div>
              <div>
                {prod.precio_promocional && (
                  <span style={styles.precioOriginal}>${prod.precio}</span>
                )}
                <span style={styles.precio}>
                  ${prod.precio_promocional || prod.precio}
                </span>
              </div>
              <div style={styles.stock}>
                Stock: {prod.stock} {prod.variante ? `(${prod.variante})` : ''}
              </div>
              <button
                style={styles.addBtn}
                onClick={() => agregarAlCarrito(prod)}
                disabled={prod.stock === 0}
              >
                {prod.stock === 0 ? 'Sin stock' : '🛍️ Añadir al carrito'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCarrito && (
        <CarritoModal
          carrito={carrito}
          onClose={() => setShowCarrito(false)}
          onUpdateCantidad={actualizarCantidad}
          onEliminar={eliminarDelCarrito}
          total={totalCarrito}
        />
      )}
    </div>
  );
}

export default TiendaTab;