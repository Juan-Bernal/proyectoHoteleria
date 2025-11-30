// src/db/sql/huesped.sql.js
module.exports = {
  findAll: `SELECT * FROM Huesped ORDER BY nombre`,
  
  findById: `SELECT * FROM Huesped WHERE id_huesped = $1`,
  
  findByCedula: `SELECT * FROM Huesped WHERE cedula = $1`,

  create: `
    INSERT INTO Huesped (nombre, cedula, correo, telefono, fecha_nacimiento)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_huesped
  `,

  getHistory: `
    SELECT 
      r.id_reserva,
      ht.nombre as nombre_hotel,
      r.fecha_inicio,
      r.fecha_fin,
      r.estado
    FROM Reserva r
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    WHERE r.id_huesped_responsable = $1
    ORDER BY r.fecha_inicio DESC
  `
}
