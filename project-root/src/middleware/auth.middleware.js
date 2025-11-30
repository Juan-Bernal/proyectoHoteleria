// src/middleware/auth.middleware.js
module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      return next()
    }
    res.redirect('/login')
  },

  hasRole: (role) => {
    return (req, res, next) => {
      if (req.session && req.session.user && req.session.user.rol === role) {
        return next()
      }
      // Si está logueado pero no tiene el rol, redirigir a su dashboard correspondiente
      if (req.session && req.session.user) {
        if (req.session.user.rol === 'ADMIN') return res.redirect('/admin')
        if (req.session.user.rol === 'EMPLEADO') return res.redirect('/empleado')
      }
      res.redirect('/login')
    }
  }
}
