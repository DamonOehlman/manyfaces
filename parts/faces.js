var h = require('hyperscript');
var vdom = require('vec2-dom');

module.exports = function(eve) {
  var container = h('div');
  var screen = vdom.screenSize();

  function resizeContainer() {
    var headerHeight = document.querySelector('header').getBoundingClientRect().height;

    container.rec.size.set(screen.subtract({ x: 0, y: headerHeight }, true));
  }

  eve.on('app:ready', function() {
    // apply the vec2 layout
    require('vec2-layout')(container);

    resizeContainer();
    screen.change(resizeContainer);
  });

  return container;
};
