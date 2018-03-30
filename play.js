

const deck = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 5, 6]


//////////////////

const env = require('node-env-file')
env(__dirname + '/.env')

const WebSocket = require('ws')
const ws = new WebSocket('ws://' + process.env.SERVERIP + ':' + process.env.SERVERPORT)

ws.on('open', function open() {

})

ws.on('message', function incoming(data) {
  data = JSON.parse(data)
  switch (data.type) {
    case 'welcome':
      console.log('CONNECTED TO GAME SERVER')
      if (deck.length > 0) {
        console.log('sending custom deck ' + deck)
        ws.send(JSON.stringify({
          type: 'use deck',
          data: {
            deck: deck
          }
        }))
      }
      ws.send(JSON.stringify({
        type: 'ready',
        data: {}
      }))
      break
    case 'state':
      update(data.data)
      break
    case 'win':
      win(data.data.playerID)
      break
    default:
      console.log('unknown message: ', data)
      process.exit(1)
      break
  }
})

let myID = undefined
let myTurn = false

let me = undefined
let enemy = undefined

let lastTurnInfo = undefined

let playQueue = []

let cards = require('./cardslist.js').map(x => x())

function update(state) {
  process.stdout.write('\033c')

  lastTurnInfo = state.lastTurnInfo

  myID = state.myID
  myTurn = state.myTurn

  me = state.me
  enemy = state.enemy

  console.log('your health: ' + me.health + ' (last turn +' + lastTurnInfo.players[myID].heal + '/-' + lastTurnInfo.players[myID].damage + ')')
  console.log('opponent health: ' + enemy.health + ' (last turn +' + lastTurnInfo.players[(myID + 1) % 2].heal + '/-' + lastTurnInfo.players[(myID + 1) % 2].damage + ')')
  console.log('your powers:', me.powers.map(x => getCardInfo(x).name.split(' ').map(word => word.charAt(0)).join('')).join(''))
  console.log('opponent powers:', enemy.powers.map(x => {
    if (x == -1) {
      return '?'
    } else {
      return getCardInfo(x).name.split(' ').map(word => word.charAt(0)).join('')
    }
  }).join(' '))

  console.log()
  for (let event of lastTurnInfo.events) {
    switch (event.event) {
      case 'card played':
        console.log((event.player == myID ? 'You' : 'Opponent') + ' played ' + getCardInfo(event.card).name)
        break
      case 'power played':
        console.log((event.player == myID ? 'You' : 'Opponent') + ' played a power')
        break
      case 'power revealed':
        console.log((event.player == myID ? 'Your' : 'Opponent\'s') + ' power was revealed: ' + getCardInfo(event.card).name)
        break
      default:
        console.log('unrecognised turn event: ' + event.event)
        process.exit(1)
        break
    }
  }

  if (myTurn) {
    console.log()
    console.log('YOUR TURN! ENERGY: ' + me.energy)
    for (let cardID of me.hand) {
      let card = getCardInfo(cardID)
      console.log(card.id + ': ' + card.name + ' (' + card.cost + (card.isPower ? ' P' : '') + ')')
      console.log('    ' + card.description)
    }
  } else {
    console.log('WAITING FOR OTHER PLAYER...')
  }
  console.log()
}

function playCard(id) {
  playQueue.push(id)
}

function endTurn() {
  ws.send(JSON.stringify({
    type: 'play',
    data: {
      playerID: myID,
      cardIDs: playQueue
    }
  }))
  playQueue = []
}

function getCardInfo(id) {
  return cards.find(x => x.id == id)
}

function win(playerID) {
  console.log(playerID == myID ? 'YOU WIN' : 'OPPONENT WINS')
  process.exit(0)
}


let stdin = process.openStdin()
stdin.addListener("data", function (d) {
  if (myTurn) {
    let ids = d.toString().trim().split(' ').map(x => parseInt(x))
    let played = ids.map(x => getCardInfo(x))

    let hC = hasCards(ids)
    if (hC.result == false) {
      console.log('could not play card ' + hC.card)
      return
    }

    let hE = hasEnergy(ids)
    if (hE.result == false) {
      console.log('playing those cards would cost you ' + hE.needed + ' mana, but you only have ' + hE.has)
      return
    }


    for (let id of ids) {
      playCard(id)
    }
    endTurn()
  }
})

function hasCards(ids) {
  let hand = me.hand.slice(0)
  for (let id of ids) {
    let index = hand.findIndex(x => x == id)
    if (index == -1) {
      return {
        result: false,
        card: id
      }
    }
    hand.splice(index, 1)
  }

  return {
    result: true
  }
}

function hasEnergy(ids) {
  let totalCost = 0
  let played = ids.map(x => getCardInfo(x))
  for (let card of played) totalCost += card.cost
  if (totalCost > me.energy) {
    return {
      result: false,
      needed: totalCost,
      has: me.energy
    }
  } else {
    return {
      result: true
    }
  }
}