var Control = function (object, check, setup) {

	for (var index in object) {

		this[index] = object[index];
	}

	this.check = check;

	this.setup = setup;
}

module.exports = Control;