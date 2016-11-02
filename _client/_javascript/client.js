//BASE FUNCTIONS AND VARIABLES:

	var socket = io();

	function sonSet (currItem, defItem) {

		if (typeof currItem == "object" && typeof defItem == "object") {

			for (var index in defItem) {

				currItem[index] = sonSet(currItem[index], defItem[index]);
			}
		}

		currItem = def(currItem, defItem);

		return currItem;
	};

	function def (currItem, defItem) {

		if (typeof defItem == "undefined" || (currItem !== undefined && typeof currItem == typeof defItem)) return currItem;

		else return defItem;
	};
//LOGIN PART:

	function requestUser (data, form) {

		respondUser(data, form);
	}

	function respondUser (data, form) {

		form.response(

			{

				errors: {


				},

				data: {

					id: 0,

					name: 'Hafael Thor',

					adm: false,
				}
			}
		);
	}
//GRAPH PART:

	//DATA SENDERS:

		function settingsCheck (data) {

			var errors = [];

			var $host, message;

			var $start = $('#start-error'), $end = $('#end-error');

			var month;

			var maxDay = function (month) {

				switch (month) {

					case 1:

						return 31;
					case 2:

						return 29;
					case 3:

						return 31;
					case 4:

						return 30;
					case 5:

						return 31;
					case 6:

						return 30;
					case 7:

						return 31;
					case 8:

						return 31;
					case 9:

						return 30;
					case 10:

						return 31;
					case 11:

						return 30;
					case 12:

						return 31;
				}
			}

			$start.html('');

			$end.html('');

			for (var index in data) {

				data[index] = parseInt(data[index]);
			}

			for (var index in data) {

				if (isNaN(data[index])) {

					if ((/start/).test(index)) {

						$host = $start;

						message = 'please only insert numbers';
					}

					if ((/end/).test(index)) {

						$host = $end;

						message = 'please only insert numbers';
					}

					errors.push({$host: $host, message: message});
				}

				if ((/Year/).test(index) && (data[index] < 2000 || data[index] > (new Date().getFullYear()))) {

					if ((/start/).test(index)) $host = $start;

					if ((/end/).test(index)) $host = $end;

					message = 'please insert a proper year';

					errors.push({$host: $host, message: message});
				}

				if ((/Month/).test(index) && (data[index] < 0 || data[index] > 12)) {

					if ((/start/).test(index)) host = $start;

					if ((/end/).test(index)) $host = $end;

					message = 'please insert a proper month';

					errors.push({$host: $host, message: message});
				}
				else month = data[index];

				if ((/Day/).test(index) && (data[index] < 0 || data[index] > maxDay(month))) {

					if ((/start/).test(index)) $host = $start;

					if ((/end/).test(index)) $host = $end;

					message = 'please insert a proper day';

					errors.push({$host: $host, message: message});
				}

				if ((/Hour/).test(index) && (data[index] < 0 || data[index] >= 24)) {

					if ((/start/).test(index)) $host = $start;

					if ((/end/).test(index)) $host = $end;

					message = 'please insert a proper hour';

					errors.push({$host: $host, message: message});
				}

				if ((/Minute/).test(index) && (data[index] < 0 || data[index] >= 60)) {

					if ((/start/).test(index)) $host = $start;

					if ((/end/).test(index)) $host = $end;

					message = 'please insert a proper minute';

					errors.push({$host: $host, message: message});
				}
			}

			var revertedErrors = errors.reverse();

			for (var index in revertedErrors) {

				revertedErrors[index].$host.html(revertedErrors[index].message);
			}

			if (!errors.length) {

				var start = {

					year: data.startYear,

					month: data.startMonth,

					day: data.startDay,

					hour: data.startHour,

					minute: data.startMinute
				};

				var end = {

					year: data.endYear,

					month: data.endMonth,

					day: data.endDay,

					hour: data.endHour,

					minute: data.endMinute
				};

				searchData(start, end)

				return {success: true};
			}
			else return {success: false};
		}

		function requestRecent (index) {

			socket.emit(

				'communicate', 
				
				{

					response: 'one-response-data', 

					data: {

						path: 'query', 

						data: {

							path: 'data', 

							data: {

								path: 'one',

								data: {

									index: index
								}
							}
						}
					}
				}
			);
		}

		function requestAllRecent () {

			socket.emit(

				'communicate', 

				{
					response: 'all-response-data', 

					data: {

						path: 'query', 

						data: {

							path: 'data', 

							data: {

								path: 'all',

								data: {}
							}
						}
					}
				}
			);
		}

		function searchData(start, end) {

			socket.emit(

				'communicate', 

				{

					response: 'all-response-data', 

					data: {

						path: 'query', 

						data: {

							path: 'data', 

							data: {

								path: 'all',

								data: {

									start: start, 

									end: end
								}
							}
						}
					}
				}
			);
		}
	//DATA RECEIVERS:

		socket.on('one-response-data', function (data) {

			update(data.data, data.index, data.date);
		});

		socket.on('all-response-data', function (data) {

			updateAll(data);
		});
//SETTINGS PART:

	//ALERT LOG:

		window.alerts = [];

		//DATA SENDERS:

			function requestAlerts () {

				socket.emit(

					'communicate', 

					{

						response: 'response-alert',

						data: {

							path: 'query', 

							data: {

								path: 'alert', 

								data: {

								}
							}
						}
					}
				);
			}

			function removeAlert (data) {

				aux = [];

				for (var index in alerts) {

					if (alerts[index].n == data.n) {

						delete alerts[index];
					}

					else aux.push(alerts[index]);
				}

				alerts = aux;
			}

			function addAlert (data) {

				alerts.push(data);

				log.pushAlert(data);
			}

			function getAlertString () {

				var file = [];

				var line = "";

				for (var index in alerts) {

					line = alerts[index].date + ': ' + alerts[index].message + '\n';

					file.push(line);
				}

				return file;
			}
		//DATA RECEIVERS:

			socket.on('response-alert', function (data) {

				alerts = data;

				newAlerts();
			});
	//SETTINGS:

		//DATA SENDERS:

			function makeAct (data) {

				minData = {

					instruction: data.instruction,

					entity: data.entity
				};

				socket.emit(

					'communicate',

					{

						data: {

							path: 'action', 

							data: {

								instruction: data.instruction, 

								entity: data.entity
							}
						}
					}
				);

				return true;
			}
//DATE AND TIME UTILITIES:

	window.updatedTime = {

		array: function () {

			return [

				stdDateString(new Date(Date.now() - timeConvert(4 * 60))),

				stdDateString(new Date(Date.now() - timeConvert(3 * 60))),

				stdDateString(new Date(Date.now() - timeConvert(2 * 60))),

				stdDateString(new Date(Date.now() - timeConvert(60))),

				stdDateString(new Date())
			];
		}
	};

	function stdDateString (date) {

		date = def(date, new Date());

		var twoDigits = function (unity) {

			return (unity >= 10)?unity:('0' + unity);
		}; 

		var hoursAndMinutes = '(' + twoDigits(date.getHours()) + ':' + twoDigits(date.getMinutes()) + ')';

		var monthsAndDays = twoDigits(date.getMonth() + 1) + '/' + twoDigits(date.getDate());

		return date.getFullYear() + '/' + monthsAndDays + hoursAndMinutes;
	}
//END OF FILE;