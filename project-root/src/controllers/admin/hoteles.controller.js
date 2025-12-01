// src/controllers/admin/hoteles.controller.js
const repo = require('../../repository/hotel/hotel.repository')

module.exports = {
  list: async (req,res) => res.render('layouts/admin',{view:'../admin/hoteles/list',data:await repo.findAll(), active: 'hoteles'}),
  createForm: (req,res) => res.render('layouts/admin',{view:'../admin/hoteles/create', active: 'hoteles'}),
  create: async (req,res) => {await repo.create(req.body);res.redirect('/admin/hoteles')},
  editForm: async (req,res) => res.render('layouts/admin',{view:'../admin/hoteles/edit',data:await repo.findById(req.params.id), active: 'hoteles'}),
  update: async (req,res) => {await repo.update(req.params.id,req.body);res.redirect('/admin/hoteles')},
  remove: async (req,res) => {await repo.remove(req.params.id);res.redirect('/admin/hoteles')}
}
