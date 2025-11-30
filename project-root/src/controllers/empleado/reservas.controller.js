// src/controllers/empleado/reservas.controller.js
const repo = require('../../repository/reserva/reserva.repository')
const hotelRepo = require('../../repository/hotel/hotel.repository')

module.exports = {
  list: async (req, res) => {
    const reservas = await repo.findAll()
    res.render('layouts/empleado', {
      view: '../empleado/reservas/list',
      data: reservas
    })
  },

  createForm: async (req, res) => {
    const hoteles = await hotelRepo.findAll()
    res.render('layouts/empleado', {
      view: '../empleado/reservas/create',
      data: { hoteles }
    })
  },

  create: async (req, res) => {
    try {
      await repo.create(req.body)
      res.redirect('/empleado/reservas')
    } catch (error) {
      console.error(error)
      res.send('Error al crear reserva: ' + error.message)
    }
  },

  cancel: async (req, res) => {
    await repo.cancel(req.params.id)
    res.redirect('/empleado/reservas')
  }
}
