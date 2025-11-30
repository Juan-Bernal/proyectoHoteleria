// src/routes/empleado/huespedes.routes.js
const { Router } = require('express')
const router = Router()
const controller = require('../../controllers/empleado/varios.controller')

router.get('/', controller.listarHuespedes)
router.get('/crear', controller.crearHuespedForm)
router.post('/crear', controller.crearHuesped)
router.get('/:id', controller.verHuesped)

module.exports = router
