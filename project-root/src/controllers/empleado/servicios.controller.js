// src/controllers/empleado/servicios.controller.js
const repo = require('../../repository/consumo/consumo.repository')

module.exports = {
  registrarForm: async (req, res) => {
    const reservas = await repo.findActiveReservations()
    const servicios = await repo.findAllServices()
    
    // Si viene un ID de reserva en query, cargamos sus consumos
    let consumos = []
    let reservaSeleccionada = null
    if (req.query.id_reserva) {
      consumos = await repo.getConsumosByReserva(req.query.id_reserva)
      reservaSeleccionada = req.query.id_reserva
    }

    res.render('layouts/empleado', {
      view: '../empleado/servicios/registrar',
      data: { reservas, servicios, consumos, reservaSeleccionada }
    })
  },

  registrar: async (req, res) => {
    try {
      await repo.addConsumo(req.body)
      res.redirect(`/empleado/servicios/registrar?id_reserva=${req.body.id_reserva}`)
    } catch (error) {
      console.error(error)
      res.send('Error al registrar consumo')
    }
  },

  consultar: async (req, res) => {
    // Reutilizamos la lógica pero solo para ver
    const reservas = await repo.findActiveReservations()
    let consumos = []
    let reservaSeleccionada = null
    if (req.query.id_reserva) {
      consumos = await repo.getConsumosByReserva(req.query.id_reserva)
      reservaSeleccionada = req.query.id_reserva
    }

    res.render('layouts/empleado', {
      view: '../empleado/servicios/consultar',
      data: { reservas, consumos, reservaSeleccionada }
    })
  }
}
