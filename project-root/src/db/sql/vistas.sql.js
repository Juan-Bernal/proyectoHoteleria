// src/db/sql/vistas.sql.js
module.exports = {
  reservasPorPeriodo: `
    CREATE OR REPLACE VIEW reservas_por_periodo AS
    SELECT 
        r.id_reserva,
        r.fecha_reserva,
        r.fecha_inicio,
        r.fecha_fin,
        r.cantidad_personas,
        (
          SELECT SUM(dr.cantidad_habitaciones)
          FROM DetalleReserva dr 
          WHERE dr.id_reserva = r.id_reserva
        ) AS cantidad_habitaciones,
        (
          (SELECT SUM(dr.subtotal) FROM DetalleReserva dr WHERE dr.id_reserva = r.id_reserva)
          +
          (SELECT SUM(rs.subtotal) FROM ReservaServicio rs WHERE rs.id_reserva = r.id_reserva)
        ) AS valor_total,
        h.nombre AS nombre_huesped,
        ht.nombre AS nombre_hotel
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel;
  `,

  canceladasSinAnticipo: `
    CREATE OR REPLACE VIEW reservas_canceladas_sin_anticipo AS
    SELECT 
        r.id_reserva,
        r.fecha_reserva,
        r.fecha_inicio,
        h.nombre as nombre_huesped,
        h.id_huesped,
        ht.nombre as nombre_hotel,
        (
          SELECT SUM(dr.cantidad_habitaciones)
          FROM DetalleReserva dr 
          WHERE dr.id_reserva = r.id_reserva
        ) AS cantidad_habitaciones,
        (
          (SELECT SUM(dr.subtotal) FROM DetalleReserva dr WHERE dr.id_reserva = r.id_reserva)
          +
          (SELECT SUM(rs.subtotal) FROM ReservaServicio rs WHERE rs.id_reserva = r.id_reserva)
        ) AS valor_total,
        r.estado
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    LEFT JOIN Pago p ON r.id_reserva = p.id_reserva AND p.tipo_pago = 'ANTICIPO'
    WHERE r.estado = 'CANCELADA' AND p.id_pago IS NULL;
  `,

  noUsadasConAnticipo: `
    CREATE OR REPLACE VIEW reservas_no_utilizadas_con_anticipo AS
    SELECT 
        r.id_reserva,
        r.fecha_reserva,
        r.fecha_inicio,
        h.nombre as nombre_huesped,
        h.id_huesped,
        ht.nombre as nombre_hotel,
        (
          SELECT SUM(dr.cantidad_habitaciones)
          FROM DetalleReserva dr 
          WHERE dr.id_reserva = r.id_reserva
        ) AS cantidad_habitaciones,
        (
          (SELECT SUM(dr.subtotal) FROM DetalleReserva dr WHERE dr.id_reserva = r.id_reserva)
          +
          (SELECT SUM(rs.subtotal) FROM ReservaServicio rs WHERE rs.id_reserva = r.id_reserva)
        ) AS valor_total,
        p.monto as anticipo_pagado,
        p.fecha_pago
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    JOIN Pago p ON r.id_reserva = p.id_reserva AND p.tipo_pago = 'ANTICIPO'
    WHERE r.estado = 'NO_UTILIZADA';
  `,

  llegadaATiempo: `
  CREATE OR REPLACE VIEW reservas_llegada_a_tiempo AS
  SELECT 
    r.id_reserva,
    r.fecha_inicio,
    h.nombre AS nombre_huesped,
    ht.nombre AS nombre_hotel,
    her.fecha_evento AS fecha_evento,
    EXTRACT(HOUR FROM her.fecha_evento) AS hora_llegada
  FROM Reserva r
  JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
  JOIN Hotel ht ON r.id_hotel = ht.id_hotel
  JOIN HistorialEventoReserva her ON r.id_reserva = her.id_reserva
  WHERE her.tipo_evento = 'CHECKIN_A_TIEMPO'
    AND EXTRACT(HOUR FROM her.fecha_evento) <= 19
    AND DATE(her.fecha_evento) = r.fecha_inicio;
`,

  menoresMascotas: `
    CREATE OR REPLACE VIEW reservas_con_menores_y_mascotas AS
    SELECT DISTINCT
        r.id_reserva,
        r.fecha_reserva,
        r.fecha_inicio,
        h.nombre AS nombre_responsable,
        ht.nombre AS nombre_hotel,
        CASE 
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, hu.fecha_nacimiento)) < 18 THEN 'Sí'
          ELSE 'No'
        END AS tiene_menores,
        CASE 
          WHEN r.incluye_mascotas = true THEN 'Sí'
          ELSE 'No'
        END AS tiene_mascotas
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    JOIN Ocupacion o ON o.id_reserva = r.id_reserva
    JOIN Huesped hu ON o.id_huesped = hu.id_huesped
    WHERE r.incluye_mascotas = true 
       OR EXTRACT(YEAR FROM AGE(CURRENT_DATE, hu.fecha_nacimiento)) < 18;
  `,

  conServicios: `
    CREATE OR REPLACE VIEW reservas_con_servicios AS
    SELECT 
        r.id_reserva,
        r.fecha_inicio,
        r.fecha_fin,
        h.nombre AS nombre_huesped,
        ht.nombre AS nombre_hotel,
        s.nombre AS servicio,
        rs.cantidad,
        s.precio AS precio_unitario,
        (rs.cantidad * s.precio) AS total_servicio
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel ht ON r.id_hotel = ht.id_hotel
    JOIN ReservaServicio rs ON r.id_reserva = rs.id_reserva
    JOIN Servicio s ON rs.id_servicio = s.id_servicio;
  `,

  crearVistaMaterializada: `
    CREATE MATERIALIZED VIEW IF NOT EXISTS estadisticas_reservas AS
    SELECT 
      DATE_TRUNC('month', fecha_reserva) as mes,
      COUNT(*) as total_reservas,
      COUNT(*) FILTER (WHERE estado = 'CONFIRMADA') as confirmadas,
      COUNT(*) FILTER (WHERE estado = 'CANCELADA') as canceladas,
      COUNT(*) FILTER (WHERE estado = 'NO_UTILIZADA') as no_utilizadas,
      SUM(
        (SELECT SUM(dr.subtotal) FROM DetalleReserva dr WHERE dr.id_reserva = r.id_reserva)
        +
        (SELECT SUM(rs.subtotal) FROM ReservaServicio rs WHERE rs.id_reserva = r.id_reserva)
      ) as ingresos_totales,
      AVG(
        (SELECT SUM(dr.subtotal) FROM DetalleReserva dr WHERE dr.id_reserva = r.id_reserva)
        +
        (SELECT SUM(rs.subtotal) FROM ReservaServicio rs WHERE rs.id_reserva = r.id_reserva)
      ) as valor_promedio
    FROM Reserva r
    GROUP BY DATE_TRUNC('month', fecha_reserva);
  `,

  refrescarVistaMaterializada: `
    REFRESH MATERIALIZED VIEW estadisticas_reservas;
  `,

  obtenerEstadisticas: `
    SELECT * FROM estadisticas_reservas
    ORDER BY mes DESC
    LIMIT 12;
  `,

  historialCategoriasHotel: `
    CREATE OR REPLACE VIEW historial_categorias_hotel AS
    SELECT 
      h.id_hotel,
      h.nombre as nombre_hotel,
      hch.categoria_anterior,
      c1.nombre as nombre_categoria_anterior,
      hch.categoria_nueva,
      c2.nombre as nombre_categoria_nueva,
      hch.fecha_cambio,
      hch.motivo
    FROM HistorialCategoriaHotel hch
    JOIN Hotel h ON hch.id_hotel = h.id_hotel
    LEFT JOIN Categoria c1 ON hch.categoria_anterior = c1.id_categoria
    LEFT JOIN Categoria c2 ON hch.categoria_nueva = c2.id_categoria;
  `
};
