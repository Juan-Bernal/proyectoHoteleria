// src/routes/empleado/habitaciones.routes.js
const { Router } = require('express')
const router = Router()
const controller = require('../../controllers/empleado/varios.controller')

router.get('/', controller.listarHabitaciones)
router.post('/:id/estado', controller.cambiarEstadoHabitacion)

module.exports = router
