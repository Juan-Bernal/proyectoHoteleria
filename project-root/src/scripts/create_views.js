require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') })
const db = require('../db/pool')
const vistas = require('../db/sql/vistas.sql')

async function createViews() {
  console.log('Creating views...')
  const client = await db.getClient()
  try {
    await client.query('BEGIN')
    
    for (const [nombre, query] of Object.entries(vistas)) {
      console.log(`Creating view: ${nombre}`)
      try {
        await client.query(query)
        console.log(`View ${nombre} created successfully`)
      } catch (err) {
        console.error(`Error creating view ${nombre}:`, err.message)
      }
    }

    await client.query('COMMIT')
    console.log('Finished creating views')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Critical error:', error)
  } finally {
    client.release()
    process.exit()
  }
}

createViews()
