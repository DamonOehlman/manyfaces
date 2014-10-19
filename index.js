var eve = require('eve');
var cuid = require('cuid');
var h = require('hyperscript');
var media = require('rtc-media');
var dcstream = require('rtc-dcstream');
var concat = require('concat-stream');
var ExpiryModel = require('expiry-model');
var snapstream = require('snapstream');

// initialise our own internal uid for tracking eachother
var uid = localStorage.uid || (localStorage.uid = cuid());

// connect
var quickconnect = require('rtc-quickconnect')('http://localhost:3000/', {
  uid: uid,
  iceServers: require('freeice')(),
  room: 'manyfaces',
  reactive: true,
  manualJoin: true
});

var model = require('rtc-mesh')(quickconnect, {
  model: new ExpiryModel()
});

var faces;
var avatars = {};
var parts = [
  require('./parts/header')(eve),
  faces = require('./parts/faces')(eve)
];

function prepReceiver(id, dc) {
  dcstream(dc).pipe(concat(function(data) {
    console.log('received data: ', data);
    prepReceiver(id, dc);
  }));
}

parts.forEach(function(part) {
  document.body.appendChild(part);
});

eve.on('name:change', function(value) {
  model.set(uid + ':name', value);
});

eve.on('app:join', quickconnect.join);
eve.on('app:snap', function() {
});

quickconnect.on('channel:opened:snap', function(id, dc) {
  console.log('snap channel opened with peer: ' + id);
});

model.on('update', function(key, value) {
  var parts = key.split(':');
  var id = parts[0];
  var avatar = avatars[id];

  if (! avatar) {
    avatar = avatars[id] = require('./avatar')(id);
    faces.appendChild(avatar.container);
  }

  avatar[parts[1]] = value;
});

// scaffold out quickconnect
quickconnect
  .createDataChannel('snap')
  .on('channel:opened:snap', function(id, dc) {
    prepReceiver(id, dc);
  })
  .on('channel:closed:snap', function(id) {
  });

model.set(uid + ':peerid', quickconnect.id);
eve('app:ready');
