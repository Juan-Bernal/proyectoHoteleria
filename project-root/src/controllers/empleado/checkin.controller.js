// src/controllers/empleado/checkin.controller.js
const repo = require('../../repository/checkin/checkin.repository')

module.exports = {
  list: async (req, res) => {
    const reservas = await repo.findPendingToday()
    res.render('layouts/empleado', {
      view: '../empleado/checkin/list',
      data: reservas
    })
  },

  processForm: async (req, res) => {
    const reserva = await repo.findReservaDetails(req.params.id)
    if (!reserva) return res.redirect('/empleado/checkin')

    const habitacionesDisponibles = await repo.findAvailableRooms(
      reserva.id_hotel, 
      reserva.fecha_inicio, 
      reserva.fecha_fin
    )

    res.render('layouts/empleado', {
      view: '../empleado/checkin/process',
      data: { reserva, habitacionesDisponibles }
    })
  },

  process: async (req, res) => {
    try {
      await repo.processCheckin(req.body)
      res.redirect('/empleado/checkin')
    } catch (error) {
      console.error(error)
      res.send('Error al procesar check-in: ' + error.message)
    }
  }
}
