// src/repository/checkout/checkout.repository.js
const db = require('../../db/pool')
const sql = require('../../db/sql/checkout.sql')

module.exports = {
  findActiveReservations: async () => (await db.query(sql.findActiveReservations)).rows,
  
  getAccountSummary: async (id) => {
    const result = await db.query(sql.getAccountSummary, [id])
    return result.rows[0]
  },

  processCheckout: async (data) => {
    const client = await db.getClient()
    try {
      await client.query('BEGIN')

      // 1. Registrar Pago Final (si aplica)
      if (data.monto_pago > 0) {
        await client.query(sql.registerPayment, [
          data.id_reserva,
          data.monto_pago,
          data.metodo_pago
        ])
      }

      // 2. Liberar Habitaciones (Actualizar fecha salida real)
      await client.query(sql.releaseRooms, [data.id_reserva])

      // 3. Finalizar Reserva
      await client.query(sql.finalizeReserva, [data.id_reserva])

      // 4. Registrar Evento
      await client.query(sql.registerEvent, [data.id_reserva, 'Check-out realizado con éxito'])

      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }
}
