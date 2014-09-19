var h = require('hyperscript');

function Avatar(id) {
  if (! (this instanceof Avatar)) {
    return new Avatar(id);
  }

  this.nameLabel = h('label');
  this.container = h('div', { className: 'avatar' }, this.nameLabel);
}

module.exports = Avatar;
var prot = Avatar.prototype;

Object.defineProperty(prot, 'name', {
  set: function(value) {
    this.nameLabel.innerText = value;
  }
});

Object.defineProperty(prot, 'avatar', {
  set: function(value) {
  }
});
