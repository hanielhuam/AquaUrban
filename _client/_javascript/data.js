$(function () {

	var mraa = {

		Aio: function (pos) {

			var aio = {

				pin: pos,

				bit: 10,

				setBit: function (bit) {

					aio.bit = bit;
				},

				read: function () {

					return Math.pow(2, aio.bit);
				},

				print: function () {

					console.log('aio: { pin: ' + aio.pin + '; bit: ' + aio.bit + '; read(): ' + aio.read() + '};');
				}
			};

			//console.log('aio: { pin: ' + aio.pin + '; bit: ' + aio.bit + '; read(): ' + aio.read() + '};');

			return aio;
		},

		Gpio: function (pos) {

			var gpio = {

				pin: pos,

				direction: mraa.DIR_OUT,

				dir: function (dir) {

					gpio.direction = dir;

					console.log('new dir: ' + dir);
				},

				write: function (value) {

					console.log('writing ' + value + ' value');
				}
			}

			return gpio;
		},

		DIR_OUT: "DIR_OUT"
	};

	class Sensor {

		constructor (pos, bit, readF) {
		
			this.pin = mraa.Aio(pos);

			this.bit = bit;

			this.pin.setBit(this.bit)

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

	var test = new Actuator({

			step: new mraa.Gpio(5),

			dir: new mraa.Gpio(4),

			tmp: new mraa.Gpio(3)
		},

		function (pins) {

			pins.step.write(0);
		}
	);

	test.write();

	var inTest = new Sensor(0, 10, function(pin, bit) {

		//console.log(pin.read());

		return (pin.read() / Math.pow(2, bit)) * 200;
	});

	console.log(inTest.read());
});

//DATA CLASS:

	class Data {

		constructor (dataFrame) {

			this.$frame = dataFrame;
		}

		setData (value) {

			this.$frame.css({

				marginTop: 200 - value,

				height: value
			});
		}
	}

//CHART CLASS:

	$('#chart').css({

		paddingRight: 0,

		paddingLeft: 0
	});

	class Chart {

		constructor (len) {

			this.$chart = $('#chart');

			this.array = [];

			this.len = len;

			this.dataWidth = (480 / (len * 2));

			while (len > 0) {

				this.$chart.append('<div class="chartData"></div>');

				this.array.push(new Data(this.$chart.find('.chartData').last()));

				len--;
			}

			this.$chart.find('.chartData').css({

				width: this.dataWidth,
				
				marginLeft: this.dataWidth / 2,

				marginRight: this.dataWidth / 2
			});
		}

		setData (index, value) {

			if (index >= this.len || index < 0 || value < 0 || value > 200) return false;

			this.array[index].setData(value);

			return true;
		}

		delete () {

			while (this.len > 0) {

				this.array[(this.len - 1)].$frame.remove();

				this.len--;
			}
		}
	}

	
//END OF FILE;