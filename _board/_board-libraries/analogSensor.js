//analogSensor.js
'use strict'

var createAnalogSensor  = function(pos, bit, readF) {

	//RESTRICTIONS
	const MAX_BIT_RES = 12 ,
		MIN_BIT_RES = 1 ,
		MAX_PIN_VALUE = 5 ,
		MIN_PIN_VALUE = 0;

	// private object that emulate a analog sensor behavior
	let _sensor = {

		Aio: {},	//mraa.Aio
		pin: -1,
		bit: 10,
		readF: {}
	};

	//initialization of the private object _sensor
	try {
		if (pos >= MIN_PIN_VALUE && pos <= MAX_PIN_VALUE) {
			_sensor.pin = pos;
			_sensor.Aio = new mraa.Aio(_sensor.pin);
			if (bit >= MIN_BIT_RES && bit <= MAX_BIT_RES) {
				_sensor.bit = bit;
			}
			else console.log("the bit is not on the scope (1 - 12)\n default is 10\n bit is " + bit);

			_sensor.Aio.setBit(_sensor.bit);
		} else throw "the pin is not on the scope (0 - 5)\n bit is " + pos;
		
		if (typeof(readF) == 'function') {
			_sensor.readF = readF;
		}
		else {
			console.log(" is not a function\nreaF = mraa.Aio.read");
			
			_sensor.readF = function () {
				return _sensor.Aio.readFloat();
			}
		}
	}
	catch(err){
		console.log(err);
		console.log("error on the scope");
	}

	// function which returns the pin nunber
	function getPin() {
	 	return _sensor.pin;
	 } 

	// function which set the new pin of the _sensor
	function setPin(newPin) {
		if (newPin >= MIN_PIN_VALUE && newPin <= MAX_PIN_VALUE) {
			_sensor.pin = newPin;
			delete _sensor.Aio;
			_sensor.Aio = new mraa.Aio(newPin);
			return true;
		}
		else console.log(" nothing hapend with pin location");
	}

	// function which returns the bit resolution of the _sensor
	function getBit() {
	 	return _sensor.bit;
	 } 

	// function which sets the new bit resolution
	function setBit(bit) {
		if (bit >= MIN_BIT_RES && bit <= MAX_BIT_RES ) {
			_sensor.bit = bit;
			_sensor.Aio.setBit(bit);
			return true;
		}
		else console.log(" nothing hapend with bit resolution");
	}

	//function that read the sensor value using the mraa.Aio.read()
	function read() {
		return _sensor.Aio.read();
	}

	//function that read the sensor value using the mraa.Aio.readf()
	function readFloat() {
		return _sensor.Aio.readFloat();
	}

	function myRead() {
		// body...
	}

	return {

		getPin: getPin,
		setPin: setPin,
		getBit: getBit,
		setBit: setBit,
		myRead: _sensor.readF,
		read: read,
		readFloat: readFloat
	};
};

module.exports = createAnalogSensor;
