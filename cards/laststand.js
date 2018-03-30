module.exports = function () {
  let card = new (require('../card.js'))()
  card.id = 4
  card.name = 'Last Stand'
  card.description = 'Take <3/3> damage. When your health goes below 10, heal for <5/5>'
  card.cost = 2

  card.onPlay = function (game, player) {
    player.damage(player, card, 3)
  }
  card.onDraw = function (game, player) { }
  card.onEndTurnWithInHand = function (game, player) { }

  card.isPower = true
  card.powers = {
    onPlayAnyCard: function (game, player, sourceCard) { },
    onGainHealth: function (game, player, source, sourceCard, health) { },
    onTakeDamage: function (game, player, source, sourceCard, damage) { 
      if (player.health < 10) {
        card.reveal(game, player)
        player.heal(player, card, 5)
        player.destroyPower(card.id)
      }
    },
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
  return card
}