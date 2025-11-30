// src/db/sql/hoteles.sql.js
module.exports = {
  findAll: `
    SELECT h.id_hotel, h.nombre, h.direccion, h.anio_inauguracion,
           h.id_categoria, c.nombre AS categoria
    FROM Hotel h
    LEFT JOIN Categoria c ON c.id_categoria = h.id_categoria
    ORDER BY h.id_hotel DESC`,
  findById: `SELECT * FROM Hotel WHERE id_hotel = $1`,
  create: `INSERT INTO Hotel (nombre, direccion, anio_inauguracion, id_categoria)
           VALUES ($1,$2,$3,$4) RETURNING id_hotel`,
  update: `UPDATE Hotel SET nombre=$1, direccion=$2, anio_inauguracion=$3, id_categoria=$4
           WHERE id_hotel=$5`,
  remove: `DELETE FROM Hotel WHERE id_hotel=$1`
}
