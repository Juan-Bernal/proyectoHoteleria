// src/routes/empleado/dashboard.routes.js
const { Router } = require('express')
const router = Router()
const controller = require('../../controllers/empleado/dashboard.controller')

router.get('/', controller.index)

// Rutas para las secciones del menú (Placeholder)
// Rutas para las secciones del menú
router.use('/reservas', require('./reservas.routes'))
router.use('/checkin', require('./checkin.routes'))
router.use('/checkout', require('./checkout.routes'))
router.use('/servicios', require('./servicios.routes'))
router.use('/habitaciones', require('./habitaciones.routes'))
router.use('/huespedes', require('./huespedes.routes'))
router.use('/consultas', require('./consultas.routes'))

module.exports = router
