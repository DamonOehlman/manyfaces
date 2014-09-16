var eve = require('eve');
var h = require('hyperscript');
var media = require('rtc-media');
var dcstream = require('rtc-dcstream');
var concat = require('concat-stream');
var quickconnect = require('rtc-quickconnect')('//switchboard.rtc.io', {
  iceServers: require('freeice')(),
  room: 'manyfaces',
  reactive: true,
  manualJoin: true
});

var ExpiryModel = require('expiry-model');
var model = require('rtc-mesh')(quickconnect, {
  model: ExpiryModel({ maxAge: 2 })
});

var faces;
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
  model.set('name:' + quickconnect.id, value);
});

eve.on('app:join', quickconnect.join);

quickconnect.on('channel:opened:snap', function(id, dc) {
  console.log('snap channel opened with peer: ' + id);
});

model.on('change', function(key, value) {
  console.log('key: ' + key + ', value: ' + value);
});

setInterval(function() {
  faces.appendChild(require('./parts/avatar')(eve));
}, 1000);

// scaffold out quickconnect
quickconnect
  .createDataChannel('snap')
  .on('channel:opened:snap', function(id, dc) {
    prepReceiver(id, dc);
  })
  .on('channel:closed:snap', function(id) {
  })

eve('app:ready');
