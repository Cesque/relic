module.exports = function () {
  let card = new (require('../card.js'))()
  card.id = 5
  card.name = 'Shatter'
  card.description = 'Heal for 2. Destroy your opponent\'s first power'
  card.cost = 1

  card.onPlay = function (game, player) {
    player.heal(player, card, 5)
    if (player.enemy.powers.length > 0) {
      let powerId = player.enemy.powers[0].id
      player.enemy.destroyPower(powerId)
    }
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