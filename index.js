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

var model = require('rtc-mesh')(quickconnect);
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
  console.log(key, value);
});

// scaffold out quickconnect
quickconnect
  .createDataChannel('snap')
  .on('channel:opened:snap', function(id, dc) {
    faces.appendChild(require('./parts/avatar')(eve));
    prepReceiver(id, dc);
  });

eve('app:ready');
