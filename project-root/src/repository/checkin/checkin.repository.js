// src/repository/checkin/checkin.repository.js
const db = require('../../db/pool')
const sql = require('../../db/sql/checkin.sql')

module.exports = {
  findPendingToday: async () => (await db.query(sql.findPendingToday)).rows,
  
  findReservaDetails: async (id) => {
    const result = await db.query(sql.findReservaDetails, [id])
    return result.rows[0]
  },

  findAvailableRooms: async (idHotel, fechaInicio, fechaFin) => 
    (await db.query(sql.findAvailableRooms, [idHotel, fechaInicio, fechaFin])).rows,

  processCheckin: async (data) => {
    const client = await db.getClient()
    try {
      await client.query('BEGIN')

      // 1. Registrar Pago
      if (data.monto_pago > 0) {
        await client.query(sql.registerPayment, [
          data.id_reserva,
          data.monto_pago,
          data.metodo_pago
        ])
      }

      // 2. Asignar Habitaciones (Array de habitaciones seleccionadas)
      // data.habitaciones es un array de IDs de habitación
      // data.huespedes es un array de IDs de huésped (o usamos el responsable por defecto)
      if (Array.isArray(data.habitaciones)) {
        for (const idHabitacion of data.habitaciones) {
          await client.query(sql.assignRoom, [
            data.id_reserva,
            idHabitacion,
            data.id_huesped_responsable, // Por simplicidad asignamos al responsable, idealmente sería a cada huésped
            data.fecha_inicio,
            data.fecha_fin
          ])
        }
      } else if (data.habitaciones) {
         await client.query(sql.assignRoom, [
            data.id_reserva,
            data.habitaciones,
            data.id_huesped_responsable,
            data.fecha_inicio,
            data.fecha_fin
          ])
      }

      // 3. Actualizar Estado Reserva
      await client.query(sql.updateReservaStatus, [data.id_reserva])

      // 4. Registrar Evento
      await client.query(sql.registerEvent, [data.id_reserva, 'Check-in realizado con éxito'])

      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }
}
