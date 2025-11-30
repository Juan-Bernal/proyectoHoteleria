// src/repository/dashboard/dashboard.repository.js
const db = require('../../db/pool')
const sql = require('../../db/sql/dashboard.sql')

module.exports = {
  // Obtener todos los hoteles con direcciones
  findAllHotels: async () => {
    return (await db.query(sql.findAllHotelsWithAddress)).rows
  },

  // Obtener habitaciones disponibles de un hotel
  findAvailableRooms: async (hotelId) => {
    return (await db.query(sql.findAvailableRoomsByHotel, [hotelId])).rows
  },

  // Obtener detalles de una habitación
  findRoomById: async (roomId) => {
    const result = await db.query(sql.findRoomDetails, [roomId])
    return result.rows[0]
  },

  // Obtener todos los servicios
  findAllServices: async () => {
    return (await db.query(sql.findAllServices)).rows
  },

  // Verificar disponibilidad de habitación
  checkAvailability: async (roomId, fechaInicio, fechaFin) => {
    const result = await db.query(sql.checkRoomAvailability, [roomId, fechaInicio, fechaFin])
    return result.rows[0].ocupaciones === '0'
  },

  // Crear reserva completa con transacción
  createCompleteReservation: async (data) => {
    const client = await db.getClient()
    
    try {
      await client.query('BEGIN')

      // 1. Verificar o crear huésped
      let guest = (await client.query(sql.findGuestByCedula, [data.cedula])).rows[0]
      
      if (!guest) {
        guest = (await client.query(sql.createGuest, [
          data.cedula,
          data.nombre,
          data.direccion || '',
          data.fecha_nacimiento
        ])).rows[0]

        // Crear teléfono
        await client.query(sql.createGuestPhone, [guest.id_huesped, data.telefono])
      }

      // 2. Crear reserva
      const reserva = (await client.query(sql.createReservation, [
        data.fecha_inicio,
        data.fecha_fin,
        data.cantidad_personas,
        guest.id_huesped,
        data.id_hotel,
        data.valor_total,
        data.incluye_mascotas || false
      ])).rows[0]

      // 3. Asignar habitación
      await client.query(sql.assignRoomToReservation, [
        reserva.id_reserva,
        data.id_habitacion,
        guest.id_huesped,
        data.fecha_inicio,
        data.fecha_fin
      ])

      // 4. Agregar servicios si los hay
      if (data.servicios && data.servicios.length > 0) {
        for (const servicioId of data.servicios) {
          await client.query(sql.addServiceToReservation, [
            reserva.id_reserva,
            servicioId,
            1 // cantidad por defecto
          ])
        }
      }

      await client.query('COMMIT')
      return reserva
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  },

  // Procesar pago del anticipo
  processPayment: async (reservaId, monto, metodoPago) => {
    const client = await db.getClient()
    
    try {
      await client.query('BEGIN')

      // Registrar pago
      await client.query(sql.registerPayment, [reservaId, monto, metodoPago])

      // Confirmar reserva
      await client.query(sql.confirmReservation, [reservaId])

      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  },

  // Obtener detalles de reserva
  getReservationDetails: async (reservaId) => {
    const result = await db.query(sql.getReservationDetails, [reservaId])
    return result.rows[0]
  }
}
