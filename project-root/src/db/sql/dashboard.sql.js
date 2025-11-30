// src/db/sql/dashboard.sql.js
module.exports = {
  // Listar todos los hoteles con sus direcciones únicas
  findAllHotelsWithAddress: `
    SELECT DISTINCT
      h.id_hotel,
      h.nombre,
      h.direccion,
      c.nombre as categoria,
      COUNT(hab.id_habitacion) as total_habitaciones
    FROM Hotel h
    LEFT JOIN Categoria c ON h.id_categoria = c.id_categoria
    LEFT JOIN Habitacion hab ON h.id_hotel = hab.id_hotel
    GROUP BY h.id_hotel, h.nombre, h.direccion, c.nombre
    ORDER BY h.nombre
  `,

  // Habitaciones disponibles de un hotel específico
  findAvailableRoomsByHotel: `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      h.nro_piso,
      h.estado,
      t.id_tipo_habitacion,
      t.nombre as tipo_nombre,
      t.capacidad_max,
      t.precio
    FROM Habitacion h
    JOIN TipoHabitacion t ON h.id_tipo_habitacion = t.id_tipo_habitacion
    WHERE h.id_hotel = $1
      AND h.estado = 'DISPONIBLE'
      AND h.id_habitacion NOT IN (
        SELECT o.id_habitacion 
        FROM Ocupacion o
        WHERE CURRENT_DATE BETWEEN o.fecha_entrada AND o.fecha_salida
      )
    ORDER BY t.precio ASC
  `,

  // Detalle completo de una habitación
  findRoomDetails: `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      h.nro_piso,
      h.estado,
      h.id_hotel,
      hotel.nombre as hotel_nombre,
      hotel.direccion as hotel_direccion,
      t.id_tipo_habitacion,
      t.nombre as tipo_nombre,
      t.capacidad_max,
      t.precio
    FROM Habitacion h
    JOIN TipoHabitacion t ON h.id_tipo_habitacion = t.id_tipo_habitacion
    JOIN Hotel hotel ON h.id_hotel = hotel.id_hotel
    WHERE h.id_habitacion = $1
  `,

  // Servicios disponibles (generales del hotel)
  findAllServices: `
    SELECT 
      id_servicio,
      nombre,
      descripcion,
      precio
    FROM Servicio
    ORDER BY nombre
  `,

  // Verificar disponibilidad de habitación en fechas específicas
  checkRoomAvailability: `
    SELECT COUNT(*) as ocupaciones
    FROM Ocupacion
    WHERE id_habitacion = $1
      AND (
        (fecha_entrada <= $2 AND fecha_salida >= $2)
        OR (fecha_entrada <= $3 AND fecha_salida >= $3)
        OR (fecha_entrada >= $2 AND fecha_salida <= $3)
      )
  `,

  // Crear reserva pública (con transacción en repository)
  createReservation: `
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
    ) VALUES (
      NOW(),
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      'PENDIENTE',
      $7
    )
    RETURNING id_reserva
  `,

  // Registrar pago del anticipo
  registerPayment: `
    INSERT INTO Pago (
      id_reserva,
      fecha_pago,
      monto,
      metodo_pago,
      tipo_pago
    ) VALUES (
      $1,
      NOW(),
      $2,
      $3,
      'ANTICIPO'
    )
    RETURNING id_pago
  `,

  // Actualizar estado de reserva a CONFIRMADA
  confirmReservation: `
    UPDATE Reserva
    SET estado = 'CONFIRMADA'
    WHERE id_reserva = $1
  `,

  // Asignar habitación a reserva
  assignRoomToReservation: `
    INSERT INTO Ocupacion (
      id_reserva,
      id_habitacion,
      id_huesped,
      fecha_entrada,
      fecha_salida
    ) VALUES ($1, $2, $3, $4, $5)
  `,

  // Agregar servicios a reserva
  addServiceToReservation: `
    INSERT INTO ReservaServicio (
      id_reserva,
      id_servicio,
      cantidad
    ) VALUES ($1, $2, $3)
  `,

  // Buscar o crear huésped
  findGuestByCedula: `
    SELECT * FROM Huesped WHERE id_huesped = $1
  `,

  createGuest: `
    INSERT INTO Huesped (
      id_huesped,
      nombre,
      direccion,
      fecha_nacimiento
    ) VALUES ($1, $2, $3, $4)
    RETURNING id_huesped
  `,

  createGuestPhone: `
    INSERT INTO TelefonoHuesped (id_huesped, telefono)
    VALUES ($1, $2)
  `,

  // Obtener detalles de reserva para confirmación
  getReservationDetails: `
    SELECT 
      r.*,
      h.nombre as nombre_huesped,
      hotel.nombre as nombre_hotel,
      hotel.direccion as direccion_hotel
    FROM Reserva r
    JOIN Huesped h ON r.id_huesped_responsable = h.id_huesped
    JOIN Hotel hotel ON r.id_hotel = hotel.id_hotel
    WHERE r.id_reserva = $1
  `
}
