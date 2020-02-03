var split = require('split-require')
var css = require('sheetify')
var choo = require('../')

css('todomvc-common/base.css')
css('todomvc-app-css/index.css')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}
app.use(require('./stores/todos'))

app.route('/', require('./views/main'))
app.route('#active', require('./views/main'))
app.route('#completed', require('./views/main'))
app.route('*', require('./views/main'))

app.experimentalAsyncRoute('/async', () => split('./views/async'))

module.exports = app.mount('body')
