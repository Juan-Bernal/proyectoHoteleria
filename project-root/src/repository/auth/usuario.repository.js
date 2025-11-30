// src/repository/auth/usuario.repository.js
const db = require('../../db/pool')
const sql = require('../../db/sql/usuario.sql')

module.exports = {
  findByUsername: async (username) => {
    const result = await db.query(sql.findByUsername, [username])
    return result.rows[0]
  }
}
