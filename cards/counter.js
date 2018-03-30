module.exports = function () {
  let card = new (require('../card.js'))()
  card.id = 2
  card.name = 'Counter'
  card.isPower = true
  card.description = 'On take damage: negate all damage taken, then destroy this power'
  card.cost = 3
  card.powers.onTakeDamage = function (game, player, source, sourceCard, amount) {
    card.reveal(game, player)
    player.heal(player, card, amount)
    player.destroyPower(card.id)
  }
  return card
}