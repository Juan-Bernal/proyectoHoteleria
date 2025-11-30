// src/db/sql/habitaciones.sql.js
module.exports = {
  findAll: `
    SELECT hab.id_habitacion, hab.numero_habitacion, hab.nro_piso,
           h.nombre AS hotel, t.nombre AS tipo
    FROM Habitacion hab
    JOIN Hotel h ON h.id_hotel=hab.id_hotel
    JOIN TipoHabitacion t ON t.id_tipo_habitacion=hab.id_tipo_habitacion
    ORDER BY hab.id_habitacion DESC`,
  findById: `SELECT * FROM Habitacion WHERE id_habitacion=$1`,
  create: `INSERT INTO Habitacion (id_hotel,id_tipo_habitacion,numero_habitacion,nro_piso)
           VALUES ($1,$2,$3,$4) RETURNING id_habitacion`,
  update: `UPDATE Habitacion SET id_hotel=$1,id_tipo_habitacion=$2,
           numero_habitacion=$3,nro_piso=$4 WHERE id_habitacion=$5`,
  remove: `DELETE FROM Habitacion WHERE id_habitacion=$1`
}
