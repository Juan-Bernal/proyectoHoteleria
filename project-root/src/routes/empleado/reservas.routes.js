// src/routes/empleado/reservas.routes.js
const { Router } = require('express')
const router = Router()
const controller = require('../../controllers/empleado/reservas.controller')

router.get('/', controller.list)
router.get('/crear', controller.createForm)
router.post('/crear', controller.create)
router.post('/:id/cancelar', controller.cancel)

module.exports = router
