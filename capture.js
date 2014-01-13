var exec = require('child_process').execFile,
  fs = require('fs'),
  page = require('webpage').create();

page.viewportSize = { width: 255, height: 255 };
page.open('http://localhost', function (status) {
  if (status !== 'success') {
    console.log('Problem accessing http://localhost');
    phantom.exit(1);
  } else {
    var rndData = fs.read('/tmp/random').split(',');
    var i = 0;
    var interval = setInterval(function () {
      page.sendEvent('mousemove', parseInt(rndData[i++]), parseInt(rndData[i++]));

      if (i > 1024) {
        clearInterval(interval);

        var wallet = page.evaluate(function () {
          return {
            address: document.getElementById('btcaddress').innerHTML,
            pk: document.getElementById('btcprivwif').innerHTML
          }
        });

        if (!wallet.address) {
          console.log('Unable to generate a Bitcoin address.');
          phantom.exit(1);
        }

        exec('/opt/node/bin/node', ['qr.js', wallet.address], null, function () {
          fs.write('/boot/wallet/' + wallet.address + '.txt', wallet.pk, 'w');

          setTimeout(function () {
            phantom.exit(0)
          }, 100);
        });
      }
    }, 1);
  }
});