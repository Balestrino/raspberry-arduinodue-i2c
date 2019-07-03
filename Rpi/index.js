const { RaspiIO } = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({
  io: new RaspiIO()
});

const readline = require('readline');
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080})

board.on('ready', function () {
  // Create an Led on pin 7 on header P1 (GPIO4) and strobe it on/off
  const led = new five.Led('P1-7');
  led.strobe(500);
  
  console.log("sending i2c..");
  var write = (message) => {
    this.i2cWrite(0x08, Array.from(message, c => c.charCodeAt(0)));
  };
  this.i2cConfig();
  this.repl.inject({ write });

  write("Hello World");

  wss.on('connection', ws => {
    ws.on('message', message => {
      write(message);
      console.log(`received message => ${message}`)
   })
   ws.send('hey!')
  })

board.on('exit', function () {
  const led = new five.Led('P1-7');
  led.off();
  console.log("Board shutdown");
})

});

