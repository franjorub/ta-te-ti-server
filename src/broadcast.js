var PORT = 3000;
var BROADCAST_ADDR = "192.168.255.255";
var dgram = require('dgram'); 
var server = dgram.createSocket("udp4"); 


function broadcastNew(port) {
    var message = new Buffer("hola-" + port);
    server.send(message, 0, message.length, PORT, BROADCAST_ADDR, function() {
        console.log("Sent '" + message + "'");
    });
}

module.exports = port => server.bind(function() {
    server.setBroadcast(true);
    setInterval(() => broadcastNew(port), 3000);
});
