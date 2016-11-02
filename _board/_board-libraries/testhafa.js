global.mraa = require('mraa');

//var createOutput = require('./output.js');

var createBinarySensor = require('./binarySensor.js');

//var createLcd = require('./lcdI2c.js');

//var createSteperMotor = require('./steperMotorA4998.js');

//var output = createOutput(3);

//var analogInput = new mraa.Aio(0);

var digitalInput = createBinarySensor(5);

//lcd = createLcd();

//var motor1 = createSteperMotor(9, 8);

//var motor2 = createSteperMotor(10, 11);

//motor1.turn360(10, 30);

//motor2.turn360(10, 100);

//lcd.write('success');

setInterval(function () {console.log(digitalInput.read());}, 1000);

//setInterval(function () {console.log(analogInput.readFloat());}, 1000);

//output.alarm(100, 100);

//output.off();

//output.on();

//while(true);
