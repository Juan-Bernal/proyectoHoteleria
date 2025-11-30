// src/db/sql/servicio.sql.js
module.exports = {
  findAll: `
    SELECT id_servicio, nombre, descripcion, precio
    FROM Servicio
    ORDER BY id_servicio DESC`,
  findById: `SELECT * FROM Servicio WHERE id_servicio = $1`,
  create: `INSERT INTO Servicio (nombre, descripcion, precio)
           VALUES ($1, $2, $3) RETURNING id_servicio`,
  update: `UPDATE Servicio SET nombre=$1, descripcion=$2, precio=$3
           WHERE id_servicio=$4`,
  remove: `DELETE FROM Servicio WHERE id_servicio=$1`
}
