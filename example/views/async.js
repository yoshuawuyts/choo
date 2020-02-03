var html = require('bel') // cannot require choo/html because it's a nested repo

module.exports = mainView

function mainView (state, emit) {
  return html`
    <body>
      Async route
    </body>
  `
}
