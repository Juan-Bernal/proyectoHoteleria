// src/repository/servicio/servicio.repository.js
const db = require('../../db/pool')
const sql = require('../../db/sql/servicio.sql')

module.exports = {
  findAll: async () => (await db.query(sql.findAll)).rows,
  findById: async id => (await db.query(sql.findById,[id])).rows[0],
  create: async d => (await db.query(sql.create,[d.nombre,d.descripcion,d.precio])).rows[0],
  update: async (id,d) => (await db.query(sql.update,[d.nombre,d.descripcion,d.precio,id])).rowCount,
  remove: async id => (await db.query(sql.remove,[id])).rowCount
}
