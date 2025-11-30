// src/routes/dashboard.routes.js
const { Router } = require('express')
const router = Router()
const controller = require('../controllers/dashboard/dashboard.controller')

// Dashboard principal
router.get('/', controller.index)

// Habitaciones de un hotel
router.get('/hotel/:id', controller.hotelRooms)

// Detalle de habitación
router.get('/habitacion/:id', controller.roomDetails)

// Formulario de reserva
router.get('/reservar/:id', controller.bookingForm)

// Procesar reserva (mostrar pago)
router.post('/reservar', controller.processPayment)


// Procesar pago y confirmar
router.post('/pago', controller.processPayment)

module.exports = router;
