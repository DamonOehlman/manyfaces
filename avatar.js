var h = require('hyperscript');

function Avatar(id) {
  if (! (this instanceof Avatar)) {
    return new Avatar(id);
  }

  this.img = h('img');
  this.container = h('div', { className: 'avatar' }, this.img);
}

module.exports = Avatar;
var prot = Avatar.prototype;

Object.defineProperty(prot, 'name', {
  get: function() {
    return this.img.dataset.name;
  },
  set: function(value) {
    this.img.dataset.name = value;
  }
});

Object.defineProperty(prot, 'image', {
  get: function() {
    return this.img.src;
  },

  set: function(value) {
    this.img.src = value;
  }
});
