// src/controllers/admin/reportes.controller.js
const repo = require('../../repository/reportes/reportes.repository')
const hotelRepo = require('../../repository/hotel/hotel.repository')

module.exports = {
  // Página principal de reportes
  index: (req, res) => res.render('layouts/admin', {
    view: '../admin/reportes/index'
  }),

  // Reporte 1: Reservas por período
  reservasPorPeriodo: async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query
    const data = fecha_inicio && fecha_fin 
      ? await repo.reservasPorPeriodo(fecha_inicio, fecha_fin)
      : []
    res.render('layouts/admin', {
      view: '../admin/reportes/periodo',
      data,
      filtros: { fecha_inicio, fecha_fin }
    })
  },

  // Reporte 2: Canceladas sin anticipo
  canceladasSinAnticipo: async (req, res) => {
    const data = await repo.canceladasSinAnticipo()
    res.render('layouts/admin', {
      view: '../admin/reportes/canceladasSinAnticipo',
      data
    })
  },

  // Reporte 3: No utilizadas con anticipo
  noUsadasConAnticipo: async (req, res) => {
    const data = await repo.noUsadasConAnticipo()
    res.render('layouts/admin', {
      view: '../admin/reportes/noUsadasConAnticipo',
      data
    })
  },

  // Reporte 4: Llegadas a tiempo
  llegadaATiempo: async (req, res) => {
    const data = await repo.llegadaATiempo()
    res.render('layouts/admin', {
      view: '../admin/reportes/llegadaATiempo',
      data
    })
  },

  // Reporte 5: Menores o mascotas
  menoresMascotas: async (req, res) => {
    const data = await repo.menoresMascotas()
    res.render('layouts/admin', {
      view: '../admin/reportes/menoresMascotas',
      data
    })
  },

  // Reporte 6: Con servicios adicionales
  conServicios: async (req, res) => {
    const data = await repo.conServicios()
    res.render('layouts/admin', {
      view: '../admin/reportes/conServicios',
      data
    })
  },

  // Estadísticas generales (vista materializada)
  estadisticas: async (req, res) => {
    await repo.refrescarEstadisticas() // Refrescar datos
    const data = await repo.obtenerEstadisticas()
    res.render('layouts/admin', {
      view: '../admin/reportes/estadisticas',
      data
    })
  },

  // Historial de categorías de hotel
  historialCategorias: async (req, res) => {
    const hoteles = await hotelRepo.findAll()
    const idHotel = req.query.id_hotel
    const data = idHotel ? await repo.historialCategoriasHotel(idHotel) : []
    res.render('layouts/admin', {
      view: '../admin/reportes/historialCategorias',
      data,
      hoteles,
      hotelSeleccionado: idHotel
    })
  },

  // Ocupación de hotel
  ocupacion: async (req, res) => {
    const { id_hotel, fecha_inicio, fecha_fin } = req.query
    const hoteles = await hotelRepo.findAll()
    const data = id_hotel && fecha_inicio && fecha_fin
      ? await repo.calcularOcupacion(id_hotel, fecha_inicio, fecha_fin)
      : []
    res.render('layouts/admin', {
      view: '../admin/reportes/ocupacion',
      data,
      hoteles,
      filtros: { id_hotel, fecha_inicio, fecha_fin }
    })
  }
}
