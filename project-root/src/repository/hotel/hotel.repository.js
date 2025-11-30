// src/repository/hotel/hotel.repository.js
const db = require('../../db/pool')
const sql = require('../../db/sql/hoteles.sql')

module.exports = {
  findAll: async () => (await db.query(sql.findAll)).rows,
  findById: async id => (await db.query(sql.findById,[id])).rows[0],
  create: async d => (await db.query(sql.create,[d.nombre,d.direccion,d.anio_inauguracion,d.id_categoria])).rows[0],
  update: async (id,d) => (await db.query(sql.update,[d.nombre,d.direccion,d.anio_inauguracion,d.id_categoria,id])).rowCount,
  remove: async id => (await db.query(sql.remove,[id])).rowCount
}
