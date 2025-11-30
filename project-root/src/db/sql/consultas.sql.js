// src/db/sql/consultas.sql.js
module.exports = {
  reservasDelDia: `
    SELECT r.*, h.nombre as nombre_huesped, ht.nombre as nombre_hotel
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    WHERE r.fecha_reserva::date = CURRENT_DATE
    ORDER BY r.fecha_reserva DESC
  `,

  llegadasPendientes: `
    SELECT r.*, h.nombre as nombre_huesped, ht.nombre as nombre_hotel
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    WHERE r.fecha_inicio = CURRENT_DATE
      AND r.estado IN ('PENDIENTE', 'CONFIRMADA')
  `,

  salidasDelDia: `
    SELECT r.*, h.nombre as nombre_huesped, ht.nombre as nombre_hotel
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    WHERE r.fecha_fin = CURRENT_DATE
      AND r.estado = 'EN_CURSO'
  `,

  pagosPendientes: `
    SELECT 
      r.id_reserva,
      h.nombre as nombre_huesped,
      r.valor_total,
      COALESCE(SUM(p.monto), 0) as total_pagado,
      (r.valor_total - COALESCE(SUM(p.monto), 0)) as saldo_pendiente
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    LEFT JOIN Pago p ON r.id_reserva = p.id_reserva
    WHERE r.estado IN ('EN_CURSO', 'CONFIRMADA')
    GROUP BY r.id_reserva, h.nombre, r.valor_total
    HAVING (r.valor_total - COALESCE(SUM(p.monto), 0)) > 0
  `
}
