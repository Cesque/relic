module.exports = function () {
  let card = new (require('../card.js'))()
  card.id = 1
  card.name = 'Pray'
  card.description = 'Heal for <3/3>'
  card.cost = 1
  card.onPlay = function (game, player) {
    player.heal(player, card, 3)
  }
  return card
}