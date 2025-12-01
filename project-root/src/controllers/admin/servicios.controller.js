// src/controllers/admin/servicios.controller.js
const repo = require('../../repository/servicio/servicio.repository')

module.exports = {
  list: async (req,res) => res.render('layouts/admin',{view:'../admin/servicios/list',data:await repo.findAll(), active: 'servicios'}),
  createForm: (req,res) => res.render('layouts/admin',{view:'../admin/servicios/create', active: 'servicios'}),
  create: async (req,res) => {await repo.create(req.body);res.redirect('/admin/servicios')},
  editForm: async (req,res) => res.render('layouts/admin',{view:'../admin/servicios/edit',data:await repo.findById(req.params.id), active: 'servicios'}),
  update: async (req,res) => {await repo.update(req.params.id,req.body);res.redirect('/admin/servicios')},
  remove: async (req,res) => {await repo.remove(req.params.id);res.redirect('/admin/servicios')}
}
