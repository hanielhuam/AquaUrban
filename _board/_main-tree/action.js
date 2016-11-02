//LIBRARIES:

	//EXPORTED:

		global.mraa = require('mraa');

		global.grove = require('jsupm_grove');

		global.grove_gprs = require('jsupm_grovegprs');

		global.lcd = require('jsupm_i2clcd');
	//MADE:

		global.lib = require('./../_board-libraries/libraries.js');

//REACT FUNCTION AND MODULES:

	var nodes = {

		boardBase: require('./_action-tree/aquaponics.js')
	};

	function react (data) {

		if (data.instruction == 'act' && data.entity == 'increase')

			data = {instruction: 'increase', entity: 'ph'};

		return nodes['boardBase'].react(data);
	}

	module.exports = {

		react: react
	};
//END OF FILE;