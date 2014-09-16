var h = require('hyperscript');
var o = require('observable');
var pull = require('pull-stream');
var po = require('pull-observable');

module.exports = function(eve) {
  var name = h('input', { placeholder: 'Your Name' });
  var join = h('button', 'Join');
  var snap = h('button', 'Snap');

  pull(
    po(o.input(name)),
    pull.drain(function(value) {
      eve('name:change', null, value);
    })
  );

  join.addEventListener('click', function() {
    eve('app:join');
  });

  return h('header', { class: 'local-details' }, name, join, snap);
};
