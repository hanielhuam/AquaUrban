var mraa = require('mraa');

var pin = new mraa.Gpio(13);

pin.dir(mraa.DIR_OUT);

var state = true;

setInterval(

	function () {

		pin.write(state?1:0);

		state = !state;
	}, 

	100
);
