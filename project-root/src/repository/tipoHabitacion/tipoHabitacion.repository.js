// src/repository/tipoHabitacion/tipoHabitacion.repository.js
const db = require('../../db/pool')
const sql = require('../../db/sql/tiposHabitacion.sql')

module.exports = {
  findAll: async () => (await db.query(sql.findAll)).rows,
  findById: async id => (await db.query(sql.findById,[id])).rows[0],
  create: async d => (await db.query(sql.create,[d.nombre,d.capacidad_max,d.precio])).rows[0],
  update: async (id,d) => (await db.query(sql.update,[d.nombre,d.capacidad_max,d.precio,id])).rowCount,
  remove: async id => (await db.query(sql.remove,[id])).rowCount
}
