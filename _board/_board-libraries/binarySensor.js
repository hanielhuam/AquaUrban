//binarySensor.js
'use strict'

var createBinarySensor = function (pos) {

	const MIN_PIN = 0,
		MAX_PIN = 13;

	let _sensor = {

		pin: -1,
		gpio: {}
	};

	try {

		if (pos >= MIN_PIN && pos <= MAX_PIN) {

			_sensor.pin = pos;
			_sensor.gpio = new mraa.Gpio(pos);
			_sensor.gpio.dir(mraa.DIR_IN);
		}
		else {

			throw "the pin is out of range: (" + MIN_PIN + "-" + MAX_PIN + ")\nsent pin = " + pos;
		}
	}
	catch (err) {

		console.log('err');
		console.log(err);
	}

	function getPin () {

		return _sensor.pin;
	};

	function setPin (newPos) {

		if (newPos >= MIN_PIN && pos <= MAX_PIN) {

			_sensor.pin = newPos;
			delete _sensor.gpio;
			_sensor.gpio = new mraa.Gpio(newPos);
			_sensor.gpio.dir(mraa.DIR_IN);
			return true;
		}

		else {

			console.log("the pin is out of range: (" + MIN_PIN + "-" + MAX_PIN + ")\nsent pin = " + newPos);

			return false;
		}
	}

	function read () {

		return _sensor.gpio.read();
	}

	return {

		getPin: getPin,
		setPin: setPin,
		read: read
	};
};

module.exports = createBinarySensor;