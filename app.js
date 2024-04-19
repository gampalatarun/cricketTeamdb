const express = require('express')
const app = express()

const sqlite3 = require('sqlite3')
const {open} = require('sqlite')

const path = require('path')
const dbpath = path.join(__dirname, 'cricketTeam.db')
let db = null

//instializeDBandserver

const instializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`Dbserver ${e.message}`)
    process.exit(1)
  }
}

instializeDBandServer()

const convetsnakecaseToCamelCase = db => {
  return {
    playerId: db.player_id,
    playerName: db.player_name,
    jerseyNumber: db.jersey_number,
    role: db.role,
  }
}
app.get('/players/', async (request, response) => {
  const playersQuery = `
    SELECT
    *
    FROM 
    
    cricket_team;
    `
  const allplayer = await db.all(playersQuery)
  response.send(
    allplayer.map(eachplayer => convetsnakecaseToCamelCase(eachplayer)),
  )
})

//API 3
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params

  const basesonPLayeridQuery = `
  SELECT * FROM cricket_team WHERE player_id=${playerId};
  `
  const playeridarray = await db.all(basesonPLayeridQuery)
  response.send(
    playeridarray.map(eachplayer => convetsnakecaseToCamelCase(eachplayer)),
  )
})

module.exports = app

//API 5

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `
  DELETE FROM cricket_team WHERE player_id=${playerId};
  `
  await db.run(deleteQuery)
  response.send('Player Removed')
})
