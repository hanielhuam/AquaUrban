//lcdI2c.js
'use strict'

const LCD = require('jsupm_i2clcd') ,
createLcdI2c = function () {

	const _myLcd = new LCD.Lcm1602(0, 0x3f, true, 16, 2);

	function write(menssage) {

		if (menssage.length < 16) {

			_myLcd.write(menssage);
		} else {

			_myLcd.entryRightToLeft();
			_myLcd.autoscrollOn();
			_myLcd.write(menssage);
			_myLcd.scrollDisplayRight();
		}
	}

	function clear() {

		_myLcd.clear();
	}

	function lcdOn(argument) {

		_myLcd.backlightOn();
	}

	function lcdOff(argument) {
		
		_myLcd.backlightOff();
	}

	function setCursor(row, column) {

		_myLcd.setCursor(row, column);
	}

	function alert(menssage, blinkPeriod, times) {

		let counter = 0;
		
		let end = setInterval( function () {

			if (counter < times) {

				_myLcd.backlightOff();
				setTimeout(blinkPeriod * 0,25);
				_myLcd.backlightOn();
				write(menssage);
				setTimeout(blinkPeriod * 0,75)

			} else clearInterval(end);
			
		}, blinkPeriod);
	}

	return {

		write: write ,
		clear: clear ,
		lcdOn: lcdOn ,
		lcdOff: lcdOff ,
		setCursor: setCursor ,
		clear: clear ,
		alert: alert
	};	
}

module.exports = createLcdI2c;

