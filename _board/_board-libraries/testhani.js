//testhani.js
'use strict'

// Load lcd module on I2C
let lcdi2c = require('./lcdI2c');
let lcd = lcdi2c();

lcd.write('hafael viado');



// Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
//var myLcd = new LCD.Lcm1602(0, 0x3f, true, 16, 2);

//setInterval(function () {

	//myLcd.setCursor(0,0);

	//myLcd.write('Temp: ' + (temp.readFloat().toFixed(2) * 500) + ' C');
//},

//1500);
