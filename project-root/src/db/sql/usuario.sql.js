// src/db/sql/usuario.sql.js
module.exports = {
  findByUsername: 'SELECT * FROM Usuario WHERE username = $1',
  findById: 'SELECT * FROM Usuario WHERE id_usuario = $1'
}
