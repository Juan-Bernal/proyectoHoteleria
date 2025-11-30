// src/db/sql/checkin.sql.js
module.exports = {
  findPendingToday: `
    SELECT 
      r.id_reserva,
      r.fecha_inicio,
      r.fecha_fin,
      r.cantidad_personas,
      r.valor_total,
      h.nombre as nombre_huesped,
      h.id_huesped,
      ht.nombre as nombre_hotel,
      ht.id_hotel
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    WHERE r.estado IN ('PENDIENTE', 'CONFIRMADA')
      AND r.fecha_inicio <= CURRENT_DATE
    ORDER BY r.fecha_inicio ASC
  `,
  
  findReservaDetails: `
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

  findAvailableRooms: `
    SELECT h.*, t.nombre as tipo, t.precio
    FROM Habitacion h
    JOIN TipoHabitacion t ON h.id_tipo_habitacion = t.id_tipo_habitacion
    WHERE h.id_hotel = $1
      AND h.id_habitacion NOT IN (
        SELECT id_habitacion 
        FROM Ocupacion 
        WHERE (fecha_entrada <= $3 AND fecha_salida >= $2)
      )
  `,

  registerPayment: `
    INSERT INTO Pago (id_reserva, fecha_pago, monto, metodo_pago, tipo_pago)
    VALUES ($1, NOW(), $2, $3, 'ANTICIPO')
  `,

  assignRoom: `
    INSERT INTO Ocupacion (id_reserva, id_habitacion, id_huesped, fecha_entrada, fecha_salida)
    VALUES ($1, $2, $3, $4, $5)
  `,

  updateReservaStatus: `
    UPDATE Reserva 
    SET estado = 'EN_CURSO'
    WHERE id_reserva = $1
  `,

  registerEvent: `SELECT registrar_evento_reserva($1, 'CHECK_IN', $2)`
}
