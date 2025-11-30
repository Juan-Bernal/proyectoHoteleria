// src/routes/admin/reportes.routes.js
const {Router} = require('express')
const c = require('../../controllers/admin/reportes.controller')
const r = Router()

// Página principal
r.get('/', c.index)

// Reportes del caso de estudio
r.get('/periodo', c.reservasPorPeriodo)
r.get('/canceladas-sin-anticipo', c.canceladasSinAnticipo)
r.get('/no-usadas-con-anticipo', c.noUsadasConAnticipo)
r.get('/llegada-a-tiempo', c.llegadaATiempo)
r.get('/menores-mascotas', c.menoresMascotas)
r.get('/con-servicios', c.conServicios)

// Reportes adicionales
r.get('/estadisticas', c.estadisticas)
r.get('/historial-categorias', c.historialCategorias)
r.get('/ocupacion', c.ocupacion)

module.exports = r
