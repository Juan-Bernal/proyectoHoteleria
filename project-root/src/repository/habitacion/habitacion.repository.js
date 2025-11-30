// src/repository/habitacion/habitacion.repository.js
const db = require('../../db/pool')
const sql = require('../../db/sql/habitaciones.sql')

module.exports = {
  findAll: async () => (await db.query(sql.findAll)).rows,
  findById: async id => (await db.query(sql.findById,[id])).rows[0],
  create: async d => (await db.query(sql.create,[d.id_hotel,d.id_tipo_habitacion,d.numero_habitacion,d.nro_piso])).rows[0],
  update: async (id,d) => (await db.query(sql.update,[d.id_hotel,d.id_tipo_habitacion,d.numero_habitacion,d.nro_piso,id])).rowCount,
  remove: async id => (await db.query(sql.remove,[id])).rowCount
}
