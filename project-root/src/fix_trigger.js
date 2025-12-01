require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const db = require('./db/pool');

const fixQuery = `
CREATE OR REPLACE FUNCTION generar_codigo_reserva()
RETURNS TRIGGER AS $$
DECLARE
    fecha TEXT;
    cedula5 TEXT;
BEGIN
    -- Obtener la fecha en formato YYYYMMDD
    fecha := to_char(NEW.fecha_reserva, 'YYYYMMDD');

    -- Obtener los primeros 5 dígitos de la cédula del huésped responsable
    SELECT substring(id_huesped::text FROM 1 FOR 5)
    INTO cedula5
    FROM Huesped
    WHERE id_huesped = NEW.id_huesped_responsable;

    -- Concatenar la fecha con los primeros 5 dígitos de la cédula
    -- CORRECTION: Using id_reserva instead of codigo_reserva
    NEW.id_reserva := (fecha || cedula5)::BIGINT;

    -- Devolver el nuevo registro con el código de reserva generado
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

async function applyFix() {
  try {
    console.log('Applying fix for generar_codigo_reserva...');
    await db.query(fixQuery);
    console.log('Function updated successfully!');
  } catch (error) {
    console.error('Error applying fix:', error);
  } finally {
    // We can't easily close the pool from here if it's not exposed, 
    // but the script will exit eventually or we can force it.
    // Looking at pool.js, it doesn't export an 'end' method, but we can rely on process exit.
    process.exit(0);
  }
}

applyFix();
