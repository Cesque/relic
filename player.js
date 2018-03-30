class Player {
  constructor(game) {
    this.game = game
    this.id = -1

    this.enemy = undefined
    this.health = 25

    this.maxEnergy = 3
    this.energy = 0

    this.deck = []
    this.discard = []
    this.hand = []

    this.powers = []

    this.healthGainedThisTurn = 0
    this.damageTakenThisTurn = 0
  }

  startTurn() {
    this.healthGainedThisTurn = 0
    this.damageTakenThisTurn = 0

    this.energy = this.maxEnergy
    for (let i = 0; i < 5; i++) this.draw()

    for (let power of this.powers) {
      power.powers.onStartTurn(this.game, this)
    }
    for (let power of this.enemy.powers) {
      power.powers.onEnemyStartTurn(this.game, this.enemy)
    }
  }

  endTurn() {
    for (let power of this.powers) {
      power.powers.onEndTurn(this.game, this)
    }
    for (let power of this.enemy.powers) {
      power.powers.onEnemyEndTurn(this.game, this.enemy)
    }
    for (let card of this.hand) {
      this.discard.push(card)
      card.onEndTurnWithInHand(this.game, this)
    }
    this.hand = []
  }

  // adapted from https://stackoverflow.com/a/12646864
  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  draw() {
    if(this.deck.length == 0) this.refill()
    let card = this.deck.pop()
    this.hand.push(card)

    card.onDraw(this.game, this)
  }

  refill() {
    for (let card of this.discard) {
      this.deck.push(card)
    }
    this.shuffle()
    this.discard = []
  }

  heal(player, card, amount, depth) {
    depth = depth || 0
    this.health += amount
    this.healthGainedThisTurn += amount

    if (depth < 2) {
      for (let power of this.powers) {
        power.powers.onGainHealth(this.game, this, player, card, amount, depth + 1)
      }
      for (let power of this.enemy.powers) {
        power.powers.onEnemyGainHealth(this.game, this, player, card, amount, depth + 1)
      }
    }  
  }

  damage(player, card, amount, depth) {
    depth = depth || 0
    this.health -= amount
    this.damageTakenThisTurn += amount

    if (depth < 2) {
      for (let power of this.powers) {
        console.log(power)
        power.powers.onTakeDamage(this.game, this, player, card, amount, depth + 1)
      }
      for (let power of this.enemy.powers) {
        power.powers.onEnemyTakeDamage(this.game, this, player, card, amount, depth + 1)
      }
    }
  }

  destroyPower(id) {
    let index = this.powers.findIndex(x => x.id == id)
    console.log(this.powers.map(x => x.id))
    console.log(id, index)
    let card = this.powers[index]
    card.powers.onDestroyed(this.game, this, card)
    this.powers.splice(index, 1)
  }

  play(id) {
    if (this.hand.find(x => x.id == id) == undefined) {
      console.log('tried to play card with id ' + id + ' but its not in hand')
      console.log('hand: ' + this.hand.map(x => x.id))
      process.exit(1)
    }

    let index = this.hand.findIndex(x => x.id == id)
    let card = this.hand[index]

    if (card.cost == -1) {
      console.log('can\'t play unplayable card with id ' + id)
      process.exit(1)
    }
    if (card.cost > this.energy) {
      console.log('tried to play card with id ' + id + ' and cost ' + card.cost)
      console.log('but only ' + this.energy + ' available!')
      process.exit(1)
    }

    this.hand.splice(index, 1)

    for (let power of this.powers) {
      power.powers.onPlayAnyCard(this.game, this, card)
    }
    for (let power of this.enemy.powers) {
      power.powers.onEnemyPlayAnyCard(this.game, this.enemy, card)
    }

    if (card.isPower) {
      this.energy -= card.cost
      card.onPlay(this.game, this)
      this.discard.push(card)
      this.powers.push(card)
      this.game.lastTurnInfo.events.push({
        event: 'power played',
        player: this.id,
        card: -1
      })
    } else {
      this.energy -= card.cost
      card.onPlay(this.game, this)
      this.discard.push(card)
      this.game.lastTurnInfo.events.push({
        event: 'card played',
        player: this.id,
        card: card.id
      })
    }
  }
}

module.exports = Player