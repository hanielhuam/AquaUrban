var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//BASE FUNCTIONS:

	global.def = function (currItem, defItem) {

		if (typeof defItem == "undefined" || (currItem !== undefined && typeof currItem == typeof defItem)) return currItem;

		else return defItem;
	};

	global.stdDateString = function (date) {

		date = def(date, new Date());

		var twoDigits = function (unity) {

			return (unity >= 10)?unity:('0' + unity);
		}; 

		var hoursAndMinutes = '(' + twoDigits(date.getHours()) + ':' + twoDigits(date.getMinutes()) + ')';

		var monthsAndDays = twoDigits(date.getMonth() + 1) + '/' + twoDigits(date.getDate());

		return date.getFullYear() + '/' + monthsAndDays + hoursAndMinutes;
	}

	global.timeConvert = function timeConvert (qnt, inMeasureType, outMeasureType) {

		qnt = def(qnt, 60);

		inMeasureType = def(inMeasureType, 'seconds');

		outMeasureType = def(outMeasureType, 'milliseconds');

		this.millis = function (measureType) {

			switch (measureType) {

				case 'milliseconds':

					return 1;
				case 'seconds':

					return 1000;
				case 'minutes':

					return 60000;
				case 'hours':

					return 3600000;
				case 'days':

					return 86400000;
				case 'weeks':

					return 604800000;
			}
		}

		return (qnt * this.millis(inMeasureType) / this.millis(outMeasureType));
	};

//REQUEST FUNCTIONS:
	
	app.get('/', function (req, res) {

	  res.sendFile(__dirname + '/_client/index.html');
	});

	app.use(express.static(__dirname + '/_client'));
	app.use('/client', express.static(__dirname + '/_client'));

//USER COMMUNICATION:

	io.on('connection', function (socket) {

		//BASIC:
  		
	  		console.log('a user connected');

		  	socket.on('disconnect', function () {
		    
		    	console.log('user disconnected');
	    	});

    	//ESPECIFIC:

    		socket.on('communicate', function (data) {

    			var response = communicate(data.data);

				if (data.response == 'all-response-data')

					response = {

						datasets: [

							{

								label: 'temperature',

								data: [23, 25, 23, 24, 23]
							}, 
							
							{
								label: 'ph',

								data: [6, 7, 5, 6, 5]
							}, 
							
							{
								label: 'water-level',

								data: [13, 15, 13, 14, 14]
							}
						],

						labels: updatedTime.array()
					};

				if (data.response == 'response-alert')

					response = [

						{date: stdDateString(new Date()), message: 'test', n: 0},
						
						{date: stdDateString(new Date(Date.now() - 40000)), message: 'test', n: 1},
						
						{date: stdDateString(new Date(Date.now() - 80000)), message: 'test', n: 2}
					];

    			if (data.response) socket.emit(data.response, response);
    		});
 	});

 	var listen = 3000;

	http.listen(listen, function() {

		console.log('listening on *:' + listen);
	});
//BOARD COMMUNICATION:

	var board = require('./_board/main.js');

	function communicate (data) {

		return board.react(data);
	}

//TEMPORARY:

	updatedTime = {

		array: function () {

			return [

				stdDateString(new Date(Date.now() - timeConvert(4, 'minutes'))),

				stdDateString(new Date(Date.now() - timeConvert(3, 'minutes'))),

				stdDateString(new Date(Date.now() - timeConvert(2, 'minutes'))),

				stdDateString(new Date(Date.now() - timeConvert())),

				stdDateString(new Date())
			];
		}
	};
//END OF FILE;