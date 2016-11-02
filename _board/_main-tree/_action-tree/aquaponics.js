//PROPERTIES:

	var globalProperties = {

		buzzer: 6,

		alarmTimes: 5,

		alarmPeriod: 100
	};

	var feedProperties = {

		once: true,

		motorDir: 10,

		motorStep: 9,

		motorRounds: 1,

		motorPeriod: 60
	};

	var waterLevelProperties = {

		once: true,

		emulate: false,

		input: 5,

		led: 4,

		alarmTimes: 150,

		alarmPeriod: 100
	};

	var phProperties = {

		once: true,

		emulate: false,	

		CONST: 50,

		input: 0,

		inputBit: 10,

		led: 8,

		alarmTimes: 150,

		alarmPeriod: 100,

		motorDir: 10,

		motorStep: 11,

		motorRounds: 1,

		motorPeriod: 60
	};

	var temperatureProperties = {

		once: true,

		emulate: false,

		CONST: 50,

		input: 1,

		inputBit: 10,
		
		led: 7,

		alarmTimes: 150,

		alarmPeriod: 100
	};
//GLOBAL:

	global.buzzer = lib.createOutput(globalProperties.buzzer);

	global.noise = function () {

		buzzer.alarm(globalProperties.alarmTimes, globalProperties.alarmPeriod);
	};

	global.maxPh = 20;

	global.minPh = 0;
	
	global.maxTemperature = 60;

	global.minTemperature = 10;

var nodes = {
	
	feed: feed = new lib.Control(

	 	{

	 		motor: lib.createSteperMotor(feedProperties.motorDir, feedProperties.motorStep),

			act: function () {

				console.log('feeding');

				this.motor.turn360(feedProperties.motorRounds, feedProperties.motorPeriod);
			}
		},

		function () {

			if (feedProperties.once) {

				console.log('time to feed');

				this.act();

				feedProperties.once = false;
			}

			return true;
		},

		function () {}
	),

	waterLevel: new lib.Control(

		{

			input: lib.createBinarySensor(waterLevelProperties.input),

			led: lib.createOutput(waterLevelProperties.led),

			alarm: function () {

				this.led.alarm(waterLevelProperties.alarmTimes, waterLevelProperties.alarmPeriod);
			},

			act: function () {

				console.log('filling aquarium');
			}
		},

		function () {

			var data = waterLevelProperties.emulate?1:this.input.read();

			if (data) {

				this.alarm();

				noise();

				console.log('water level is low');

				if (waterLevelProperties.once) {

					this.act();

					waterLevelProperties.once = false;
				}
			}

			else {

				waterLevelProperties.once = true;
			}

			return data;
		},

		function () {}
	),

	ph: new lib.Control(

		{

			input: lib.createAnalogSensor(

				phProperties.input,

				phProperties.inputBit,

				function () {

					var n = 10;

					var add = 0;

					for (var i = 0; i < n; i++) {

						add += (this.readFloat() * phProperties.CONST);
					}

					return phProperties.emulate?(minPh - (Math.random() % 3)):(add / n);
				}
			),

			motor: lib.createSteperMotor(phProperties.motorDir, phProperties.motorStep),

			led: lib.createOutput(phProperties.led),

			alarm: function () {
	
				this.led.alarm(phProperties.alarmTimes, phProperties.alarmPeriod);
			},

			increase: function () {

				console.log('increasing ph');
			},

			decrease: function () {

				console.log('decreasing ph');

				this.motor.turn360(phProperties.motorRounds, phProperties.motorPeriod);
			}
		},

		function () {

			var data = this.input.myRead();

			if (data < minPh) {

				this.alarm();

				noise();

				console.log('ph low');

				if (phProperties.once) {

					this.increase();

					phProperties.once = false;
				}
			}

			else if (data > maxPh) {

				this.alarm();

				noise();

				console.log('ph high');

				if (phProperties.once) {

					this.decrease();

					phProperties.once = false;
				}
			}

			else {

				phProperties.once = true;
			}

			return data;
		},

		function () {}
	),

	temperature: new lib.Control (

		{

			input: lib.createAnalogSensor(

				temperatureProperties.input,

				temperatureProperties.inputBit,

				function () {

					var n = 10;

					var add = 0;

					for (var i = 0; i < n; i++) {

						add += (this.readFloat() * temperatureProperties.CONST);
					}

					return temperatureProperties.emulate?((Math.random() % 5) + maxTemperature):(add / n);
				}
			),

			led: lib.createOutput(temperatureProperties.led),

			alarm: function () {

				this.led.alarm(temperatureProperties.alarmTimes, temperatureProperties.alarmPeriod);
			},

			increase: function () {

				console.log('increasing temperature');
			},

			decrease: function () {

				console.log('decreasing temperature');
			}
		},

		function () {

			var data = this.input.myRead();
			
			if (data < minTemperature) {

				this.alarm();

				noise();

				console.log('temperature low');

				if (temperatureProperties.once) {

					this.increase();

					temperatureProperties.once = false;
				}
			}

			else if (data > maxTemperature) {

				this.alarm();

				noise();

				console.log('temperature high');

				if (temperatureProperties.once) {

					this.decrease();

					temperatureProperties.once = false;
				}
			}

			else {

				temperatureProperties.once = true;
			}

			return data;
		},

		function () {}
	)
};

var nodeFast = {

	waterLevel: waterLevelProperties,

	ph: phProperties,

	temperature: temperatureProperties
}
//CONTROL HANDLERS:
	
	for (var index in nodes) {

		nodes[index].setup();
				
		global[index + 'Value'] = nodes[index].check();

		console.log(index + ': ' + global[index + 'Value']);
	}


	setInterval(

		function () {

			for (var index in nodes) {

				global[index + 'Value'] = nodes[index].check();

				console.log(index + ': ' + global[index + 'Value']);
			}
		}, 

		timeConvert(30, 'seconds')
	);
//PROPERTIES FUNCTIONS:

	setInterval(

		function () {

			feedProperties.once = true;
		}, 

		timeConvert(8, 'hours')
	);
	
	setInterval(

		function () {

			for (var index in nodeProperties) {

				nodeFast[index].once = true;
			}
		},

		timeConvert()
	);

//REACT FUNCTION AND MODULES:

	function react (data) {

		return nodes[data.entity][data.instruction]();
	}

	module.exports = {

		react: react
	};
//END OF FILE;