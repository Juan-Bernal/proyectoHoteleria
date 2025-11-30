// src/repository/reserva/reserva.repository.js
const db = require('../../db/pool')
const sql = require('../../db/sql/reserva.sql')

module.exports = {
  findAll: async () => (await db.query(sql.findAll)).rows,
  
  findById: async (id) => {
    const result = await db.query(sql.findById, [id])
    return result.rows[0]
  },

  create: async (data) => {
    const client = await db.getClient()
    try {
      await client.query('BEGIN')

      // Primero verificamos o creamos el huésped
      let huesped = (await client.query(sql.findHuespedByCedula, [data.cedula])).rows[0]
      
      if (!huesped) {
        // Crear el huésped (id_huesped es la cédula)
        huesped = (await client.query(sql.createHuesped, [
          data.cedula,           // id_huesped (cédula)
          data.nombre_huesped,   // nombre
          data.direccion || '',  // direccion (opcional)
          data.fecha_nacimiento  // fecha_nacimiento
        ])).rows[0]

        // Crear el teléfono en tabla separada
        await client.query(sql.createTelefono, [
          huesped.id_huesped,
          data.telefono
        ])
      }

      // Crear la reserva
      const result = await client.query(sql.create, [
        data.fecha_inicio,
        data.fecha_fin,
        data.cantidad_personas,
        huesped.id_huesped,
        data.id_hotel,
        data.valor_total,
        data.incluye_mascotas === 'on'
      ])
      
      await client.query('COMMIT')
      return result.rows[0]
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  },

  cancel: async (id) => {
    await db.query(sql.cancel, [id])
  }
}
