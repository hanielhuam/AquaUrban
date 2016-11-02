//buzzer.js
'use strict'

var createOutput = function (pos) {
	
	const MIN_PIN = 0 ,
		MAX_PIN = 13;

	var _output = {
		pin: -1,
		gpio: {}
	};

	try{
		if ( pos >= MIN_PIN && pos <= MAX_PIN ) {
			_output.pin = pos;
			_output.gpio = new mraa.Gpio(pos);
			_output.gpio.dir(mraa.DIR_OUT);
		} 
		else throw "the pin is out of range: (" + MIN_PIN + "-" + MAX_PIN + ")\nsent pin = " + pos;
	}
	catch(err){
		console.log(err);
	}

	function setPin(newPin) {

		if (newPin >= MIN_PIN && newPin <= MAX_PIN) {
			
			delete _output.gpio;
			_output.gpio = new mraa.Gpio(newPin);
			_output.gpio.dir(mraa.DIR_OUT);
			return true;
		} else {
			
			console.log("the pin is out of range: (" + MIN_PIN + "-" + MAX_PIN + ")\nsent pin = " + pos);
			return false;
		};
	}

	function getPin() {
		return _output.pin;
	}

	function on() {
		_output.gpio.write(1);
	}

	function off() {
		_output.gpio.write(0);
	}

	function alarm(times, period) {

		let counter = 0;
		_output.gpio.write(0);
		let end = setInterval(function(){
			
			if (counter < 2 * times) {

				_output.gpio.write((counter + 1) % 2);
				counter++;
			} else clearInterval(end);

		}, period);
	}

	return {
		setPin: setPin,
		getPin: getPin,
		on: on,
		off: off,
		alarm: alarm
	};
}

module.exports = createOutput;