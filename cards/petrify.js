module.exports = function () {
  let card = new (require('../card.js'))()
  card.id = 6
  card.name = 'Petrify'
  card.description = 'Deal <7/7> damage. Next turn, your opponent has 1 less energy.'
  card.cost = 3

  card.onPlay = function (game, player) {
    player.enemy.damage(player, card, 7)
  }
  card.onDraw = function (game, player) { }
  card.onEndTurnWithInHand = function (game, player) { }

  card.isPower = true
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
    onEnemyStartTurn: function (game, player) { 
      console.log('petrify revealed')
      card.reveal(game, player)
      player.enemy.energy -= 1
      player.destroyPower(card.id)
    },
    onFlip: function (game, player, state) { },
    onDestroyed: function (game, player) { },
  }
  return card
}