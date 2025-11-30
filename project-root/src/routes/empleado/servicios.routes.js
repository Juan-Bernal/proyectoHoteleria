// src/routes/empleado/servicios.routes.js
const { Router } = require('express')
const router = Router()
const controller = require('../../controllers/empleado/servicios.controller')

router.get('/registrar', controller.registrarForm)
router.post('/registrar', controller.registrar)
router.get('/consultar', controller.consultar)

module.exports = router
