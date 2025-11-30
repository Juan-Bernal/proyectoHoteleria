// src/routes/empleado/checkin.routes.js
const { Router } = require('express')
const router = Router()
const controller = require('../../controllers/empleado/checkin.controller')

router.get('/', controller.list)
router.get('/:id/procesar', controller.processForm)
router.post('/procesar', controller.process)

module.exports = router
