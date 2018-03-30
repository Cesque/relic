const Player = require('./player.js')
const cardFactory = require('./cardslist.js')
const cards = cardFactory.map(x => x())

class Game {
  constructor(id, connections, log) {
    this.log = log

    this.id = id
    this.players = []
    this.turn = -1
    this.turnNumber = 0

    this.polarity = 0

    this.lastTurnInfo = {
      players: [
        {
          heal: 0,
          damage: 0,
        },
        {
          heal: 0,
          damage: 0,
        },
      ],
      events: []
    }
    // init players
    this.players.push(new Player(this))
    this.players.push(new Player(this))

    this.players[0].enemy = this.players[1]
    this.players[1].enemy = this.players[0]

    this.players[0].id = 0
    this.players[1].id = 1

    this.players[0].connection = connections[0]
    this.players[1].connection = connections[1]

    if (connections[0].deck) {
      this.players[0].deck = connections[0].deck.map(x => cardFactory.find(y => y().id == x)())
    }
    if (connections[1].deck) {
      this.players[1].deck = connections[1].deck.map(x => cardFactory.find(y => y().id == x)())
    }

    delete connections[0].deck
    delete connections[1].deck
    delete connections[0].ready
    delete connections[1].ready

    // assign message listeners
    for (let player of this.players) {
      player.connection.on('message', message => {
        message = JSON.parse(message)
        switch (message.type) {
          case 'play':
            this.play(player.id, message.data.cardIDs)
            break
          default:
            this.log('unrecognised message ', message)
            break
        }
      })
    }
  }

  broadcastGameState() {
    for (let i = 0; i < 2; i++) {
      let me = this.players[i]
      let enemy = this.players[(i + 1) % 2]

      let meObj = {}
      meObj.id = me.id
      meObj.health = me.health
      meObj.deck = me.deck.map(x => x.id)
      meObj.hand = me.hand.map(x => x.id)
      meObj.powers = me.powers.map(x => x.id)
      meObj.energy = me.energy

      let enemyObj = {}
      enemyObj.id = enemy.id
      enemyObj.health = enemy.health
      enemyObj.deck = enemy.deck.map(x => x.id)
      enemyObj.hand = enemy.hand.map(x => x.id)
      enemyObj.powers = enemy.powers.map(x => x.isRevealed ? x.id : -1)
      enemyObj.energy = enemy.energy

      me.connection.send(JSON.stringify(
        {
          type: 'state',
          data: {
            lastTurnInfo: this.lastTurnInfo,
            turnNumber: this.turnNumber,
            myID: i,
            myTurn: this.turn == i,
            me: meObj,
            enemy: enemyObj
          }
        }
      ))
    }

    // this.players[0].connection.send(JSON.stringify(
    //   {
    //     type: 'state',
    //     data: {
    //       turnNumber: this.turnNumber,
    //       myID: 0,
    //       myTurn: this.turn == 0,
    //       me: p1,
    //       enemy: p2
    //     }
    //   }
    // ))

    // this.players[1].connection.send(JSON.stringify(
    //   {
    //     type: 'state',
    //     data: {
    //       turnNumber: this.turnNumber,
    //       myID: 1,
    //       myTurn: this.turn == 1,
    //       me: p2,
    //       enemy: p1
    //     }
    //   }
    // ))
  }

  flip() {
    this.polarity = (this.polarity + 1) % 2
    for (let player of players) {
      for (let power of player.powers) {
        power.onFlip(this, player)
      }
    }
  }

  start() {
    for (let player of this.players) {
      if (player.deck.length == 0) {
        let deck = []
        for (let i = 0; i < 25; i++) {
          let cardGen = cardFactory[Math.floor(Math.random() * cardFactory.length)]
          deck.push(cardGen())
        }
        player.deck = deck
      } else {
        this.log('player ' + player.id + ' has custom deck: ' + player.deck.map(x => x.id))
      }

      player.shuffle()
    }

    this.turn = -1 // startturn adds 1, so player 0 will go first
    this.startTurn()
  }

  startTurn() {
    this.turnNumber++
    this.turn = (this.turn + 1) % 2
    this.players[this.turn].startTurn()

    this.broadcastGameState()
    this.lastTurnInfo = {
      players: [
        {
          heal: 0,
          damage: 0,
        },
        {
          heal: 0,
          damage: 0,
        },
      ],
      events: []
    }
  }

  play(playerID, cardIds) {
    for (let id of cardIds) {
      this.players[playerID].play(id)
    }

    this.endTurn()
  }

  endTurn() {
    this.players[this.turn].endTurn()

    this.lastTurnInfo.players[0].heal = this.players[0].healthGainedThisTurn
    this.lastTurnInfo.players[1].heal = this.players[1].healthGainedThisTurn

    this.lastTurnInfo.players[0].damage = this.players[0].damageTakenThisTurn
    this.lastTurnInfo.players[1].damage = this.players[1].damageTakenThisTurn

    if (this.players.some(x => x.health <= 0)) {
      for (let player of this.players) {
        player.connection.send(JSON.stringify({
          type: 'win',
          data: {
            playerID: this.players.findIndex(x => x.health > 0)
          }
        }))
      }
      process.exit(1)
    }

    this.startTurn()
  }
}

module.exports = Game