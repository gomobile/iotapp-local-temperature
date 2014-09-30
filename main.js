/*jslint node:true,vars:true,bitwise:true */
/*global mraa */


var B = 3975;
var mraa = require("mraa");

//GROVE Kit A0 --> Aio(0)
var myAnalogPin = new mraa.Aio(0);

/*

*/
function startSensorWatch(socket) {
    'use strict';
    setInterval(function () {
        var a = myAnalogPin.read() >> 2;
        //console.log("Checking....");

        //console.log("Analog Pin (A0) Output: " + a);
        var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
        //console.log("Resistance: "+resistance);
        var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
        //console.log("Celsius Temperature "+celsius_temperature); 
        var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 35;
        //console.log("Fahrenheit Temperature "+ fahrenheit_temperature);
        socket.emit("message", fahrenheit_temperature);
    }, 4000);
}

console.log("Sample Reading Temperature Sensor");

//Create Socket.io server
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    'use strict';
    res.send('<h1>Hello world from Intel Galileo</h1>');
});

//Attach a 'connection' event handler to the server
io.on('connection', function (socket) {
    'use strict';
    console.log('a user connected');
    //Emits an event along with a message
    socket.emit('connected', 'Welcome');
    
    //Start watching Sensors connected to Galileo board
    startSensorWatch(socket);
    
    //Attach a 'disconnect' event handler to the socket
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(1337, function () {
    'use strict';
    console.log('listening on *:1337');
});

