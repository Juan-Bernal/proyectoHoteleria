// src/repository/empleado/varios.repository.js
const db = require('../../db/pool')
const sqlHabitacion = require('../../db/sql/habitacion_empleado.sql')
const sqlHuesped = require('../../db/sql/huesped.sql')
const sqlConsultas = require('../../db/sql/consultas.sql')

module.exports = {
  // Habitaciones
  findAllHabitaciones: async () => (await db.query(sqlHabitacion.findAllWithStatus)).rows,
  updateHabitacionStatus: async (id, status) => await db.query(sqlHabitacion.updateStatus, [id, status]),

  // Huéspedes
  findAllHuespedes: async () => (await db.query(sqlHuesped.findAll)).rows,
  findHuespedById: async (id) => {
    const huesped = (await db.query(sqlHuesped.findById, [id])).rows[0]
    if (huesped) {
      huesped.historial = (await db.query(sqlHuesped.getHistory, [id])).rows
    }
    return huesped
  },
  createHuesped: async (data) => await db.query(sqlHuesped.create, [
    data.nombre, data.cedula, data.correo, data.telefono, data.fecha_nacimiento
  ]),

  // Consultas
  getReservasDelDia: async () => (await db.query(sqlConsultas.reservasDelDia)).rows,
  getLlegadasPendientes: async () => (await db.query(sqlConsultas.llegadasPendientes)).rows,
  getSalidasDelDia: async () => (await db.query(sqlConsultas.salidasDelDia)).rows,
  getPagosPendientes: async () => (await db.query(sqlConsultas.pagosPendientes)).rows
}
