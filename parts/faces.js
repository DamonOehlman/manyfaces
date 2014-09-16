var h = require('hyperscript');
var vdom = require('vec2-dom');

module.exports = function(eve) {
  var container = h('div');
  var screen = vdom.screenSize();

  eve.on('app:ready', function() {
    // apply the vec2 layout
    require('vec2-layout')(container);

    // initilaise the container size
    container.rec.size.set(screen);

    screen.change(function() {
      container.rec.size.set(screen);
    });
  });

  return container;
};
