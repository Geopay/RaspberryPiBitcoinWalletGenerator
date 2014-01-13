var qrcode = require('qrcode-terminal');
var fs = require('fs');
var address = process.argv[2];

qrcode.generate(address, function (qrcode) {
  fs.writeFileSync('/tmp/qrcode.txt',
    '\u001B[2J\u001B[0;0f'
      + qrcode
      + '\nWrote to /boot/wallet/' + address + '.txt\n');
});