// src/db/sql/habitacion_empleado.sql.js
module.exports = {
  findAllWithStatus: `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      h.nro_piso,
      h.estado as estado_fisico,
      t.nombre as tipo,
      t.precio,
      ht.nombre as nombre_hotel,
      CASE 
        WHEN o.id_ocupacion IS NOT NULL THEN 'OCUPADA'
        WHEN h.estado = 'MANTENIMIENTO' THEN 'MANTENIMIENTO'
        WHEN h.estado = 'LIMPIEZA' THEN 'LIMPIEZA'
        ELSE 'DISPONIBLE'
      END as estado_actual,
      o.id_reserva,
      res.id_huesped_responsable,
      hu.nombre as nombre_huesped
    FROM Habitacion h
    JOIN TipoHabitacion t ON h.id_tipo_habitacion = t.id_tipo_habitacion
    JOIN Hotel ht ON h.id_hotel = ht.id_hotel
    LEFT JOIN Ocupacion o ON h.id_habitacion = o.id_habitacion 
      AND CURRENT_DATE BETWEEN o.fecha_entrada AND o.fecha_salida
    LEFT JOIN Reserva res ON o.id_reserva = res.id_reserva
    LEFT JOIN Huesped hu ON res.id_huesped_responsable = hu.id_huesped
    ORDER BY h.numero_habitacion
  `,

  updateStatus: `
    UPDATE Habitacion 
    SET estado = $2
    WHERE id_habitacion = $1
  `
}
