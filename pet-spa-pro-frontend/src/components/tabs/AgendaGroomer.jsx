import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import CitaAtencionModal from './CitaAtencionModal';

const styles = { /* similar a otros tabs */ };

function AgendaGroomer() {
  const [citas, setCitas] = useState([]);
  const [fecha, setFecha] = useState('');
  const [selectedCita, setSelectedCita] = useState(null);

  const fetchCitas = async () => {
    const params = {};
    if (fecha) params.fecha = fecha;
    const res = await api.get('/citas', { params });
    // Filtramos solo las del groomer actual (backend ya debería filtrar si es groomer)
    setCitas(res.data.data || res.data);
  };

  useEffect(() => { fetchCitas(); }, [fecha]);

  const handleIniciar = async (citaId) => {
    await api.put(`/citas/${citaId}`, { estado: 'en_proceso' });
    fetchCitas();
  };

  return (
    <div style={styles.container}>
      <h2>Mi Agenda</h2>
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Mascota</th>
            <th>Dueño</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map(c => (
            <tr key={c.id}>
              <td>{c.hora}</td>
              <td>{c.mascota?.nombre}</td>
              <td>{c.cliente?.name}</td>
              <td>{c.estado}</td>
              <td>
                {c.estado === 'confirmada' && (
                  <button onClick={() => handleIniciar(c.id)}>Iniciar</button>
                )}
                {c.estado === 'en_proceso' && (
                  <button onClick={() => setSelectedCita(c)}>Atender</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCita && (
        <CitaAtencionModal
          cita={selectedCita}
          onClose={() => { setSelectedCita(null); fetchCitas(); }}
        />
      )}
    </div>
  );
}