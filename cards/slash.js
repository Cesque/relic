module.exports = function () {
  let card = new (require('../card.js'))()
  card.id = 0
  card.name = 'Slash'
  card.description = 'Deal <4/4> damage'
  card.cost = 1

  card.onPlay = function (game, player) {
    player.enemy.damage(player, card, 4)
  }
  card.onDraw = function (game, player) { }
  card.onEndTurnWithInHand = function (game, player) { }

  card.isPower = false
  card.powers = {
    onPlayAnyCard: function (game, player, sourceCard) { },
    onGainHealth: function (game, player, source, sourceCard, health) { },
    onTakeDamage: function (game, player, source, sourceCard, damage) { },
    onEndTurn: function (game, player) { },
    onStartTurn: function (game, player) { },
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