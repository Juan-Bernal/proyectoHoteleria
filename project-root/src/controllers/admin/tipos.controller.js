// src/controllers/admin/tipos.controller.js
const repo = require('../../repository/tipoHabitacion/tipoHabitacion.repository')

module.exports = {
  list: async (req,res) => res.render('layouts/admin',{view:'../admin/tipos/list',data:await repo.findAll(), active: 'tipos'}),
  createForm: (req,res) => res.render('layouts/admin',{view:'../admin/tipos/create', active: 'tipos'}),
  create: async (req,res) => {await repo.create(req.body);res.redirect('/admin/tipos')},
  editForm: async (req,res) => res.render('layouts/admin',{view:'../admin/tipos/edit',data:await repo.findById(req.params.id), active: 'tipos'}),
  update: async (req,res) => {await repo.update(req.params.id,req.body);res.redirect('/admin/tipos')},
  remove: async (req,res) => {await repo.remove(req.params.id);res.redirect('/admin/tipos')}
}
