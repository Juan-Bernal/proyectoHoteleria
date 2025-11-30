// src/db/sql/consumo.sql.js
module.exports = {
  findActiveReservations: `
    SELECT 
      r.id_reserva,
      h.nombre as nombre_huesped,
      ht.nombre as nombre_hotel,
      r.fecha_inicio,
      r.fecha_fin
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    WHERE r.estado = 'EN_CURSO'
    ORDER BY r.fecha_inicio DESC
  `,

  findAllServices: `SELECT * FROM Servicio ORDER BY nombre`,

  getConsumosByReserva: `
    SELECT 
      rs.id_reserva_servicio,
      s.nombre,
      s.precio,
      rs.cantidad,
      (s.precio * rs.cantidad) as total
    FROM ReservaServicio rs
    JOIN Servicio s ON rs.id_servicio = s.id_servicio
    WHERE rs.id_reserva = $1
    ORDER BY rs.id_reserva_servicio DESC
  `,

  addConsumo: `
    INSERT INTO ReservaServicio (id_reserva, id_servicio, cantidad)
    VALUES ($1, $2, $3)
  `
}
