// src/controllers/empleado/checkout.controller.js
const repo = require('../../repository/checkout/checkout.repository')
const consumoRepo = require('../../repository/consumo/consumo.repository')

module.exports = {
  list: async (req, res) => {
    const reservas = await repo.findActiveReservations()
    res.render('layouts/empleado', {
      view: '../empleado/checkout/list',
      data: reservas
    })
  },

  processForm: async (req, res) => {
    const summary = await repo.getAccountSummary(req.params.id)
    const consumos = await consumoRepo.getConsumosByReserva(req.params.id)
    
    // Calcular saldo pendiente
    const totalGeneral = parseFloat(summary.total_hospedaje) + parseFloat(summary.total_servicios)
    const saldoPendiente = totalGeneral - parseFloat(summary.total_pagado)

    res.render('layouts/empleado', {
      view: '../empleado/checkout/process',
      data: { 
        id_reserva: req.params.id,
        summary, 
        consumos, 
        saldoPendiente: saldoPendiente.toFixed(2),
        totalGeneral: totalGeneral.toFixed(2)
      }
    })
  },

  process: async (req, res) => {
    try {
      await repo.processCheckout(req.body)
      res.redirect('/empleado/checkout')
    } catch (error) {
      console.error(error)
      res.send('Error al procesar check-out: ' + error.message)
    }
  }
}
