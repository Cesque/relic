module.exports = function () {
  let card = new (require('../card.js'))()
  card.id = 3
  card.name = 'Marvin'
  card.description = 'Deal <2/2> damage to the enemy for every card they play next turn'
  card.isPower = true
  card.cost = 2
  card.powers = {
    onPlayAnyCard: function (game, player, sourceCard) { },
    onGainHealth: function (game, player, source, sourceCard, health) { },
    onTakeDamage: function (game, player, source, sourceCard, damage) { },
    onEndTurn: function (game, player) { },
    onStartTurn: function (game, player) { },
    onEnemyPlayAnyCard: function (game, player, cardPlayer, sourceCard) {
      card.reveal(game, player)
      player.enemy.damage(player, card, 2)
    },
    onEnemyGainHealth: function (game, player, source, sourceCard, health) { },
    onEnemyTakeDamage: function (game, player, source, sourceCard, damage) { },
    onEnemyEndTurn: function (game, player) {
      player.destroyPower(card.id)
    },
    onEnemyStartTurn: function (game, player) { },
    onFlip: function (game, player, state) { },
    onDestroyed: function (game, player) { },
  }
  return card
}