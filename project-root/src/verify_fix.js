require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const db = require('./db/pool');

async function verifyFix() {
  try {
    const res = await db.query("SELECT prosrc FROM pg_proc WHERE proname = 'generar_codigo_reserva'");
    console.log('Function definition:');
    console.log(res.rows[0].prosrc);
  } catch (error) {
    console.error('Error verifying fix:', error);
  } finally {
    process.exit(0);
  }
}

verifyFix();
