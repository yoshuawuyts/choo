<h1 align="center">Choo</h1>

<div align="center">
  :steam_locomotive::train::train::train::train::train:
</div>
<div align="center">
  <strong>Fun functional programming</strong>
</div>
<div align="center">
  A <code>4kb</code> framework for creating sturdy frontend applications
</div>

<br />

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square"
      alt="API stability" />
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/choo">
    <img src="https://img.shields.io/npm/v/choo.svg?style=flat-square"
      alt="NPM version" />
  </a>
  <!-- Build Status -->
  <a href="https://travis-ci.org/choojs/choo">
    <img src="https://img.shields.io/travis/choojs/choo/master.svg?style=flat-square"
      alt="Build Status" />
  </a>
  <!-- Test Coverage -->
  <a href="https://codecov.io/github/choojs/choo">
    <img src="https://img.shields.io/codecov/c/github/choojs/choo/master.svg?style=flat-square"
      alt="Test Coverage" />
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/choo">
    <img src="https://img.shields.io/npm/dt/choo.svg?style=flat-square"
      alt="Download" />
  </a>
  <!-- Standard -->
  <a href="https://standardjs.com">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"
      alt="Standard" />
  </a>
</div>

<div align="center">
  <h3>
    <a href="https://choo.io">
      Website
    </a>
    <span> | </span>
    <a href="https://github.com/choojs/choo-handbook">
      Handbook
    </a>
    <span> | </span>
    <a href="https://github.com/YerkoPalma/awesome-choo">
      Ecosystem
    </a>
    <span> | </span>
    <!-- <a href="https://github.com/trainyard/choo-cli"> -->
    <!--   CLI -->
    <!-- </a> -->
    <!-- <span> | </span> -->
    <a href="https://github.com/choojs/choo/blob/master/.github/CONTRIBUTING.md">
      Contributing
    </a>
    <span> | </span>
    <a href="https://www.reddit.com/r/choojs/">
      Reddit
    </a>
    <span> | </span>
    <a href="https://webchat.freenode.net/?channels=choo">
      Chat
    </a>
  </h3>
</div>

<div align="center">
  <sub>The little framework that could. Built with ❤︎ by
  <a href="https://twitter.com/yoshuawuyts">Yoshua Wuyts</a> and
  <a href="https://github.com/choojs/choo/graphs/contributors">
    contributors
  </a>
</div>

