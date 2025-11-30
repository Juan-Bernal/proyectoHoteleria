// src/routes/admin/hoteles.routes.js
const {Router} = require('express')
const c = require('../../controllers/admin/hoteles.controller')
const r = Router()

r.get('/',c.list)
r.get('/create',c.createForm)
r.post('/create',c.create)
r.get('/:id/edit',c.editForm)
r.post('/:id/edit',c.update)
r.post('/:id/delete',c.remove)

module.exports = r
