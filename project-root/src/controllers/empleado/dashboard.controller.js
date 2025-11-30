// src/controllers/empleado/dashboard.controller.js
module.exports = {
  index: (req, res) => {
    res.render('layouts/empleado', {
      view: '../empleado/dashboard',
      data: {}
    })
  },
  placeholder: (req, res) => {
    // Extraer el título de la URL para mostrar en qué sección estamos
    const section = req.originalUrl.split('/')[2] || 'Sección'
    const title = section.charAt(0).toUpperCase() + section.slice(1)
    
    res.render('layouts/empleado', {
      view: '../empleado/construction',
      data: { title: title }
    })
  }
}
