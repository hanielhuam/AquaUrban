mraa = require(‘mraa’);

//THE CHANGES ARE EXPLAINED! IF YO WANT TO  SOMETHING, SAVE MY SET OF CLASSES SOMEWHERE!

class Control {

	constructor (sensor, lowAct, lowF, highAct, highF) {

		this.sensor = sensor;
			//Sensor mst be a new Sensor(...);

		this.lowAct = lowAct;
			//Actuator that acts to increase the system value;

		this.isLow = lowF;
			//Function to check low system values;

		this.highAct = highAct;
			//Actuator that acts to decrease the system value;

		this.isHigh = highF;
			//Function to check high system values;
	}

	check () { //returns {data: system value, status: ('common', 'high' or 'low')};

		var data = { 

			data: this.sensor.read(),

			status: 'common'
		};

		if (this.isLow(data.data)) {

			this.lowAct.write();

			data.status = 'low';
		}

		if (this.isHigh(data.data)) {

			this.highAct.write();

			data.status = 'high';
		}

		return data;
	}
}

class Sensor {

	constructor (pos, bit, readF) {// if you pass bit = 'none', yo are able to pass pos as another think!;

								   // example: var ex = new AnalogSensor({

								   //		example1: 'something1, example2: 'something2'
								   //	 }, 
								   //	 'none', 
								   //	 function () {

								   //	 /*your code here*/
								   // });

		this.bit = bit;

		if (bit != 'none') {
	
			this.pin = mraa.Aio(pos);

			this.pin.setBit(this.bit);
		}
		else this.pin = pos;

		this.readF = readF;
	}

	read () {

		return this.readF(this.pin, this.bit);
	}
}

class Actuator {

	constructor (pins, writeF) {

		this.pins = pins;

		var i;

		for (i in this.pins) {

			this.pins[i].dir(mraa.DIR_OUT);
		}

		this.writeF = writeF;
	}

	write () {

		this.writeF(this.pins);
	}
}

//EXAMPLE OF INSTANCIATION OF A CONTROL OBJECT:
//
//var example = new Control(
//
//	new Sensor(
//
//		3, 
//
//		7, 
//		
//		function (pin, bit) {
//
//			return (pin.read() / Math.pow(2, bit)) * 200;
//		}
//	), 
//	new Actuator(
//		
//		{
//			
//			pin : new mraa.Gpio(5)
//		},
//
//		function (pins) {
//
//			pins.pin.write(0);
//		}
//	), 
//	function (data) {
//
//		return data <= 5;
//	}, 
//	new Actuator(
//
//		{
//
//			counterPin : new mraa.Gpio(6)
//		},
//
//		function (pins) {
//
//			pins.counterPin.write(1);
//		}
//	), 
//	function (data) {
//
//		return data > 40;
//	}
//);