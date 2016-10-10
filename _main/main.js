mraa = require(‘mraa’);

class AnalogSensor {

	constructor (pos, bit, readF) {
	
		this.pin = mraa.Aio(pos);

		this.bit = bit;

		this.pin.setBit(this.bit)

		this.readF = readF;
	}

	read () {

		return this.getF(this.pin, this.bit);
	}
}

class Actuator 
