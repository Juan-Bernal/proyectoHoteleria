// src/db/sql/reserva.sql.js
module.exports = {
  findAll: `
    SELECT 
      r.id_reserva,
      r.fecha_reserva,
      r.fecha_inicio,
      r.fecha_fin,
      r.estado,
      r.valor_total,
      h.nombre as nombre_huesped,
      ht.nombre as nombre_hotel
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    ORDER BY r.fecha_reserva DESC
  `,
  findById: `
    SELECT 
      r.*,
      h.nombre as nombre_huesped,
      h.id_huesped,
      ht.nombre as nombre_hotel
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    WHERE r.id_reserva = $1
  `,
  create: `
    INSERT INTO Reserva (
      fecha_reserva, 
      fecha_inicio, 
      fecha_fin, 
      cantidad_personas, 
      id_huesped_responsable, 
      id_hotel, 
      valor_total, 
      estado,
      incluye_mascotas
    ) VALUES (NOW(), $1, $2, $3, $4, $5, $6, 'PENDIENTE', $7)
    RETURNING id_reserva
  `,
  updateStatus: `
    UPDATE Reserva 
    SET estado = $2
    WHERE id_reserva = $1
  `,
  cancel: `
    UPDATE Reserva 
    SET estado = 'CANCELADA'
    WHERE id_reserva = $1
  `,
  // Consultas auxiliares
  findHuespedByCedula: `SELECT * FROM Huesped WHERE id_huesped = $1`,
  createHuesped: `
    INSERT INTO Huesped (id_huesped, nombre, direccion, fecha_nacimiento)
    VALUES ($1, $2, $3, $4)
    RETURNING id_huesped
  `,
  createTelefono: `
    INSERT INTO TelefonoHuesped (id_huesped, telefono)
    VALUES ($1, $2)
  `
}
