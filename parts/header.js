var h = require('hyperscript');
var o = require('observable');
var pull = require('pull-stream');
var po = require('pull-observable');
var debounce = require('debounce');

module.exports = function(eve) {
  var savedName = localStorage.name || '';
  var name = h('input', { placeholder: 'Your Name', value: savedName });
  var join = h('button', 'Join');
  var snap = h('button', 'Snap');

  name.addEventListener('keydown', function(evt) {
    if (evt.keyCode === 13) {
      return eve('app:join');
    }
  });

  eve.once('app:ready', function() {
    pull(
      po(o.input(name)),
      pull.drain(function(value) {
        localStorage.name = value;
        eve('name:change', null, value);
      })
    );

    if (savedName) {
      eve('name:change', null, savedName);
    }
  });

  join.addEventListener('click', function() {
    eve('app:join');
  });

  snap.addEventListener('click', function() {
    eve('app:snap');
  });

  return h('header', { class: 'local-details' }, name, join, snap);
};
