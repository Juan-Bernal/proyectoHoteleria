// src/repository/consumo/consumo.repository.js
const db = require('../../db/pool')
const sql = require('../../db/sql/consumo.sql')

module.exports = {
  findActiveReservations: async () => (await db.query(sql.findActiveReservations)).rows,
  
  findAllServices: async () => (await db.query(sql.findAllServices)).rows,

  getConsumosByReserva: async (idReserva) => 
    (await db.query(sql.getConsumosByReserva, [idReserva])).rows,

  addConsumo: async (data) => {
    await db.query(sql.addConsumo, [
      data.id_reserva,
      data.id_servicio,
      data.cantidad
    ])
  }
}
