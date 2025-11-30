// src/db/sql/checkout.sql.js
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
    ORDER BY r.fecha_fin ASC
  `,

  getAccountSummary: `
    SELECT
      r.id_reserva,
      r.valor_total as total_hospedaje,
      COALESCE((
        SELECT SUM(s.precio * rs.cantidad)
        FROM ReservaServicio rs
        JOIN Servicio s ON rs.id_servicio = s.id_servicio
        WHERE rs.id_reserva = r.id_reserva
      ), 0) as total_servicios,
      COALESCE((
        SELECT SUM(monto)
        FROM Pago
        WHERE id_reserva = r.id_reserva
      ), 0) as total_pagado
    FROM Reserva r
    WHERE r.id_reserva = $1
  `,

  registerPayment: `
    INSERT INTO Pago (id_reserva, fecha_pago, monto, metodo_pago, tipo_pago)
    VALUES ($1, NOW(), $2, $3, 'FINAL')
  `,

  finalizeReserva: `
    UPDATE Reserva 
    SET estado = 'FINALIZADA'
    WHERE id_reserva = $1
  `,

  releaseRooms: `
    UPDATE Ocupacion
    SET fecha_salida = CURRENT_DATE
    WHERE id_reserva = $1
  `,

  registerEvent: `SELECT registrar_evento_reserva($1, 'CHECK_OUT', $2)`
}