## Table of Contents
- [Features](#features)
- [Example](#example)
- [Philosophy](#philosophy)
- [Events](#events)
- [State](#state)
- [Routing](#routing)
- [Server Rendering](#server-rendering)
- [Components](#components)
- [Optimizations](#optimizations)
- [FAQ](#faq)
- [API](#api)
- [Installation](#installation)
- [See Also](#see-also)
- [Support](#support)

## Features
- __minimal size:__ weighing `4kb`, Choo is a tiny little framework
- __event based:__ our performant event system makes writing apps easy
- __small api:__ with only 6 methods there's not much to learn
- __minimal tooling:__ built for the cutting edge `browserify` compiler
- __isomorphic:__ renders seamlessly in both Node and browsers
- __very cute:__ choo choo!

## Example
```js
var html = require('choo/html')
var devtools = require('choo-devtools')
var choo = require('choo')

var app = choo()
app.use(devtools())
app.use(countStore)
app.route('*', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <h1>count is ${state.count}</h1>
      <button onclick=${onclick}>Increment</button>
    </body>
  `

  function onclick () {
    emit('increment', 1)
  }
}

function countStore (state, emitter) {
  state.count = 0
  emitter.on('increment', function (count) {
    state.count += count
    emitter.emit('render')
  })
}
```
Want to see more examples? Check out the [Choo handbook][handbook].

## Philosophy
We believe programming should be fun and light, not stern and stressful. It's
cool to be cute; using serious words without explaining them doesn't make for
better results - if anything it scares people off. We don't want to be scary,
we want to be nice and fun, and then _casually_ be the best choice around.
_Real casually._

We believe frameworks should be disposable, and components recyclable. We don't
want a web where walled gardens jealously compete with one another. By making
the DOM the lowest common denominator, switching from one framework to another
becomes frictionless. Choo is modest in its design; we don't believe it will
be top of the class forever, so we've made it as easy to toss out as it is to
pick up.

We don't believe that bigger is better. Big APIs, large complexities, long
files - we see them as omens of impending userland complexity. We want everyone
on a team, no matter the size, to fully understand how an application is laid
out. And once an application is built, we want it to be small, performant and
easy to reason about. All of which makes for easy to debug code, better results
and super smiley faces.

## Events
At the core of Choo is an event emitter, which is used for both application
logic but also to interface with the framework itself. The package we use for
this is [nanobus](https://github.com/choojs/nanobus).

You can access the emitter through `app.use(state, emitter, app)`, `app.route(route,
view(state, emit))` or `app.emitter`. Routes only have access to the
`emitter.emit` method to encourage people to separate business logic from
render logic.

The purpose of the emitter is two-fold: it allows wiring up application code
together, and splitting it off nicely - but it also allows communicating with
the Choo framework itself. All events can be read as constants from
`state.events`. Choo ships with the following events built in:

### `'DOMContentLoaded'`|`state.events.DOMCONTENTLOADED`
Choo emits this when the DOM is ready. Similar to the DOM's
`'DOMContentLoaded'` event, except it will be emitted even if the listener is
added _after_ the DOM became ready. Uses
[document-ready](https://github.com/bendrucker/document-ready) under the hood.

### `'render'`|`state.events.RENDER`
This event should be emitted to re-render the DOM. A common pattern is to
update the `state` object, and then emit the `'render'` event straight after.
Note that `'render'` will only have an effect once the `DOMContentLoaded` event
has been fired.

### `'navigate'`|`state.events.NAVIGATE`
Choo emits this event whenever routes change. This is triggered by either
`'pushState'`, `'replaceState'` or `'popState'`.

### `'pushState'`|`state.events.PUSHSTATE`
This event should be emitted to navigate to a new route. The new route is added
to the browser's history stack, and will emit `'navigate'` and `'render'`.
Similar to
[history.pushState](http://devdocs.io/dom/history_api).

### `'replaceState'`|`state.events.REPLACESTATE`
This event should be emitted to navigate to a new route. The new route replaces
the current entry in the browser's history stack, and will emit `'navigate'`
and `'render'`. Similar to
[history.replaceState](http://devdocs.io/dom/history#history-replacestate).

### `'popState'`|`state.events.POPSTATE`
This event is emitted when the user hits the 'back' button in their browser.
The new route will be a previous entry in the browser's history stack, and
immediately afterward the`'navigate'` and `'render'`events will be emitted.
Similar to [history.popState](http://devdocs.io/dom_events/popstate). (Note
that `emit('popState')` will _not_ cause a popState action - use
`history.go(-1)` for that - this is different from the behaviour of `pushState`
and `replaceState`!)

### `'DOMTitleChange'`|`state.events.DOMTITLECHANGE`
This event should be emitted whenever the `document.title` needs to be updated.
It will set both `document.title` and `state.title`.  This value can be used
when server rendering to accurately include a `<title>` tag in the header.
This is derived from the
[DOMTitleChanged event](https://developer.mozilla.org/en-US/docs/Web/Events/DOMTitleChanged).

## State
Choo comes with a shared state object. This object can be mutated freely, and
is passed into the view functions whenever `'render'` is emitted. The state
object comes with a few properties set.

When initializing the application, `window.initialState` is used to provision
the initial state. This is especially useful when combined with server
rendering. See [server rendering](#server-rendering) for more details.

### `state.events`
A mapping of Choo's built in events. It's recommended to extend this object
with your application's events. By defining your event names once and setting
them on `state.events`, it reduces the chance of typos, generally autocompletes
better, makes refactoring easier and compresses better.

### `state.params`
The current params taken from the route. E.g. `/foo/:bar` becomes available as
`state.params.bar` If a wildcard route is used (`/foo/*`) it's available as
`state.params.wildcard`.

### `state.query`
An object containing the current queryString. `/foo?bin=baz` becomes `{ bin:
'baz' }`.

### `state.href`
An object containing the current href. `/foo?bin=baz` becomes `/foo`.

### `state.route`
The current name of the route used in the router (e.g. `/foo/:bar`).

### `state.title`
The current page title. Can be set using the `DOMTitleChange` event.

### `state.components`
An object _recommended_ to use for local component state.

### `state.cache(Component, id, [...args])`
Generic class cache. Will lookup Component instance by id and create one if not
found. Useful for working with stateful [components](#components).

## Routing
Choo is an application level framework. This means that it takes care of
everything related to routing and pathnames for you.

### Params
Params can be registered by prepending the route name with `:routename`, e.g.
`/foo/:bar/:baz`. The value of the param will be saved on `state.params` (e.g.
`state.params.bar`). Wildcard routes can be registered with `*`, e.g. `/foo/*`.
The value of the wildcard will be saved under `state.params.wildcard`.

### Default routes
Sometimes a route doesn't match, and you want to display a page to handle it.
You can do this by declaring `app.route('*', handler)` to handle all routes
that didn't match anything else.

### Querystrings
Querystrings (e.g. `?foo=bar`) are ignored when matching routes. An object
containing the key-value mappings exists as `state.query`.

### Hash routing
By default, hashes are ignored when routing. When enabling hash routing
(`choo({ hash: true })`) hashes will be treated as part of the url, converting
`/foo#bar` to `/foo/bar`. This is useful if the application is not mounted at
the website root. Unless hash routing is enabled, if a hash is found we check if
there's an anchor on the same page, and will scroll the element into view. Using
both hashes in URLs and anchor links on the page is generally not recommended.

### Following links
By default all clicks on `<a>` tags are handled by the router through the
[nanohref](https://github.com/choojs/nanohref) module. This can be
disabled application-wide by passing `{ href: false }` to the application
constructor. The event is not handled under the following conditions:
- the click event had `.preventDefault()` called on it
- the link has a `target="_blank"` attribute with `rel="noopener noreferrer"`
- a modifier key is enabled (e.g. `ctrl`, `alt`, `shift` or `meta`)
- the link's href starts with protocol handler such as `mailto:` or `dat:`
- the link points to a different host
- the link has a `download` attribute

:warn: Note that we only handle `target=_blank` if they also have
`rel="noopener noreferrer"` on them. This is needed to [properly sandbox web
pages](https://mathiasbynens.github.io/rel-noopener/).

### Navigating programmatically
To navigate routes you can emit `'pushState'`, `'popState'` or
`'replaceState'`. See [#events](#events) for more details about these events.

## Server Rendering
Choo was built with Node in mind. To render on the server call
`.toString(route, [state])` on your `choo` instance.

```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.route('/', function (state, emit) {
  return html`<div>Hello ${state.name}</div>`
})

var state = { name: 'Node' }
var string = app.toString('/', state)

console.log(string)
// => '<div>Hello Node</div>'
```

When starting an application in the browser, it's recommended to provide the
same `state` object available as `window.initialState`. When the application is
started, it'll be used to initialize the application state. The process of
server rendering, and providing an initial state on the client to create the
exact same document is also known as "rehydration".

For security purposes, after `window.initialState` is used it is deleted from
the `window` object.

```html
<html>
  <head>
    <script>window.initialState = { initial: 'state' }</script>
  </head>
  <body>
  </body>
</html>
```

## Components
From time to time there will arise a need to have an element in an application
hold a self-contained state or to not rerender when the application does. This
is common when using 3rd party libraries to e.g. display an interactive map or a
graph and you rely on this 3rd party library to handle modifications to the DOM.
Components come baked in to Choo for these kinds of situations. See
[nanocomponent][nanocomponent] for documentation on the component class.

```javascript
// map.js
var html = require('choo/html')
var mapboxgl = require('mapbox-gl')
var Component = require('choo/component')

module.exports = class Map extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
  }

  load (element) {
    this.map = new mapboxgl.Map({
      container: element,
      center: this.local.center
    })
  }

  update (center) {
    if (center.join() !== this.local.center.join()) {
      this.map.setCenter(center)
    }
    return false
  }

  createElement (center) {
    this.local.center = center
    return html`<div></div>`
  }
}
```

```javascript
// index.js
var choo = require('choo')
var html = require('choo/html')
var Map = require('./map.js')

var app = choo()
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <button onclick=${onclick}>Where am i?</button>
      ${state.cache(Map, 'my-map').render(state.center)}
    </body>
  `

  function onclick () {
    emit('locate')
  }
}

app.use(function (state, emitter) {
  state.center = [18.0704503, 59.3244897]
  emitter.on('locate', function () {
    window.navigator.geolocation.getCurrentPosition(function (position) {
      state.center = [position.coords.longitude, position.coords.latitude]
      emitter.emit('render')
    })
  })
})
```

### Caching components
When working with stateful components, one will need to keep track of component
instances – `state.cache` does just that. The component cache is a function
which takes a component class and a unique id (`string`) as its first two
arguments. Any following arguments will be forwarded to the component constructor
together with `state` and `emit`.

The default class cache is an LRU cache (using [nanolru][nanolru]), meaning it
will only hold on to a fixed amount of class instances (`100` by default) before
starting to evict the least-recently-used instances. This behavior can be
overriden with [options](#app--chooopts).

## Optimizations
Choo is reasonably fast out of the box. But sometimes you might hit a scenario
where a particular part of the UI slows down the application, and you want to
speed it up. Here are some optimizations that are possible.

### Caching DOM elements
Sometimes we want to tell the algorithm to not evaluate certain nodes (and its
children). This can be because we're sure they haven't changed, or perhaps
because another piece of code is managing that part of the DOM tree. To achieve
this `nanomorph` evaluates the `.isSameNode()` method on nodes to determine if
they should be updated or not.

```js
var el = html`<div>node</div>`

// tell nanomorph to not compare the DOM tree if they're both divs
el.isSameNode = function (target) {
  return (target && target.nodeName && target.nodeName === 'DIV')
}
```

### Reordering lists
It's common to work with lists of elements on the DOM. Adding, removing or
reordering elements in a list can be rather expensive. To optimize this you can
add an `id` attribute to a DOM node. When reordering nodes it will compare
nodes with the same ID against each other, resulting in far fewer re-renders.
This is especially potent when coupled with DOM node caching.

```js
var el = html`
  <section>
    <div id="first">hello</div>
    <div id="second">world</div>
  </section>
`
```

### Pruning dependencies
We use the `require('assert')` module from Node core to provide helpful error
messages in development. In production you probably want to strip this using
[unassertify][unassertify].

To convert inlined HTML to valid DOM nodes we use `require('nanohtml')`. This has
overhead during runtime, so for production environments we should unwrap this
using the [nanohtml transform][nanohtml].

Setting up browserify transforms can sometimes be a bit of hassle; to make this
more convenient we recommend using [bankai build][bankai] to build your assets for production.

## FAQ
### Why is it called Choo?
Because I thought it sounded cute. All these programs talk about being
_"performant"_, _"rigid"_, _"robust"_ - I like programming to be light, fun and
non-scary. Choo embraces that.

Also imagine telling some business people you chose to rewrite something
critical for serious bizcorp using a train themed framework.
:steam_locomotive::train::train::train:

### Is it called Choo, Choo.js or...?
It's called "Choo", though we're fine if you call it "Choo-choo" or
"Chugga-chugga-choo-choo" too. The only time "choo.js" is tolerated is if /
when you shimmy like you're a locomotive.

### Does Choo use a virtual-dom?
Choo uses [nanomorph][nanomorph], which diffs real DOM nodes instead of
virtual nodes. It turns out that [browsers are actually ridiculously good at
dealing with DOM nodes][morphdom-bench], and it has the added benefit of
working with _any_ library that produces valid DOM nodes. So to put a long
answer short: we're using something even better.

### How can I support older browsers?
Template strings aren't supported in all browsers, and parsing them creates
significant overhead. To optimize we recommend running `browserify` with
[nanohtml][nanohtml] as a global transform or using [bankai][bankai] directly.
```sh
$ browserify -g nanohtml
```

### Is choo production ready?
Sure.

## API
This section provides documentation on how each function in Choo works. It's
intended to be a technical reference. If you're interested in learning choo for
the first time, consider reading through the [handbook][handbook] first
:sparkles:

### `app = choo([opts])`
Initialize a new `choo` instance. `opts` can also contain the following values:
- __opts.history:__ default: `true`. Listen for url changes through the
  history API.
- __opts.href:__ default: `true`. Handle all relative `<a
  href="<location>"></a>` clicks and call `emit('render')`
- __opts.cache:__ default: `undefined`. Override default class cache used by
  `state.cache`. Can be a a `number` (maximum number of instances in cache,
  default `100`) or an `object` with a [nanolru][nanolru]-compatible API.
- __opts.hash:__ default: `false`. Treat hashes in URLs as part of the pathname,
  transforming `/foo#bar` to `/foo/bar`. This is useful if the application is
  not mounted at the website root.

### `app.use(callback(state, emitter, app))`
Call a function and pass it a `state`, `emitter` and `app`. `emitter` is an instance
of [nanobus](https://github.com/choojs/nanobus/). You can listen to
messages by calling `emitter.on()` and emit messages by calling
`emitter.emit()`. `app` is the same Choo instance. Callbacks passed to `app.use()` are commonly referred to as
`'stores'`.

If the callback has a `.storeName` property on it, it will be used to identify
the callback during tracing.

See [#events](#events) for an overview of all events.

### `app.route(routeName, handler(state, emit))`
Register a route on the router. The handler function is passed `app.state`
and `app.emitter.emit` as arguments. Uses [nanorouter][nanorouter] under the
hood.

See [#routing](#routing) for an overview of how to use routing efficiently.

### `app.mount(selector)`
Start the application and mount it on the given `querySelector`,
the given selector can be a String or a DOM element.

In the browser, this will _replace_ the selector provided with the tree returned from `app.start()`.
If you want to add the app as a child to an element, use `app.start()` to obtain the tree and manually append it.

On the server, this will save the `selector` on the app instance.
When doing server side rendering, you can then check the `app.selector` property to see where the render result should be inserted.

Returns `this`, so you can easily export the application for server side rendering:

```js
module.exports = app.mount('body')
```

### `tree = app.start()`
Start the application. Returns a tree of DOM nodes that can be mounted using
`document.body.appendChild()`.

### `app.toString(location, [state])`
Render the application to a string. Useful for rendering on the server.

### `choo/html`
Create DOM nodes from template string literals. Exposes
[nanohtml](https://github.com/choojs/nanohtml). Can be optimized using
[nanohtml][nanohtml].

### `choo/html/raw`
Exposes [nanohtml/raw](https://github.com/shama/nanohtml#unescaping) helper for rendering raw HTML content.

## Installation
```sh
$ npm install choo
```

## See Also
- [bankai](https://github.com/choojs/bankai) - streaming asset compiler
- [stack.gl](http://stack.gl/) - open software ecosystem for WebGL
- [yo-yo](https://github.com/maxogden/yo-yo) - tiny library for modular UI
- [tachyons](https://github.com/tachyons-css/tachyons) - functional CSS for
  humans
- [sheetify](https://github.com/stackcss/sheetify) - modular CSS bundler for
  `browserify`

## Support
Creating a quality framework takes a lot of time. Unlike others frameworks,
Choo is completely independently funded. We fight for our users. This does mean
however that we also have to spend time working contracts to pay the bills.
This is where you can help: by chipping in you can ensure more time is spent
improving Choo rather than dealing with distractions.

### Sponsors
Become a sponsor and help ensure the development of independent quality
software. You can help us keep the lights on, bellies full and work days sharp
and focused on improving the state of the web. [Become a
sponsor](https://opencollective.com/choo#sponsor)

<a href="https://opencollective.com/choo/sponsor/0/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/1/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/2/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/3/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/4/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/5/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/6/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/7/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/8/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/9/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/10/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/11/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/12/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/13/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/14/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/15/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/16/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/17/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/18/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/19/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/20/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/21/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/22/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/23/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/24/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/25/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/26/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/27/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/28/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/choo/sponsor/29/website" target="_blank"><img src="https://opencollective.com/choo/sponsor/29/avatar.svg"></a>

### Backers
Become a backer, and buy us a coffee (or perhaps lunch?) every month or so.
[Become a backer](https://opencollective.com/choo#backer)

<a href="https://opencollective.com/choo/backer/0/website" target="_blank"><img src="https://opencollective.com/choo/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/1/website" target="_blank"><img src="https://opencollective.com/choo/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/2/website" target="_blank"><img src="https://opencollective.com/choo/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/3/website" target="_blank"><img src="https://opencollective.com/choo/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/4/website" target="_blank"><img src="https://opencollective.com/choo/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/5/website" target="_blank"><img src="https://opencollective.com/choo/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/6/website" target="_blank"><img src="https://opencollective.com/choo/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/7/website" target="_blank"><img src="https://opencollective.com/choo/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/8/website" target="_blank"><img src="https://opencollective.com/choo/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/9/website" target="_blank"><img src="https://opencollective.com/choo/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/10/website" target="_blank"><img src="https://opencollective.com/choo/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/11/website" target="_blank"><img src="https://opencollective.com/choo/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/12/website" target="_blank"><img src="https://opencollective.com/choo/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/13/website" target="_blank"><img src="https://opencollective.com/choo/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/14/website" target="_blank"><img src="https://opencollective.com/choo/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/15/website" target="_blank"><img src="https://opencollective.com/choo/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/16/website" target="_blank"><img src="https://opencollective.com/choo/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/17/website" target="_blank"><img src="https://opencollective.com/choo/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/18/website" target="_blank"><img src="https://opencollective.com/choo/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/19/website" target="_blank"><img src="https://opencollective.com/choo/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/20/website" target="_blank"><img src="https://opencollective.com/choo/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/21/website" target="_blank"><img src="https://opencollective.com/choo/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/22/website" target="_blank"><img src="https://opencollective.com/choo/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/23/website" target="_blank"><img src="https://opencollective.com/choo/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/24/website" target="_blank"><img src="https://opencollective.com/choo/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/25/website" target="_blank"><img src="https://opencollective.com/choo/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/26/website" target="_blank"><img src="https://opencollective.com/choo/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/27/website" target="_blank"><img src="https://opencollective.com/choo/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/28/website" target="_blank"><img src="https://opencollective.com/choo/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/choo/backer/29/website" target="_blank"><img src="https://opencollective.com/choo/backer/29/avatar.svg"></a>

## License
[MIT](https://tldrlegal.com/license/mit-license)

[nanocomponent]: https://github.com/choojs/nanocomponent
[nanolru]: https://github.com/s3ththompson/nanolru
[bankai]: https://github.com/choojs/bankai
[nanohtml]: https://github.com/choojs/nanohtml
[browserify]: https://github.com/substack/node-browserify
[budo]: https://github.com/mattdesl/budo
[es2020]: https://github.com/yoshuawuyts/es2020
[handbook]: https://github.com/yoshuawuyts/choo-handbook
[hyperx]: https://github.com/substack/hyperx
[morphdom-bench]: https://github.com/patrick-steele-idem/morphdom#benchmarks
[nanomorph]: https://github.com/choojs/nanomorph
[nanorouter]: https://github.com/choojs/nanorouter
[yo-yo]: https://github.com/maxogden/yo-yo
[unassertify]: https://github.com/unassert-js/unassertify
[window-performance]: https://developer.mozilla.org/en-US/docs/Web/API/Performance
