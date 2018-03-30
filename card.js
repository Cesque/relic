class Card {
  constructor() {
    this.id = -1
    this.name = 'test name'
    this.description = 'test description'
    this.cost = 0

    this.onPlay = function (game, player) { }
    this.onDraw = function (game, player) { }
    this.onEndTurnWithInHand = function (game, player) { }

    this.isPower = false
    this.isRevealed = false
    this.reveal = function (game, player) {
      if (!this.isRevealed) {
        this.isRevealed = true
        game.lastTurnInfo.events.push({
          event: 'power revealed',
          card: this.id
        })
      }  
    }
    this.powers = {
      onPlayAnyCard: function (game, player, sourceCard) { },
      onGainHealth: function (game, player, source, sourceCard, health) { },
      onTakeDamage: function (game, player, source, sourceCard, damage) { },
      onStartTurn: function (game, player) { },
      onEndTurn: function (game, player) { },
      onEnemyPlayAnyCard: function (game, player, cardPlayer, sourceCard) { },
      onEnemyGainHealth: function (game, player, source, sourceCard, health) { },
      onEnemyTakeDamage: function (game, player, source, sourceCard, damage) { },
      onEnemyStartTurn: function (game, player) { },
      onEnemyEndTurn: function (game, player) { },
      onFlip: function (game, player, state) { },
      onDestroyed: function (game, player) { },
    }
  }
}

module.exports = Card

// template

/*
module.exports = function () {
  let card = new (require('../card.js'))()
  card.id = -1
  card.name = 'test name'
  card.description = 'test description'
  card.cost = 0

  card.onPlay = function (game, player) { }
  card.onDraw = function (game, player) { }
  card.onEndTurnWithInHand = function (game, player) { }

  card.isPower = false
  card.powers = {
    onPlayAnyCard: function (game, player, sourceCard) { },
    onGainHealth: function (game, player, source, sourceCard, health) { },
    onTakeDamage: function (game, player, source, sourceCard, damage) { },
    onStartTurn: function (game, player) { },
    onEndTurn: function (game, player) { },
    onEnemyPlayAnyCard: function (game, player, cardPlayer, sourceCard) { },
    onEnemyGainHealth: function (game, player, source, sourceCard, health) { },
    onEnemyTakeDamage: function (game, player, source, sourceCard, damage) { },
    onEnemyEndTurn: function (game, player) { },
    onEnemyStartTurn: function (game, player) { },
    onFlip: function (game, player, state) { },
    onDestroyed: function (game, player) { },
  }
  return card
}
*/