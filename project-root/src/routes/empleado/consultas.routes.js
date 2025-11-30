// src/routes/empleado/consultas.routes.js
const { Router } = require('express')
const router = Router()
const controller = require('../../controllers/empleado/varios.controller')

router.get('/', controller.consultasDashboard)

module.exports = router
