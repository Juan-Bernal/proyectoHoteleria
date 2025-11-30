// src/db/sql/tiposHabitacion.sql.js
module.exports = {
  findAll: `SELECT * FROM TipoHabitacion ORDER BY id_tipo_habitacion DESC`,
  findById: `SELECT * FROM TipoHabitacion WHERE id_tipo_habitacion=$1`,
  create: `INSERT INTO TipoHabitacion (nombre, capacidad_max, precio)
           VALUES ($1,$2,$3) RETURNING id_tipo_habitacion`,
  update: `UPDATE TipoHabitacion SET nombre=$1, capacidad_max=$2, precio=$3
           WHERE id_tipo_habitacion=$4`,
  remove: `DELETE FROM TipoHabitacion WHERE id_tipo_habitacion=$1`
}
