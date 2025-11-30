// src/repository/reportes/reportes.repository.js
const db = require('../../db/pool')
const sql = require('../../db/sql/reportes.sql')

module.exports = {
  // Reportes principales
  reservasPorPeriodo: async (fechaInicio, fechaFin) => 
    (await db.query(sql.reservasPorPeriodo, [fechaInicio, fechaFin])).rows,
  
  canceladasSinAnticipo: async () => 
    (await db.query(sql.canceladasSinAnticipo)).rows,
  
  noUsadasConAnticipo: async () => 
    (await db.query(sql.noUsadasConAnticipo)).rows,
  
  llegadaATiempo: async () => 
    (await db.query(sql.llegadaATiempo)).rows,
  
  menoresMascotas: async () => 
    (await db.query(sql.menoresMascotas)).rows,
  
  conServicios: async () => 
    (await db.query(sql.conServicios)).rows,

  // Estadísticas con vista materializada
  obtenerEstadisticas: async () => 
    (await db.query(sql.obtenerEstadisticas)).rows,

  refrescarEstadisticas: async () => 
    await db.query(sql.refrescarVistaMaterializada),

  // Historial de hotel
  historialCategoriasHotel: async (idHotel) => 
    (await db.query(sql.historialCategoriasHotel, [idHotel])).rows,

  // Funciones de base de datos
  calcularOcupacion: async (idHotel, fechaInicio, fechaFin) => 
    (await db.query('SELECT * FROM calcular_ocupacion_hotel($1, $2, $3)', 
      [idHotel, fechaInicio, fechaFin])).rows,

  cancelarReservasVencidas: async () => 
    (await db.query('SELECT * FROM cancelar_reservas_vencidas()')).rows
}
