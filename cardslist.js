let cards = []
cards.push(require('./cards/slash.js'))
cards.push(require('./cards/pray.js'))
cards.push(require('./cards/counter.js'))
cards.push(require('./cards/marvin.js'))
cards.push(require('./cards/laststand.js'))
cards.push(require('./cards/shatter.js'))
cards.push(require('./cards/petrify.js'))

// check if there are multiple cards with same id
for (let card of cards) {
  let id = card().id
  let count = cards.filter(x => x().id == id).length
  if (count > 1) {
    console.log('more than one card with id ' + id + ' found! :')
    console.log(cards.filter(x => x().id == id).name)
    process.exit(1)
  }
}

module.exports = cards