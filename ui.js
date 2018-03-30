const blessed = require('blessed')

const screen = blessed.screen({
  smartCSR: true
})

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
})

let background = blessed.box({
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  padding: 0,
  border: {
    type: 'bg'
  },
  style: {
    fg: 'black',
    bg: 'black',
    border: {
      bg: 'black'
    },
  }
})

let header = blessed.box({
  top: '0',
  left: '0',
  width: '100%',
  height: 2,
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'bg'
  },
  style: {
    fg: 'white',
    bg: 'blue',
    border: {
      bg: 'red'
    },
  }
})



screen.append(background)
background.append(header)
screen.render()