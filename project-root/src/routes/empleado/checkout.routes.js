// src/routes/empleado/checkout.routes.js
const { Router } = require('express')
const router = Router()
const controller = require('../../controllers/empleado/checkout.controller')

router.get('/', controller.list)
router.get('/:id/procesar', controller.processForm)
router.post('/procesar', controller.process)

// Redirecciones para submenús
router.get('/servicios', (req, res) => res.redirect('/empleado/servicios/registrar'))
router.get('/total', (req, res) => res.redirect('/empleado/checkout'))
router.get('/disponibilidad', (req, res) => res.redirect('/empleado/checkout'))
router.get('/finalizar', (req, res) => res.redirect('/empleado/checkout'))


module.exports = router
