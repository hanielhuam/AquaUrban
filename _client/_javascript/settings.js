$(function () {

	//ALERT LOG:

		$.template('alert', $('#alert').html());

		requestAlerts();

		window.$alertDonwloader = $('#download');

		$alertDonwloader.on('click', function () {

			var blob = new Blob(getAlertString(), {type: "text/plain;charset=utf-8"});

			saveAs(blob, 'alert-log.txt');
		});

		window.$logCleaner = $('#clear');

		$logCleaner.on('click', function () {

			for (var index in log.alerts) {

				log.alerts[index].$frame.remove();

				removeAlert(log.alerts[index].data);
			}
		});
	//SETTINGS:

		$.template('setting0', $('#setting-template-1').html());

		$.template('setting1', $('#setting-template-2').html());

		window.settings = new SettingsFrame('#settings-outter-frame');

		settings.addSetting({id: 'feed', message: 'feed', messageComplement: 'the fishes in the aquarium'}, 0);

		settings.addSetting({id: 'ph', message: 'increase', messageComplement: 'ph'}, 0);
});

//ALERT LOG CLASSES AND FUNCTIONS:

	var AlertLog = function (id) {

		this.alerts = [];

		this.body = $(id);

		this.pushAlert = function (data) {

			this.alerts.push(new Alert(data, this.body));
		}
	};

	var Alert = function (data, frame) {

		$.tmpl('alert', data).appendTo(frame);

		this.data = data;

		this.$frame = $('#alert-' + data.n);

		frame = this.$frame;

		this.$closeButton = $('#close-button-' + data.n);

		this.$closeButton.on('click', function () {

			removeAlert(data);

			frame.remove();
		});
	};

	function newAlerts () {

		window.log = new AlertLog('#alert-log');

		for (var index in alerts) {

			log.pushAlert(alerts[index]);
		}
	}
//SETTINGS CLASSES AND FUNCTIONS:

	var SettingsFrame = function (id) {

		this.body = $(id);

		this.sets = {};

		this.addSetting = function (data, index, extraF) {

			this.sets[data.id] = new Setting(data, 'setting' + index, this.body, extraF);
		};
	};

	var Setting = function (data, type, frame, extraF) {

		$.tmpl(type, data).appendTo(frame);

		this.$form = $('#' + data.id + '-form');

		var that = this;

		this.$form.find('input').each(function (index, value) {

			that[$(this).attr('name')] = $(this);
		});

		this.$form.find('button').each(function (index, value) {

			that[$(this).attr('name')] = $(this);
		});

		this.$form.on('submit', function (e) {

			e.preventDefault();
		});

		if (this.act) {

			this.act.on('click', function (e) {

				actData = {

					instruction: 'act',

					entity: data.message,

					alertDetails: data.messageComplement
				};

				sendAct(actData);
			});
		}

		if (this.increase && this.decrease) {

			this.increase.on('click', function (e) {

				actData = {

					instruction: 'increase',

					entity: data.id
				};

				sendAct(actData);
			});

			this.decrease.on('click', function (e) {

				actData = {

					instruction: 'decrease',

					entity: data.id
				};

				sendAct(actData);
			});
		}

		if (extraF) extraF();
	};

	function sendAct (data) {

		if (makeAct(data)) {

			var newAlert = {};

			newAlert.date = stdDateString(new Date());

			var message;

			if (data.instruction == 'act') {

				message = data.entity;
			}

			else message = data.instruction + ' ' + data.entity;

			if (data.alertDetails) message = message.concat(' ' + data.alertDetails);

			newAlert.message = message;

			if (alerts[alerts.length - 1]) newAlert.n = parseInt(alerts[alerts.length - 1].n) + 1;

			else newAlert.n = 0;

			addAlert(newAlert);
		}
	}
//END OF FILE;