// src/app.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const express = require('express')
const session = require('express-session')
const path = require('path')
const authMiddleware = require('./middleware/auth.middleware')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Configurar UTF-8 para todas las respuestas
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  next()
})

// Configuración de sesión
app.use(session({
  secret: 'secreto_super_seguro', // En producción usar variable de entorno
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true si usamos https
}))

// Rutas Públicas del Dashboard (ANTES de las rutas protegidas)
app.use('/dashboard', require('./routes/dashboard.routes'))

// Rutas de autenticación
app.use('/', require('./routes/auth.routes'))

// Rutas de Administrador (Protegidas)
app.use('/admin', authMiddleware.hasRole('ADMIN'))
app.get('/admin', (req, res) => res.render('layouts/admin', { view: '../admin/dashboard', data: {} }))
app.use('/admin/hoteles', require('./routes/admin/hoteles.routes'))
app.use('/admin/tipos', require('./routes/admin/tipos.routes'))
app.use('/admin/habitaciones', require('./routes/admin/habitaciones.routes'))
app.use('/admin/servicios', require('./routes/admin/servicios.routes'))
app.use('/admin/reportes', require('./routes/admin/reportes.routes'))

// Rutas de Empleado (Protegidas)
app.use('/empleado', authMiddleware.hasRole('EMPLEADO'))
app.use('/empleado', require('./routes/empleado/dashboard.routes'))

// Redirección raíz
app.get('/', (req, res) => {
  if (req.session.user) {
    if (req.session.user.rol === 'ADMIN') return res.redirect('/admin')
    if (req.session.user.rol === 'EMPLEADO') return res.redirect('/empleado')
  }
  res.redirect('/dashboard') // Redirigir a dashboard público
})

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
