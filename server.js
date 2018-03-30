const WebSocket = require('ws')
const Game = require('./game.js')
const { execFile } = require('child_process')

const env = require('node-env-file')
env(__dirname + '/.env')

const wss = new WebSocket.Server({ port: process.env.SERVERPORT })

let connections = []

let gameID = 0
let games = []
let consoleMessages = []

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

wss.on('connection', function connection(ws) {
  if (connections.length > 2) return

  ws.send(JSON.stringify({
    type: 'welcome',
    data: {}
  }))

  ws.on('message', message => {
    message = JSON.parse(message)
    switch (message.type) {
      case 'use deck':
        let deck = message.data.deck
        ws.deck = deck
        break
      case 'ready':
        ws.ready = true
        if (connections.every(x => x.ready)) {
          if (connections.length == 2) {
            //TODO: not working?
            ws.removeAllListeners('message')
            let game = new Game(gameID, connections, (text) => {
              log(gameID + ': ' + text)
            })
            games.push(game)
            game.start()

            connections = []
            gameID++
          }
        }
        break
      default:
        log('server: unrecognised message ', message)
        break
    }
  })

  ws.ready = false
  connections.push(ws)
})

function checkGames() {
  for (let game of games) {
    
  }
}

//////////////////////////////////////

function updateUI() {
  process.stdout.write('\033c')
  console.log(connections.length == 0 ? '' : ('players in queue: ' + connections.length))
  console.log(' --- GAMES --- ')
  for (let game of games) {
    console.log(game.id + ': ' + game.turnNumber)
  }

  for (let i = 0; i < 16 - games.length; i++) {
    console.log()
  }
  console.log(' --- LOG ---')

  //delete old log messages
  let maxAgeSeconds = 4
  let now = Date.now()
  consoleMessages = consoleMessages.filter(x => (now - x.timeAdded) < maxAgeSeconds * 1000)
  for (let msg of consoleMessages) {
    console.log(msg.text)
  }
}

function log(text) {
  consoleMessages.push({
    text: text,
    timeAdded: Date.now()
  })

  while(consoleMessages.length > 4) consoleMessages.shift()
}

setInterval(updateUI, 1000)