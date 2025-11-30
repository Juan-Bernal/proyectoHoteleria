// src/controllers/empleado/varios.controller.js
const repo = require('../../repository/empleado/varios.repository')

module.exports = {
  // Habitaciones
  listarHabitaciones: async (req, res) => {
    const habitaciones = await repo.findAllHabitaciones()
    res.render('layouts/empleado', {
      view: '../empleado/habitaciones/list',
      data: habitaciones
    })
  },
  cambiarEstadoHabitacion: async (req, res) => {
    await repo.updateHabitacionStatus(req.params.id, req.body.estado)
    res.redirect('/empleado/habitaciones')
  },

  // Huéspedes
  listarHuespedes: async (req, res) => {
    const huespedes = await repo.findAllHuespedes()
    res.render('layouts/empleado', {
      view: '../empleado/huespedes/list',
      data: huespedes
    })
  },
  crearHuespedForm: (req, res) => {
    res.render('layouts/empleado', {
      view: '../empleado/huespedes/create',
      data: {}
    })
  },
  crearHuesped: async (req, res) => {
    try {
      await repo.createHuesped(req.body)
      res.redirect('/empleado/huespedes')
    } catch (error) {
      res.send('Error al crear huésped: ' + error.message)
    }
  },
  verHuesped: async (req, res) => {
    const huesped = await repo.findHuespedById(req.params.id)
    res.render('layouts/empleado', {
      view: '../empleado/huespedes/view',
      data: huesped
    })
  },

  // Consultas
  consultasDashboard: async (req, res) => {
    const tipo = req.query.tipo || 'llegadas'
    let resultados = []
    let titulo = ''

    switch(tipo) {
      case 'reservas':
        resultados = await repo.getReservasDelDia()
        titulo = 'Reservas Realizadas Hoy'
        break
      case 'llegadas':
        resultados = await repo.getLlegadasPendientes()
        titulo = 'Llegadas Pendientes (Hoy)'
        break
      case 'salidas':
        resultados = await repo.getSalidasDelDia()
        titulo = 'Salidas Programadas (Hoy)'
        break
      case 'pagos':
        resultados = await repo.getPagosPendientes()
        titulo = 'Saldos Pendientes de Cobro'
        break
    }

    res.render('layouts/empleado', {
      view: '../empleado/consultas/dashboard',
      data: { resultados, tipo, titulo }
    })
  }
}
