//steperMotorA4998.js
'use strict'

var createSteperMotorA4998 = function(dir, step) {
	
	const MIN_PIN = 0,
		MAX_PIN = 13;

	//private object that emulate a esteper motor using A4998 driver
	let _SteperMotor = {
		
		dir: -1,
		step: -1,
		gpioDir: {},
		gpioStep: {}
	};

	//initialization
	// set the pins positions and there direction
	try{
		
		if (dir >= MIN_PIN && dir <= MAX_PIN) {

			_SteperMotor.dir = dir;
			_SteperMotor.gpioDir = new mraa.Gpio(dir);
			_SteperMotor.gpioDir.dir(mraa.DIR_OUT);
			if (step != dir && step <= MAX_PIN && step >= MIN_PIN) {

				_SteperMotor.step = step;
				_SteperMotor.gpioStep = new mraa.Gpio(step);
				_SteperMotor.gpioStep.dir(mraa.DIR_OUT);
				_SteperMotor.gpioStep.write(0);

			} else console.log("the step = dir pin or dir pin is out of range.\n The maximun range is 0-13\nDir = " + dir + "\nStep = " + step);
		} else throw "the dir pin is out of range.\nThe maximun range is 0-13\nDir = " + dir + "\nStep = " + step;
	}

	catch(err){
		console.log(err);
		console.log("error on the scope");
	}

	//set dir pin to a new one
	function setDirPin(newDir) {
		if (newDir >= MIN_PIN && newDir <= MAX_PIN) {
			delete _SteperMotor.dir;
			_SteperMotor.gpioDir = new mraa.Gpio(newDir);
			_SteperMotor.gpioDir.dir(mraa.DIR_OUT);
			return true;
		} else console.log("pin out of range (0 - 13). dir pin = " + toString(newDir));

	}

	// returns a dir pin
	function getDirPin() {
		return _SteperMotor.dir;
	}

	// Set the step pin to a new one
	function setStepPin(newStep) {
		if (newStep >= MIN_PIN && newStep <= MAX_PIN) {
			delete _SteperMotor.step;
			_SteperMotor.gpioStep = new mraa.Gpio(newStep);
			_SteperMotor.gpioStep.dir(mraa.DIR_OUT);
			_SteperMotor.gpioStep.write(0);
			return true;
		} else console.log("pin out of range (0 - 13). step pin = " + toString(newStep));
	
	}

	// returns the step pin
	function getStepPin() {
		return _SteperMotor.step;
	}

	// function which makes the steper motor turn the load atched 360 degrees 
	function turn360(times, period) {

		let counter = 0;
		_SteperMotor.gpioDir.write(1);

		let end = setInterval(function(){
			if (counter < 400 * times) {

				_SteperMotor.gpioStep.write((counter + 1) % 2);
				counter++;

			} else {

				_SteperMotor.gpioStep.write(0);

				clearInterval(end);
			}

		}, period);

	}

	return {
		
		turn360: turn360,
		setDirPin: setDirPin,
		getDirPin: getDirPin,
		setStepPin: setStepPin,
		getStepPin: getStepPin
	};

};

module.exports = createSteperMotorA4998;