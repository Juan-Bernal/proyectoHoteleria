// src/controllers/auth.controller.js
const userRepo = require('../repository/auth/usuario.repository')

module.exports = {
  loginForm: (req, res) => {
    res.render('auth/login', { error: null })
  },

  login: async (req, res) => {
    const { username, password } = req.body
    
    try {
      const user = await userRepo.findByUsername(username)
      
      if (!user || user.password !== password) {
        return res.render('auth/login', { error: 'Credenciales inválidas' })
      }

      // Guardar usuario en sesión
      req.session.user = {
        id: user.id_usuario,
        username: user.username,
        rol: user.rol
      }

      // Redireccionar según rol
      if (user.rol === 'ADMIN') {
        res.redirect('/admin')
      } else {
        res.redirect('/empleado')
      }
    } catch (error) {
      console.error(error)
      res.render('auth/login', { error: 'Error en el servidor' })
    }
  },

  logout: (req, res) => {
    req.session.destroy()
    res.redirect('/login')
  }
}
