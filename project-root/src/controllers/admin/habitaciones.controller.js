// src/controllers/admin/habitaciones.controller.js
const repo = require('../../repository/habitacion/habitacion.repository')
const hotelRepo = require('../../repository/hotel/hotel.repository')
const tipoRepo = require('../../repository/tipoHabitacion/tipoHabitacion.repository')

module.exports = {
  list: async (req,res) => res.render('layouts/admin',{view:'../admin/habitaciones/list',data:await repo.findAll()}),
  createForm: async (req,res) => res.render('layouts/admin',{view:'../admin/habitaciones/create',hoteles:await hotelRepo.findAll(),tipos:await tipoRepo.findAll()}),
  create: async (req,res) => {await repo.create(req.body);res.redirect('/admin/habitaciones')},
  editForm: async (req,res) => res.render('layouts/admin',{view:'../admin/habitaciones/edit',data:await repo.findById(req.params.id),hoteles:await hotelRepo.findAll(),tipos:await tipoRepo.findAll()}),
  update: async (req,res) => {await repo.update(req.params.id,req.body);res.redirect('/admin/habitaciones')},
  remove: async (req,res) => {await repo.remove(req.params.id);res.redirect('/admin/habitaciones')}
}
